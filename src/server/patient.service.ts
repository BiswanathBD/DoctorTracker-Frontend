import { AuthService } from './auth.service';
import type { Patient, PatientQueryParams, PatientsResponse } from '@/types/patient.types';

export type { Patient, PatientQueryParams, PatientsResponse };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const PatientService = {
  // get all patients with query params
  async getAllPatients(params: PatientQueryParams = {}): Promise<PatientsResponse> {
    const token = AuthService.getToken();
    const query = new URLSearchParams();

    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.searchTerm) query.set('searchTerm', params.searchTerm);
    if (params.condition) query.set('condition', params.condition);
    if (params.gender) query.set('gender', params.gender);
    if (params.doctorId) query.set('doctorId', params.doctorId);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.isReleased !== undefined && params.isReleased !== '') {
      query.set('isReleased', String(params.isReleased));
    }

    const res = await fetch(`${API_URL}/patients?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch patients');
    return {
      meta: data.meta,
      data: data.data,
    };
  },

  // get single patient by id
  async getPatientById(id: string): Promise<Patient> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/patients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch patient');
    return data.data;
  },

  // create a new patient
  async createPatient(payload: Record<string, unknown>): Promise<Patient> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to create patient');
    return data.data;
  },

  // update patient
  async updatePatient(id: string, payload: Record<string, unknown>): Promise<Patient> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/patients/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to update patient');
    return data.data;
  },

  // update patient avatar
  async updateAvatar(patientId: string, file: File): Promise<Patient> {
    const token = AuthService.getToken();
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch(`${API_URL}/patients/${patientId}/avatar`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to update patient avatar');
    return data.data;
  },

  // delete patient avatar
  async deleteAvatar(patientId: string): Promise<Patient> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/patients/${patientId}/avatar`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to delete patient avatar');
    return data.data;
  },

  // delete patient
  async deletePatient(id: string): Promise<void> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/patients/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to delete patient');
  },

  // release patient
  async releasePatient(id: string, releaseDate?: string, note?: string): Promise<Patient> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/patients/${id}/release`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ releaseDate, note }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to release patient');
    return data.data;
  },

  // readmit patient
  async readmitPatient(id: string, doctorId?: string): Promise<Patient> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/patients/${id}/readmit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ doctorId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to readmit patient');
    return data.data;
  },

  // get distinct conditions
  async getConditions(): Promise<string[]> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/patients/conditions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch conditions');
    return data.data || [];
  },
};
