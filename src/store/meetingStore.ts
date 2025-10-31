import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Meeting, ActionItem } from '@/types';

interface MeetingState {
  meetings: Meeting[];
  selectedMeeting: Meeting | null;
  loading: boolean;
  error: string | null;

  // Actions
  setMeetings: (meetings: Meeting[]) => void;
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => void;
  removeMeeting: (meetingId: string) => void;
  setSelectedMeeting: (meeting: Meeting | null) => void;
  addActionItem: (meetingId: string, actionItem: ActionItem) => void;
  updateActionItem: (
    meetingId: string,
    actionItemId: string,
    updates: Partial<ActionItem>
  ) => void;
  removeActionItem: (meetingId: string, actionItemId: string) => void;
  completeMeeting: (meetingId: string) => void;
  getUpcomingMeetings: () => Meeting[];
  getOverdueActionItems: () => ActionItem[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMeetingStore = create<MeetingState>()(
  persist(
    immer((set, get) => ({
      meetings: [],
      selectedMeeting: null,
      loading: false,
      error: null,

      setMeetings: (meetings) =>
        set((state) => {
          state.meetings = meetings;
        }),

      addMeeting: (meeting) =>
        set((state) => {
          state.meetings.push(meeting);
        }),

      updateMeeting: (meetingId, updates) =>
        set((state) => {
          const meetingIndex = state.meetings.findIndex((m) => m.id === meetingId);
          if (meetingIndex !== -1) {
            state.meetings[meetingIndex] = {
              ...state.meetings[meetingIndex],
              ...updates,
              updatedAt: new Date(),
            };
          }
        }),

      removeMeeting: (meetingId) =>
        set((state) => {
          state.meetings = state.meetings.filter((m) => m.id !== meetingId);
        }),

      setSelectedMeeting: (meeting) =>
        set((state) => {
          state.selectedMeeting = meeting;
        }),

      addActionItem: (meetingId, actionItem) =>
        set((state) => {
          const meetingIndex = state.meetings.findIndex((m) => m.id === meetingId);
          if (meetingIndex !== -1) {
            state.meetings[meetingIndex].actionItems.push(actionItem);
            state.meetings[meetingIndex].updatedAt = new Date();
          }
        }),

      updateActionItem: (meetingId, actionItemId, updates) =>
        set((state) => {
          const meetingIndex = state.meetings.findIndex((m) => m.id === meetingId);
          if (meetingIndex !== -1) {
            const actionItemIndex = state.meetings[meetingIndex].actionItems.findIndex(
              (a) => a.id === actionItemId
            );
            if (actionItemIndex !== -1) {
              state.meetings[meetingIndex].actionItems[actionItemIndex] = {
                ...state.meetings[meetingIndex].actionItems[actionItemIndex],
                ...updates,
              };
              state.meetings[meetingIndex].updatedAt = new Date();
            }
          }
        }),

      removeActionItem: (meetingId, actionItemId) =>
        set((state) => {
          const meetingIndex = state.meetings.findIndex((m) => m.id === meetingId);
          if (meetingIndex !== -1) {
            state.meetings[meetingIndex].actionItems = state.meetings[
              meetingIndex
            ].actionItems.filter((a) => a.id !== actionItemId);
            state.meetings[meetingIndex].updatedAt = new Date();
          }
        }),

      completeMeeting: (meetingId) =>
        set((state) => {
          const meetingIndex = state.meetings.findIndex((m) => m.id === meetingId);
          if (meetingIndex !== -1) {
            state.meetings[meetingIndex].status = 'COMPLETED';
            state.meetings[meetingIndex].updatedAt = new Date();
          }
        }),

      getUpcomingMeetings: () => {
        const now = new Date();
        return get()
          .meetings.filter(
            (m) =>
              m.status === 'SCHEDULED' &&
              new Date(m.scheduledDate) >= now
          )
          .sort(
            (a, b) =>
              new Date(a.scheduledDate).getTime() -
              new Date(b.scheduledDate).getTime()
          );
      },

      getOverdueActionItems: () => {
        const now = new Date();
        const allActionItems: ActionItem[] = [];

        get().meetings.forEach((meeting) => {
          meeting.actionItems.forEach((item) => {
            if (
              item.status !== 'COMPLETED' &&
              new Date(item.dueDate) < now
            ) {
              allActionItems.push(item);
            }
          });
        });

        return allActionItems;
      },

      setLoading: (loading) =>
        set((state) => {
          state.loading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),
    })),
    {
      name: 'meeting-storage',
      partialize: (state) => ({
        meetings: state.meetings,
      }),
    }
  )
);
