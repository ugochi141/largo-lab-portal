import React, { useState } from 'react';
import { format } from 'date-fns';
import { useMeetingStore } from '@/store/meetingStore';
import { useStaffStore } from '@/store/staffStore';
import type { Meeting } from '@/types';

const MeetingScheduler: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'ONE_ON_ONE' as Meeting['type'],
    title: '',
    description: '',
    scheduledDate: format(new Date(), 'yyyy-MM-dd'),
    scheduledTime: '09:00',
    duration: 30,
    participants: [] as string[],
    location: '',
  });

  const { addMeeting, updateMeeting, getUpcomingMeetings } = useMeetingStore();
  const { staff } = useStaffStore();

  const upcomingMeetings = getUpcomingMeetings();

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();

    const scheduledDateTime = new Date(
      `${formData.scheduledDate}T${formData.scheduledTime}`
    );

    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      scheduledDate: scheduledDateTime,
      duration: formData.duration,
      participants: formData.participants,
      status: 'SCHEDULED',
      location: formData.location,
      actionItems: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addMeeting(newMeeting);
    setShowCreateForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'ONE_ON_ONE',
      title: '',
      description: '',
      scheduledDate: format(new Date(), 'yyyy-MM-dd'),
      scheduledTime: '09:00',
      duration: 30,
      participants: [],
      location: '',
    });
  };

  const getMeetingTypeColor = (type: Meeting['type']) => {
    const colors = {
      ONE_ON_ONE: 'bg-primary-100 text-primary-700 border-primary-300',
      STAFF: 'bg-success-100 text-success-700 border-success-300',
      SAFETY: 'bg-danger-100 text-danger-700 border-danger-300',
      TRAINING: 'bg-warning-100 text-warning-700 border-warning-300',
    };
    return colors[type];
  };

  const getMeetingStatusColor = (status: Meeting['status']) => {
    const colors = {
      SCHEDULED: 'bg-secondary-100 text-secondary-700',
      COMPLETED: 'bg-success-100 text-success-700',
      CANCELLED: 'bg-neutral-100 text-neutral-700',
      RESCHEDULED: 'bg-warning-100 text-warning-700',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Meeting Scheduler</h2>
          <p className="text-neutral-600 mt-1">
            Schedule and manage one-on-one meetings, staff meetings, and training sessions
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Schedule Meeting
        </button>
      </div>

      {/* Create Meeting Form */}
      {showCreateForm && (
        <div className="card">
          <form onSubmit={handleCreateMeeting} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-neutral-900">New Meeting</h3>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Meeting Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Meeting['type'] })}
                  className="form-select"
                  required
                >
                  <option value="ONE_ON_ONE">One-on-One</option>
                  <option value="STAFF">Staff Meeting</option>
                  <option value="SAFETY">Safety Meeting</option>
                  <option value="TRAINING">Training Session</option>
                </select>
              </div>

              <div>
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Monthly Performance Review"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  rows={3}
                  placeholder="Meeting agenda and objectives..."
                />
              </div>

              <div>
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Time *</label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Duration (minutes) *</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="form-input"
                  min="15"
                  step="15"
                  required
                />
              </div>

              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Conference Room A"
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label">Participants</label>
                <select
                  multiple
                  value={formData.participants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      participants: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                  className="form-select h-32"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} - {s.role}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500 mt-1">
                  Hold Ctrl/Cmd to select multiple participants
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-primary">
                Schedule Meeting
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn bg-neutral-300 hover:bg-neutral-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming Meetings */}
      <div className="card">
        <h3 className="text-xl font-bold text-neutral-900 mb-4">
          Upcoming Meetings ({upcomingMeetings.length})
        </h3>

        {upcomingMeetings.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-semibold mb-2">No Upcoming Meetings</p>
            <p className="text-sm">Click "Schedule Meeting" to create your first meeting</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className={`p-4 rounded-lg border-2 ${getMeetingTypeColor(meeting.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg">{meeting.title}</h4>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${getMeetingStatusColor(
                          meeting.status
                        )}`}
                      >
                        {meeting.status}
                      </span>
                      <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded font-semibold">
                        {meeting.type.replace('_', ' ')}
                      </span>
                    </div>

                    {meeting.description && (
                      <p className="text-sm text-neutral-600 mb-3">{meeting.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-700">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{format(new Date(meeting.scheduledDate), 'MMM dd, yyyy')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {format(new Date(meeting.scheduledDate), 'h:mm a')} ({meeting.duration} min)
                        </span>
                      </div>

                      {meeting.location && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{meeting.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>{meeting.participants.length} participant(s)</span>
                      </div>
                    </div>

                    {meeting.actionItems.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-primary-700 font-semibold">
                          {meeting.actionItems.length} action item(s)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateMeeting(meeting.id, { status: 'COMPLETED' })}
                      className="p-2 hover:bg-success-100 rounded transition-colors"
                      title="Mark as completed"
                    >
                      <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingScheduler;
