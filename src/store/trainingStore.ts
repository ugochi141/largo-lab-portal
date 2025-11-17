import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { TrainingRequirement } from '@/types';

interface TrainingState {
  requirements: TrainingRequirement[];
  setRequirements: (requirements: TrainingRequirement[]) => void;
  updateStatus: (id: string, status: TrainingRequirement['status']) => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    immer((set) => ({
      requirements: [],
      setRequirements: (requirements) =>
        set((state) => {
          state.requirements = requirements;
        }),
      updateStatus: (id, status) =>
        set((state) => {
          const idx = state.requirements.findIndex((req) => req.id === id);
          if (idx !== -1) {
            state.requirements[idx].status = status;
            if (status === 'COMPLETED') {
              state.requirements[idx].lastCompleted = new Date();
            }
          }
        }),
    })),
    {
      name: 'training-storage',
      partialize: (state) => ({
        requirements: state.requirements,
      }),
    }
  )
);
