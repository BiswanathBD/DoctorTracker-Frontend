'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Modal, Input, Button } from '@/components/ui';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { type Doctor, type DoctorFormData } from '@/types/doctor.types';
import {
  Stethoscope,
  HeartPulse,
  Building2,
  Phone,
  Mail,
  Camera,
  Trash2,
  Check,
  Plus,
  FileText,
} from 'lucide-react';

export interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDoctor: Doctor | null;
  doctorForm: DoctorFormData;
  setDoctorForm: React.Dispatch<React.SetStateAction<DoctorFormData>>;
  avatarPreviewUrl: string | null;
  onAvatarChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export const DoctorFormModal: React.FC<DoctorFormModalProps> = ({
  isOpen,
  onClose,
  editingDoctor,
  doctorForm,
  setDoctorForm,
  avatarPreviewUrl,
  onAvatarChange,
  onSubmit,
  submitting,
}) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // track initial avatar state
  const initialAvatar = editingDoctor?.avatar?.url || null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
      description={
        editingDoctor
          ? 'Update doctor credentials and affiliation'
          : 'Register a new doctor to the directory'
      }
      icon={<Stethoscope className="w-5 h-5 text-primary" />}
      maxWidth="xl"
    >
      <form onSubmit={onSubmit} autoComplete="off" className="space-y-4">
        {/* profile photo on left, name & specialization stacked on right */}
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
                  : 'hover:bg-muted/70 hover:border-primary cursor-pointer'
                  }`}
              >
                {avatarPreviewUrl ? (
                  <Image
                    src={avatarPreviewUrl}
                    alt={doctorForm.name || 'Doctor Profile'}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center text-muted-foreground group-hover:text-primary transition-colors">
                    <div className="w-11 h-11 rounded-full bg-card shadow-sm flex items-center justify-center text-primary mb-1.5 group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Profile</span>
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

          {/* name and specialization stacked */}
          <div className="flex-1 flex flex-col justify-between gap-3.5">
            <MotionWrapper animationType="fadeRight" delay={0.15} duration={0.3}>
              <Input
                label="Name"
                placeholder="Dr. Alexander Wright, MD"
                required
                disabled={submitting}
                value={doctorForm.name}
                onFocus={() => {
                  if (!doctorForm.name) {
                    setDoctorForm((prev) => ({ ...prev, name: 'Dr. ' }));
                  }
                }}
                onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                leftIcon={<Stethoscope className="w-4 h-4" />}
              />
            </MotionWrapper>

            <MotionWrapper animationType="fadeRight" delay={0.22} duration={0.3}>
              <Input
                label="Specialization"
                placeholder="e.g. Cardiology, Neurology"
                required
                disabled={submitting}
                value={doctorForm.specialization}
                onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                leftIcon={<HeartPulse className="w-4 h-4" />}
              />
            </MotionWrapper>
          </div>
        </div>

        {/* row 2: primary affiliated hospital (full width) */}
        <MotionWrapper animationType="fadeUp" delay={0.3} duration={0.3}>
          <Input
            label="Primary Affiliated Hospital"
            placeholder="e.g. Metro General Hospital"
            required
            disabled={submitting}
            value={doctorForm.hospital}
            onChange={(e) => setDoctorForm({ ...doctorForm, hospital: e.target.value })}
            leftIcon={<Building2 className="w-4 h-4" />}
          />
        </MotionWrapper>

        {/* row 3: direct contact & communication */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <MotionWrapper animationType="fadeUp" delay={0.38} duration={0.3}>
            <Input
              label="Phone"
              placeholder="+880 1712-345678"
              required
              disabled={submitting}
              value={doctorForm.phone}
              onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </MotionWrapper>

          <MotionWrapper animationType="fadeUp" delay={0.44} duration={0.3}>
            <Input
              label="Email"
              type="email"
              placeholder="doctor@hospital.org"
              required
              disabled={submitting}
              value={doctorForm.email}
              onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </MotionWrapper>
        </div>

        {/* row 4: clinical notes / remarks */}
        <MotionWrapper animationType="fadeUp" delay={0.48} duration={0.3}>
          <Input
            label="Clinical / Professional Notes (Optional)"
            placeholder="Add notes, schedule preferences, or clinical remarks..."
            disabled={submitting}
            value={doctorForm.note || ''}
            onChange={(e) => setDoctorForm({ ...doctorForm, note: e.target.value })}
            leftIcon={<FileText className="w-4 h-4" />}
          />
        </MotionWrapper>

        {/* modal footer */}
        <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
          <MotionWrapper animationType="fadeUp" delay={0.5} duration={0.3}>
            <Button
              type="button"
              variant="destructive"
              disabled={submitting}
              onClick={onClose}
            >
              Cancel
            </Button>
          </MotionWrapper>
          <MotionWrapper animationType="fadeUp" delay={0.56} duration={0.3}>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              leftIcon={editingDoctor ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            >
              {editingDoctor ? 'Save Changes' : 'Register Doctor'}
            </Button>
          </MotionWrapper>
        </div>
      </form>
    </Modal>
  );
};
