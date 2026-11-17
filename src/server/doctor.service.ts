import { AuthService } from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface DoctorPatient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  condition: string;
  admissionDate: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
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

export const DoctorService = {
  // get all doctors with query params
  async getAllDoctors(params: DoctorQueryParams = {}): Promise<DoctorsResponse> {
    const token = AuthService.getToken();
    const query = new URLSearchParams();

    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.searchTerm) query.set('searchTerm', params.searchTerm);
    if (params.specialization) query.set('specialization', params.specialization);
    if (params.hospital) query.set('hospital', params.hospital);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const res = await fetch(`${API_URL}/doctors?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch doctors');
    return {
      meta: data.meta,
      data: data.data,
    };
  },

  // get single doctor with patient list
  async getDoctorById(id: string): Promise<Doctor> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/doctors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch doctor');
    return data.data;
  },

  // create a new doctor
  async createDoctor(payload: Omit<Doctor, '_id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/doctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to create doctor');
    return data.data;
  },

  // update doctor
  async updateDoctor(id: string, payload: Partial<Doctor>): Promise<Doctor> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/doctors/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to update doctor');
    return data.data;
  },

  // delete doctor
  async deleteDoctor(id: string): Promise<void> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/doctors/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to delete doctor');
  },

  // add patient directly under a doctor
  async addPatientToDoctor(doctorId: string, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/doctors/${doctorId}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to add patient under doctor');
    return data.data;
  },

  // remove patient from doctor
  async removePatientFromDoctor(doctorId: string, patientId: string): Promise<void> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/doctors/${doctorId}/patients/${patientId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to remove patient from doctor');
  },

  // get distinct specializations
  async getSpecializations(): Promise<string[]> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/doctors/specializations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch specializations');
    return data.data || [];
  },

  // get distinct hospitals
  async getHospitals(): Promise<string[]> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/doctors/hospitals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch hospitals');
    return data.data || [];
  },
};
