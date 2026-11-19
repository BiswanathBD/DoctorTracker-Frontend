import { apiClient } from './api.client';
import type { Doctor, DoctorPatient, DoctorQueryParams, DoctorsResponse, DoctorFormData } from '@/types/doctor.types';

export type { Doctor, DoctorPatient, DoctorQueryParams, DoctorsResponse, DoctorFormData };

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const DoctorService = {
  // get all doctors with query params
  async getAllDoctors(params: DoctorQueryParams = {}): Promise<DoctorsResponse> {
    return apiClient<DoctorsResponse>('/doctors', {
      params: {
        page: params.page,
        limit: params.limit,
        searchTerm: params.searchTerm,
        specialization: params.specialization,
        hospital: params.hospital,
        startDate: params.startDate,
        endDate: params.endDate,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      },
    });
  },

  // get single doctor by id
  async getDoctorById(id: string): Promise<Doctor> {
    const res = await apiClient<ApiResponse<Doctor>>(`/doctors/${id}`);
    return res.data;
  },

  // create new doctor
  async createDoctor(payload: Omit<Doctor, '_id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> {
    const res = await apiClient<ApiResponse<Doctor>>('/doctors', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // update doctor by id
  async updateDoctor(
    id: string,
    payload: Partial<Omit<Doctor, '_id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Doctor> {
    const res = await apiClient<ApiResponse<Doctor>>(`/doctors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // update doctor avatar
  async updateAvatar(doctorId: string, file: File): Promise<Doctor> {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await apiClient<ApiResponse<Doctor>>(`/doctors/${doctorId}/avatar`, {
      method: 'PATCH',
      body: formData,
    });
    return res.data;
  },

  // delete doctor avatar
  async deleteAvatar(doctorId: string): Promise<Doctor> {
    const res = await apiClient<ApiResponse<Doctor>>(`/doctors/${doctorId}/avatar`, {
      method: 'DELETE',
    });
    return res.data;
  },

  // delete doctor by id
  async deleteDoctor(id: string): Promise<void> {
    await apiClient(`/doctors/${id}`, {
      method: 'DELETE',
    });
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
    const res = await apiClient<ApiResponse<DoctorPatient>>(`/doctors/${doctorId}/patients`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // remove patient from doctor
  async removePatientFromDoctor(doctorId: string, patientId: string): Promise<void> {
    await apiClient(`/doctors/${doctorId}/patients/${patientId}`, {
      method: 'DELETE',
    });
  },

  // get distinct specializations
  async getSpecializations(): Promise<string[]> {
    const res = await apiClient<ApiResponse<string[]>>('/doctors/specializations');
    return res.data || [];
  },

  // get distinct hospitals
  async getHospitals(): Promise<string[]> {
    const res = await apiClient<ApiResponse<string[]>>('/doctors/hospitals');
    return res.data || [];
  },
};
