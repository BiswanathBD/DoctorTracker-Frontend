export interface DoctorPatient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  condition: string;
  admissionDate: string;
  avatar?: {
    url: string;
    key: string;
  };
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  avatar?: {
    url: string;
    key: string;
  };
  note?: string;
  patientCount?: number;
  patients?: DoctorPatient[];
  assignedPatients?: DoctorPatient[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  specialization?: string;
  hospital?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DoctorsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Doctor[];
}

export interface DoctorFormData {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  note?: string;
}

