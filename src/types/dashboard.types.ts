export interface DashboardOverview {
  totalDoctors: number;
  activeDoctors: number;
  inactiveDoctors: number;
  activeDoctorPercent: number;

  totalPatients: number;
  activePatients: number;
  unassignedPatients: number;
  releasedPatients: number;
  activePatientPercent: number;

  totalHospitals: number;
  activeHospitals: number;
  activeHospitalPercent: number;

  avgPatientsPerDoctor: number;
  avgActivePatientsPerActiveDoctor: number;
  ratioText: string;
}

export interface PatientsPerDoctorItem {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  patientCount: number;
  avatar?: {
    url: string;
    key?: string;
  };
}

export interface SpecializationStatItem {
  specialization: string;
  count: number;
}

export interface ConditionStatItem {
  condition: string;
  count: number;
}

export interface TimelinePoint {
  date: string;
  patients?: number;
  doctors?: number;
}

export interface TodaysReport {
  newAdmissions: number;
  newDoctors: number;
  releasedToday: number;
  activeUnderCare: number;
  occupancyRate?: number;
}

export interface DashboardStats {
  overview: DashboardOverview;
  todaysReport?: TodaysReport;
  timelineDays: number;
  patientsPerDoctor: PatientsPerDoctorItem[];
  specializationStats: SpecializationStatItem[];
  conditionStats: ConditionStatItem[];
  timeline: {
    patients: Array<{ date: string; patients: number }>;
    doctors: Array<{ date: string; doctors: number }>;
  };
}
