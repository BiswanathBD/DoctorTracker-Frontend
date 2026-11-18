'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Modal, Input, Button } from '@/components/ui';
import { Select } from '@/components/ui/Select';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { type Patient, type PatientFormData } from '@/types/patient.types';
import { type Doctor } from '@/types/doctor.types';
import {
  Users,
  HeartPulse,
  Phone,
  Mail,
  Calendar,
  Stethoscope,
  Camera,
  Trash2,
  Check,
  Plus,
  FileText,
} from 'lucide-react';

export interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPatient: Patient | null;
  patientForm: PatientFormData;
  setPatientForm: React.Dispatch<React.SetStateAction<PatientFormData>>;
  doctorsList: Doctor[];
  avatarPreviewUrl: string | null;
  onAvatarChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  disableDoctorSelect?: boolean;
  title?: string;
  description?: string;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  editingPatient,
  patientForm,
  setPatientForm,
  doctorsList,
  avatarPreviewUrl,
  onAvatarChange,
  onSubmit,
  submitting,
  disableDoctorSelect = false,
  title,
  description,
}) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // track initial avatar state
  const initialAvatar = editingPatient?.avatar?.url || null;

  const modalTitle = title || (editingPatient ? 'Edit Patient' : 'Register Patient');
  const modalDescription =
    description ||
    (editingPatient
      ? 'Update clinical record, assigned specialist, or contact information'
      : 'Admit a new patient into clinical care and specialist tracking');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      description={modalDescription}
      icon={<Users className="w-5 h-5 text-secondary" />}
      maxWidth="xl"
    >
      <form onSubmit={onSubmit} autoComplete="off" className="flex flex-col flex-1 min-h-0">
        {/* scrollable center content */}
        <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-6 space-y-4">
          {/* patient photo on left, name & age stacked on right */}
          <div className="flex flex-col sm:flex-row gap-3.5 items-stretch">
          {/* profile avatar upload */}
          <MotionWrapper
            animationType="scale"
            delay={0.1}
            duration={0.3}
            className="shrink-0 w-full sm:w-36 md:w-40 aspect-square sm:aspect-auto self-stretch flex flex-col"
          >
            <div className="relative group w-full h-full min-h-35 flex-1 flex flex-col">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => onAvatarChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div
                onClick={() => !submitting && avatarInputRef.current?.click()}
                className={`relative w-full h-full min-h-35 flex-1 rounded-3xl bg-muted/40 border border-border overflow-hidden flex flex-col items-center justify-center transition-all duration-200 group ${submitting
                  ? 'opacity-60 cursor-not-allowed pointer-events-none'
                  : 'hover:bg-muted/70 hover:border-secondary cursor-pointer'
                  }`}
              >
                {avatarPreviewUrl ? (
                  <Image
                    src={avatarPreviewUrl}
                    alt={patientForm.name || 'Patient Photo'}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center text-muted-foreground group-hover:text-secondary transition-colors">
                    <div className="w-11 h-11 rounded-full bg-card shadow-sm flex items-center justify-center text-secondary mb-1.5 group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Patient Photo</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Click to upload</span>
                  </div>
                )}

                {/* hover overlay */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-bold">
                    {avatarPreviewUrl ? 'Change Photo' : 'Upload Photo'}
                  </span>
                </div>
              </div>

              {/* delete avatar button on hover */}
              {avatarPreviewUrl && !submitting && (
                <button
                  type="button"
                  className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 px-2.5 py-1 rounded-full bg-destructive hover:bg-destructive/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAvatarChange(null);
                    if (avatarInputRef.current) avatarInputRef.current.value = '';
                  }}
                  title={initialAvatar ? 'Delete avatar' : 'Remove photo'}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{initialAvatar ? 'Delete' : 'Remove'}</span>
                </button>
              )}
            </div>
          </MotionWrapper>

          {/* name and age stacked */}
          <div className="flex-1 flex flex-col justify-between gap-3.5">
            <MotionWrapper animationType="fadeRight" delay={0.15} duration={0.3}>
              <Input
                label="Patient Name"
                placeholder="e.g. Mahfuzur Rahman"
                required
                variant="secondary"
                disabled={submitting}
                value={patientForm.name}
                onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                leftIcon={<Users className="w-4 h-4" />}
              />
            </MotionWrapper>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <MotionWrapper animationType="fadeRight" delay={0.2} duration={0.3}>
                <Input
                  label="Age"
                  type="number"
                  placeholder="34"
                  required
                  variant="secondary"
                  disabled={submitting}
                  value={patientForm.age}
                  onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                />
              </MotionWrapper>

              <MotionWrapper animationType="fadeRight" delay={0.25} duration={0.3}>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Gender</label>
                  <Select
                    variant="secondary"
                    value={patientForm.gender}
                    onChange={(val) => setPatientForm({ ...patientForm, gender: val || 'Male' })}
                    options={[
                      { label: 'Male', value: 'Male' },
                      { label: 'Female', value: 'Female' },
                      { label: 'Other', value: 'Other' },
                    ]}
                    disabled={submitting}
                    placeholder="Select Gender"
                  />
                </div>
              </MotionWrapper>
            </div>
          </div>
        </div>

        {/* medical condition and phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <MotionWrapper animationType="fadeUp" delay={0.3} duration={0.3}>
            <Input
              label="Diagnosis / Condition"
              placeholder="e.g. Acute Bronchitis, Diabetes"
              required
              variant="secondary"
              disabled={submitting}
              value={patientForm.condition}
              onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
              leftIcon={<HeartPulse className="w-4 h-4" />}
            />
          </MotionWrapper>

          <MotionWrapper animationType="fadeUp" delay={0.35} duration={0.3}>
            <Input
              label="Contact Phone"
              placeholder="+880 1712-345678"
              required
              variant="secondary"
              disabled={submitting}
              value={patientForm.phone}
              onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </MotionWrapper>
        </div>

        {/* row 3: assigned doctor selection */}
        <MotionWrapper animationType="fadeUp" delay={0.4} duration={0.3}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Attending Specialist</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                {disableDoctorSelect ? 'Assigned doctor' : 'Required for clinical tracking'}
              </span>
            </label>
            <Select
              variant="secondary"
              value={patientForm.doctorId}
              onChange={(val) => setPatientForm({ ...patientForm, doctorId: val })}
              options={doctorsList.map((doc) => ({
                label: `${doc.name} — ${doc.specialization} (${doc.hospital})`,
                value: doc._id,
                icon: <Stethoscope className="w-3.5 h-3.5 text-secondary" />,
              }))}
              disabled={submitting || disableDoctorSelect}
              placeholder="Choose attending doctor..."
              icon={<Stethoscope className="w-3.5 h-3.5 text-secondary" />}
            />
          </div>
        </MotionWrapper>

        {/* row 4: email (optional) and admission date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <MotionWrapper animationType="fadeUp" delay={0.45} duration={0.3}>
            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="patient@example.com"
              variant="secondary"
              disabled={submitting}
              value={patientForm.email}
              onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </MotionWrapper>

          <MotionWrapper animationType="fadeUp" delay={0.5} duration={0.3}>
            <Input
              label="Admission Date"
              type="date"
              required
              variant="secondary"
              disabled={submitting}
              value={patientForm.admissionDate}
              onChange={(e) => setPatientForm({ ...patientForm, admissionDate: e.target.value })}
              leftIcon={<Calendar className="w-4 h-4" />}
            />
          </MotionWrapper>
        </div>

        {/* row 5: medical notes / remarks */}
        <MotionWrapper animationType="fadeUp" delay={0.52} duration={0.3}>
          <Input
            label="Medical Notes / Observations (Optional)"
            placeholder="Add observations, allergy alerts, or clinical notes..."
            variant="secondary"
            disabled={submitting}
            value={patientForm.note || ''}
            onChange={(e) => setPatientForm({ ...patientForm, note: e.target.value })}
            leftIcon={<FileText className="w-4 h-4" />}
          />
        </MotionWrapper>
      </div>

      {/* fixed footer following Profile Drawer 1:1 */}
      <div className="shrink-0 p-5 px-6 border-t border-border/80 bg-card/95 backdrop-blur-md flex items-center justify-end gap-2.5 z-10">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={submitting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          loading={submitting}
          leftIcon={editingPatient ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        >
          {editingPatient ? 'Save Changes' : 'Register Patient'}
        </Button>
      </div>
    </form>
  </Modal>
  );
};
