'use client';

import React from 'react';
import { Modal, Input, Button } from '@/components/ui';
import { Select } from '@/components/ui/Select';
import { type Doctor } from '@/types/doctor.types';
import { Users, HeartPulse, Phone, Mail } from 'lucide-react';

export interface AssignPatientFormData {
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  condition: string;
}

export interface DoctorAssignPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  patientForm: AssignPatientFormData;
  setPatientForm: React.Dispatch<React.SetStateAction<AssignPatientFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export const DoctorAssignPatientModal: React.FC<DoctorAssignPatientModalProps> = ({
  isOpen,
  onClose,
  doctor,
  patientForm,
  setPatientForm,
  onSubmit,
  submitting,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Patient under ${doctor?.name || 'Doctor'}`}
      description="Create and assign a patient directly to this specialist."
      icon={<Users className="w-5 h-5" />}
      maxWidth="md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Patient Name"
          placeholder="e.g. Faruk Hossain"
          required
          disabled={submitting}
          value={patientForm.name}
          onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
          leftIcon={<Users className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Age"
            type="number"
            placeholder="42"
            required
            disabled={submitting}
            value={patientForm.age}
            onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">Gender</label>
            <Select
              disabled={submitting}
              value={patientForm.gender}
              onChange={(val) => setPatientForm({ ...patientForm, gender: val || 'Male' })}
              options={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' },
              ]}
              placeholder="Select Gender"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Medical Condition"
            placeholder="e.g. Hypertension, Arrhythmia"
            required
            disabled={submitting}
            value={patientForm.condition}
            onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
            leftIcon={<HeartPulse className="w-4 h-4 text-secondary" />}
          />

          <Input
            label="Phone Number"
            placeholder="+880 1712-345678"
            required
            disabled={submitting}
            value={patientForm.phone}
            onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
            leftIcon={<Phone className="w-4 h-4 text-secondary" />}
          />
        </div>

        <Input
          label="Email Address (Optional)"
          type="email"
          placeholder="patient@gmail.com"
          disabled={submitting}
          value={patientForm.email}
          onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
          leftIcon={<Mail className="w-4 h-4 text-primary" />}
        />

        <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={onClose}
            className="rounded-full px-5 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="secondary"
            loading={submitting}
            className="rounded-full px-6 cursor-pointer"
          >
            Add Patient
          </Button>
        </div>
      </form>
    </Modal>
  );
};
