import { AuthService } from './auth.service';
import type { Doctor, DoctorPatient, DoctorQueryParams, DoctorsResponse, DoctorFormData } from '@/types/doctor.types';

export type { Doctor, DoctorPatient, DoctorQueryParams, DoctorsResponse, DoctorFormData };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const DoctorService = {
  // get all doctors with query params
  async getAllDoctors(params: DoctorQueryParams = {}): Promise<DoctorsResponse> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.searchTerm) query.append('searchTerm', params.searchTerm);
    if (params.specialization) query.append('specialization', params.specialization);
    if (params.hospital) query.append('hospital', params.hospital);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/doctors?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch doctors');
    return data;
  },

  // get single doctor by id
  async getDoctorById(id: string): Promise<Doctor> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/doctors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch doctor details');
    return data.data;
  },

  // create new doctor
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

  // update doctor by id
  async updateDoctor(
    id: string,
    payload: Partial<Omit<Doctor, '_id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Doctor> {
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

  // update doctor avatar
  async updateAvatar(doctorId: string, file: File): Promise<Doctor> {
    const token = AuthService.getToken();
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch(`${API_URL}/doctors/${doctorId}/avatar`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to update doctor avatar');
    return data.data;
  },

  // delete doctor by id
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

  // add patient directly to a doctor
  async addPatientToDoctor(
    doctorId: string,
    payload: {
      name: string;
      age: number;
      gender: string;
      phone: string;
      condition: string;
      email?: string;
      admissionDate?: string;
    }
  ): Promise<DoctorPatient> {
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
