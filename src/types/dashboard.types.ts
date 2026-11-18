export interface DashboardOverview {
  totalDoctors: number;
  totalPatients: number;
  totalHospitals: number;
  avgPatientsPerDoctor: number;
}

export interface PatientsPerDoctorItem {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  patientCount: number;
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

export interface DashboardStats {
  overview: DashboardOverview;
  patientsPerDoctor: PatientsPerDoctorItem[];
  specializationStats: SpecializationStatItem[];
  conditionStats: ConditionStatItem[];
  timeline: {
    patients: Array<{ date: string; patients: number }>;
    doctors: Array<{ date: string; doctors: number }>;
  };
}
