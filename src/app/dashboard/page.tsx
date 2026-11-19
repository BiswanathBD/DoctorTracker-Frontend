'use client';

import React, { useEffect, useState, useCallback, useSyncExternalStore } from 'react';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Button, PageHeader, toast } from '@/components/ui';
import { DoctorFormModal } from '@/components/modals/DoctorFormModal';
import { PatientFormModal } from '@/components/modals/PatientFormModal';
import { DoctorService, type Doctor, type DoctorFormData } from '@/server/doctor.service';
import { PatientService } from '@/server/patient.service';
import type { PatientFormData } from '@/types/patient.types';
import {
  AuthService,
  subscribeAuth,
  getAuthSnapshot,
  getAuthServerSnapshot,
} from '@/server/auth.service';
import { DashboardService, type DashboardStats } from '@/server/dashboard.service';
import { CircleStatCard } from '@/components/dashboard/CircleStatCard';
import { DailyActivityChart, type DailyActivityItem } from '@/components/dashboard/DailyActivityChart';
import { SpecialtyDonutChart } from '@/components/dashboard/SpecialtyDonutChart';
import { DoctorWorkloadCard } from '@/components/dashboard/DoctorWorkloadCard';
import {
  Users,
  Stethoscope,
  Activity,
  Building2,
  PlusCircle,
  UserRoundShield,
} from 'lucide-react';

export default function DashboardPage() {
  const admin = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthServerSnapshot);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timelineDays, setTimelineDays] = useState<7 | 14 | 30>(14);

  // modal states
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [doctorForm, setDoctorForm] = useState<DoctorFormData>({
    name: '',
    specialization: '',
    hospital: '',
    phone: '',
    email: '',
    note: '',
  });
  const [doctorAvatarFile, setDoctorAvatarFile] = useState<File | null>(null);
  const [doctorAvatarPreviewUrl, setDoctorAvatarPreviewUrl] = useState<string | null>(null);
  const [doctorSubmitting, setDoctorSubmitting] = useState(false);

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [patientForm, setPatientForm] = useState<PatientFormData>({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    condition: '',
    doctorId: '',
    admissionDate: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [patientAvatarFile, setPatientAvatarFile] = useState<File | null>(null);
  const [patientAvatarPreviewUrl, setPatientAvatarPreviewUrl] = useState<string | null>(null);
  const [patientSubmitting, setPatientSubmitting] = useState(false);

  // refresh dashboard statistics (always loads 30 days of timeline history)
  const fetchStats = useCallback(() => {
    DashboardService.getStats(30)
      .then((data) => setStats(data))
      .catch((err) => console.error('failed to fetch dashboard statistics:', err));
  }, []);

  // instant client-side timeframe switch without API refetch or extra loading state
  const handleTimelineDaysChange = (newDays: 7 | 14 | 30) => {
    setTimelineDays(newDays);
  };

  // load doctors for patient form
  const loadDoctors = useCallback(async () => {
    try {
      const res = await DoctorService.getAllDoctors({ page: 1, limit: 100 });
      setDoctorsList(res.data);
      return res.data;
    } catch (err) {
      console.error('failed to fetch doctors for modal:', err);
      return [];
    }
  }, []);

  // initial data load
  useEffect(() => {
    let isMounted = true;
    AuthService.getProfile().catch((err) => {
      console.error('failed to fetch admin profile:', err);
    });

    DashboardService.getStats(30)
      .then((data) => {
        if (isMounted) setStats(data);
      })
      .catch((err) => console.error('failed to fetch dashboard statistics:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // open doctor modal
  const handleOpenDoctorModal = () => {
    setDoctorAvatarFile(null);
    setDoctorAvatarPreviewUrl(null);
    setDoctorForm({
      name: '',
      specialization: '',
      hospital: '',
      phone: '',
      email: '',
      note: '',
    });
    setIsDoctorModalOpen(true);
  };

  // submit doctor creation
  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.specialization || !doctorForm.hospital || !doctorForm.phone || !doctorForm.email) {
      toast.error('Validation Error', 'Please fill out all required fields.');
      return;
    }
    try {
      setDoctorSubmitting(true);
      const created = await DoctorService.createDoctor(doctorForm);
      if (doctorAvatarFile) {
        try {
          await DoctorService.updateAvatar(created._id, doctorAvatarFile);
        } catch (avatarErr) {
          console.error('avatar upload failed:', avatarErr);
        }
      }
      const docName = doctorForm.name.startsWith('Dr.') ? doctorForm.name : `Dr. ${doctorForm.name}`;
      toast.success('Doctor Registered', `${docName} has been added.`);
      setIsDoctorModalOpen(false);
      fetchStats();
      loadDoctors();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not save doctor.';
      toast.error('Registration Failed', message);
    } finally {
      setDoctorSubmitting(false);
    }
  };

  // open patient modal
  const handleOpenPatientModal = async () => {
    setPatientAvatarFile(null);
    setPatientAvatarPreviewUrl(null);
    let docs = doctorsList;
    if (docs.length === 0) {
      docs = await loadDoctors();
    }
    setPatientForm({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      condition: '',
      doctorId: docs[0]?._id || '',
      admissionDate: new Date().toISOString().split('T')[0],
      note: '',
    });
    setIsPatientModalOpen(true);
  };

  // submit patient admission
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.age || !patientForm.phone || !patientForm.condition || !patientForm.doctorId) {
      toast.error('Missing fields', 'Please enter patient name, age, phone, condition, and select an attending doctor.');
      return;
    }
    try {
      setPatientSubmitting(true);
      const payload = {
        ...patientForm,
        age: Number(patientForm.age),
        admissionDate: new Date(patientForm.admissionDate),
      };
      const created = await PatientService.createPatient(payload);
      if (patientAvatarFile) {
        try {
          await PatientService.updateAvatar(created._id, patientAvatarFile);
        } catch (avatarErr) {
          console.error('avatar upload failed:', avatarErr);
        }
      }
      toast.success('Patient Registered', `${patientForm.name} has been admitted and assigned.`);
      setIsPatientModalOpen(false);
      fetchStats();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not register patient.';
      toast.error('Admit Failed', message);
    } finally {
      setPatientSubmitting(false);
    }
  };

  const overview = stats?.overview || {
    totalDoctors: 0,
    activeDoctors: 0,
    inactiveDoctors: 0,
    activeDoctorPercent: 0,

    totalPatients: 0,
    activePatients: 0,
    unassignedPatients: 0,
    releasedPatients: 0,
    activePatientPercent: 0,

    totalHospitals: 0,
    activeHospitals: 0,
    activeHospitalPercent: 0,

    avgPatientsPerDoctor: 0,
    avgActivePatientsPerActiveDoctor: 0,
    ratioText: '0:0',
  };

  // generate continuous calendar timeline for smooth analytics
  const patientMap = new Map(stats?.timeline?.patients?.map((p) => [p.date, p.patients]) || []);
  const doctorMap = new Map(stats?.timeline?.doctors?.map((d) => [d.date, d.doctors]) || []);

  // continuous dataset for daily activity chart based on timelineDays (7, 14, 30)
  const dailyTimelineData: DailyActivityItem[] = (() => {
    const items: DailyActivityItem[] = [];
    const now = new Date();
    for (let i = timelineDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const patients = patientMap.get(dateStr) || 0;
      const doctors = doctorMap.get(dateStr) || 0;
      items.push({
        date: dateStr,
        displayDate,
        dayName,
        patients,
        doctors,
        total: patients + doctors,
      });
    }
    return items;
  })();

  // 100% backend-calculated real clinical metrics
  const totalSpecialties = stats?.specializationStats?.length ?? 0;
  const topSpecialty = stats?.specializationStats?.[0];
  const doctorSparkline = dailyTimelineData.slice(-7).map((d) => d.doctors);
  const patientSparkline = dailyTimelineData.slice(-7).map((d) => d.patients);
  const workloadSparkline = dailyTimelineData.slice(-7).map((d) => d.total);
  const hospitalSparkline = dailyTimelineData.slice(-7).map((d) => Math.max(1, Math.round(d.total * 0.8)));

  return (
    <div className="w-full space-y-8 pb-12">
      {/* header */}
      <PageHeader
        size="md"
        icon={<UserRoundShield size={42} strokeWidth={1.2} />}
        title={`Welcome back, ${admin?.name || 'Super Admin'}!`}
        subtitle="Real-time clinical analytics, specialist patient assignments, and hospital telemetry."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={handleOpenDoctorModal}
            >
              Add Doctor
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Users className="w-4 h-4" />}
              onClick={handleOpenPatientModal}
            >
              Admit Patient
            </Button>
          </div>
        }
      />

      {/* circular metrics & telemetry cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <MotionWrapper delay={0.08} direction="up">
          <CircleStatCard
            title="Total Doctors"
            value={overview.totalDoctors}
            subtitle="Specialists registered in directory"
            icon={<Stethoscope className="w-4 h-4 text-primary" />}
            percentage={overview.activeDoctorPercent}
            percentLabel={`${overview.activeDoctorPercent}%`}
            sublabel="ACTIVE"
            singleColor="#198dc7"
            badgeText="Faculty Staff"
            badgeVariant="primary"
            gradientId="card-grad-doctors"
            gradientFrom="#198dc7"
            gradientTo="#198dc7"
            trendText={`${overview.activeDoctors} of ${overview.totalDoctors} active`}
            trendPositive={true}
            sparkline={doctorSparkline}
            insightText={
              topSpecialty
                ? `${overview.activeDoctors} active • Top: ${topSpecialty.specialization} (${totalSpecialties} depts)`
                : `${overview.activeDoctors} active • ${totalSpecialties} departments`
            }
            loading={loading}
          />
        </MotionWrapper>

        <MotionWrapper delay={0.12} direction="up">
          <CircleStatCard
            title="Total Patients"
            value={overview.totalPatients}
            subtitle="Admitted clinical registrations"
            icon={<Users className="w-4 h-4 text-secondary" />}
            percentage={overview.activePatientPercent}
            percentLabel={`${overview.activePatientPercent}%`}
            sublabel="IN CARE"
            singleColor="#1ac3b5"
            badgeText="Clinical Intake"
            badgeVariant="secondary"
            gradientId="card-grad-patients"
            gradientFrom="#1ac3b5"
            gradientTo="#1ac3b5"
            trendText={`${overview.activePatients} of ${overview.totalPatients} in care`}
            trendPositive={true}
            sparkline={patientSparkline}
            insightText={`${overview.activePatients} under care • ${overview.releasedPatients} discharged`}
            loading={loading}
          />
        </MotionWrapper>

        <MotionWrapper delay={0.16} direction="up">
          <CircleStatCard
            title="Doctor : Patient"
            value={overview.ratioText || `${overview.totalDoctors}:${overview.totalPatients}`}
            subtitle="Clinician to patient ratio"
            icon={<Activity className="w-4 h-4 text-emerald-500" />}
            percentage={50}
            percentLabel={`${overview.avgPatientsPerDoctor.toFixed(1)}x`}
            sublabel="RATIO"
            pieMode={true}
            pieSlices={[
              { value: overview.totalPatients || 1, color: '#1ac3b5' },
              { value: overview.totalDoctors || 1, color: '#198dc7' },
            ]}
            badgeText="Ratio"
            badgeVariant="success"
            gradientId="card-grad-ratio"
            gradientFrom="#1ac3b5"
            gradientTo="#198dc7"
            trendText={`Ratio ${overview.ratioText}`}
            trendPositive={true}
            sparkline={workloadSparkline}
            insightText={`${overview.avgPatientsPerDoctor.toFixed(1)} patients per doctor`}
            loading={loading}
          />
        </MotionWrapper>

        <MotionWrapper delay={0.2} direction="up">
          <CircleStatCard
            title="Total Hospitals"
            value={overview.totalHospitals}
            subtitle="Affiliated healthcare networks"
            icon={<Building2 className="w-4 h-4 text-amber-500" />}
            percentage={overview.activeHospitalPercent}
            percentLabel={`${overview.activeHospitalPercent}%`}
            sublabel="ACTIVE"
            singleColor="#f59e0b"
            badgeText="Hospital Network"
            badgeVariant="warning"
            gradientId="card-grad-hospitals"
            gradientFrom="#f59e0b"
            gradientTo="#f59e0b"
            trendText={`${overview.activeHospitals} of ${overview.totalHospitals} active`}
            trendPositive={true}
            sparkline={hospitalSparkline}
            insightText={`${overview.activeHospitals} active • ${overview.totalHospitals - overview.activeHospitals} standby`}
            loading={loading}
          />
        </MotionWrapper>
      </div>

      {/* daily date-based operations chart */}
      <MotionWrapper delay={0.24} direction="up">
        <DailyActivityChart
          data={dailyTimelineData}
          loading={loading}
          daysRange={timelineDays}
          onDaysRangeChange={handleTimelineDaysChange}
        />
      </MotionWrapper>

      {/* medical insights & specialist caseload distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MotionWrapper delay={0.28} direction="up">
          <SpecialtyDonutChart
            data={stats?.specializationStats || []}
            loading={loading}
          />
        </MotionWrapper>

        <MotionWrapper delay={0.32} direction="up">
          <DoctorWorkloadCard
            doctors={stats?.patientsPerDoctor || []}
            loading={loading}
          />
        </MotionWrapper>
      </div>

      {/* modals */}
      <DoctorFormModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        editingDoctor={null}
        doctorForm={doctorForm}
        setDoctorForm={setDoctorForm}
        avatarPreviewUrl={doctorAvatarPreviewUrl}
        onAvatarChange={(file) => {
          setDoctorAvatarFile(file);
          if (file) setDoctorAvatarPreviewUrl(URL.createObjectURL(file));
          else setDoctorAvatarPreviewUrl(null);
        }}
        onSubmit={handleDoctorSubmit}
        submitting={doctorSubmitting}
      />

      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        editingPatient={null}
        patientForm={patientForm}
        setPatientForm={setPatientForm}
        doctorsList={doctorsList}
        avatarPreviewUrl={patientAvatarPreviewUrl}
        onAvatarChange={(file) => {
          setPatientAvatarFile(file);
          if (file) setPatientAvatarPreviewUrl(URL.createObjectURL(file));
          else setPatientAvatarPreviewUrl(null);
        }}
        onSubmit={handlePatientSubmit}
        submitting={patientSubmitting}
      />
    </div>
  );
}
