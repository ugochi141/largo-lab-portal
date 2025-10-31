import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { ScheduleEntry, Staff, TimeSlot } from '@/types';

interface ScheduleTimeSlotProps {
  timeSlot: TimeSlot;
  entries: ScheduleEntry[];
  staff: Staff[];
  onRemoveEntry: (entryId: string) => void;
  onUpdateEntry: (entryId: string, updates: Partial<ScheduleEntry>) => void;
  onAddBreak?: (staffId: string, timeSlotId: string) => void;
}

const ScheduleTimeSlot: React.FC<ScheduleTimeSlotProps> = ({
  timeSlot,
  entries,
  staff,
  onRemoveEntry,
  onUpdateEntry,
}) => {
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStation, setEditStation] = useState('');

  const { setNodeRef, isOver } = useDroppable({
    id: timeSlot.id,
  });

  const handleEdit = (entry: ScheduleEntry) => {
    setEditingEntryId(entry.id);
    setEditNotes(entry.notes || '');
    setEditStation(entry.station || '');
  };

  const handleSaveEdit = (entryId: string) => {
    onUpdateEntry(entryId, {
      notes: editNotes,
      station: editStation,
    });
    setEditingEntryId(null);
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
    setEditNotes('');
    setEditStation('');
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        border-2 border-dashed rounded-lg p-4 transition-all
        ${isOver ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 bg-white'}
        ${entries.length > 0 ? 'bg-neutral-50' : ''}
        hover:border-primary-400
      `}
      role="region"
      aria-label={`Time slot ${timeSlot.startTime} to ${timeSlot.endTime}`}
    >
      {/* Time Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-primary-700">
            {timeSlot.startTime}
          </span>
          <span className="text-neutral-500">-</span>
          <span className="text-lg font-semibold text-primary-700">
            {timeSlot.endTime}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-semibold">
              {entries.length} {entries.length === 1 ? 'Staff' : 'Staff Members'}
            </span>
          )}
        </div>
      </div>

      {/* Entries */}
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((entry) => {
            const staffMember = staff.find((s) => s.id === entry.staffId);
            if (!staffMember) return null;

            const isEditing = editingEntryId === entry.id;

            return (
              <div
                key={entry.id}
                className={`
                  p-3 rounded-lg border-l-4 transition-all
                  ${entry.isBreak 
                    ? 'bg-warning-50 border-warning-500' 
                    : 'bg-white border-primary-500'
                  }
                  shadow-sm hover:shadow-md
                `}
              >
                {isEditing ? (
                  /* Edit Mode */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-900">
                        {staffMember.firstName} {staffMember.lastName}
                        {staffMember.nickname && (
                          <span className="text-neutral-500 text-sm ml-2">
                            ({staffMember.nickname})
                          </span>
                        )}
                      </span>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        {entry.role}
                      </span>
                    </div>

                    <div>
                      <label className="form-label text-xs">Station</label>
                      <input
                        type="text"
                        value={editStation}
                        onChange={(e) => setEditStation(e.target.value)}
                        className="form-input text-sm"
                        placeholder="e.g., Station A, Room 101"
                      />
                    </div>

                    <div>
                      <label className="form-label text-xs">Notes</label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="form-textarea text-sm"
                        rows={2}
                        placeholder="Add notes..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(entry.id)}
                        className="btn btn-sm btn-success text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-sm bg-neutral-300 hover:bg-neutral-400 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">
                          {staffMember.firstName} {staffMember.lastName}
                          {staffMember.nickname && (
                            <span className="text-neutral-500 text-sm ml-2">
                              ({staffMember.nickname})
                            </span>
                          )}
                        </span>
                        {entry.isBreak && (
                          <span className="text-xs bg-warning-500 text-white px-2 py-0.5 rounded font-semibold">
                            BREAK
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-1 hover:bg-neutral-200 rounded transition-colors"
                          aria-label="Edit entry"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onRemoveEntry(entry.id)}
                          className="p-1 hover:bg-danger-100 rounded transition-colors"
                          aria-label="Remove entry"
                          title="Delete"
                        >
                          <svg className="w-4 h-4 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Role:</span>
                        <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                          {entry.role}
                        </span>
                      </div>
                      
                      {entry.station && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Station:</span>
                          <span>{entry.station}</span>
                        </div>
                      )}
                      
                      {entry.notes && (
                        <div className="flex items-start gap-2">
                          <span className="font-semibold">Notes:</span>
                          <span className="flex-1">{entry.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-6 text-neutral-400">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-sm">Drag staff member here to assign</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleTimeSlot;
