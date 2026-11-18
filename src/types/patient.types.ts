export interface PatientDoctorInfo {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  email: string;
  phone: string;
  avatar?: {
    url: string;
    key: string;
  };
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  condition: string;
  avatar?: {
    url: string;
    key: string;
  };
  doctorId?: PatientDoctorInfo | string | null;
  admissionDate: string;
  releaseDate?: string | null;
  isReleased?: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  condition?: string;
  gender?: string;
  doctorId?: string;
  startDate?: string;
  endDate?: string;
  isReleased?: string | boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PatientsResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Patient[];
}

export interface PatientFormData {
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  condition: string;
  doctorId: string;
  admissionDate: string;
  note?: string;
}
