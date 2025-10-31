import React, { useState } from 'react';
import { format, isPast } from 'date-fns';
import { useMeetingStore } from '@/store/meetingStore';
import { useStaffStore } from '@/store/staffStore';
import type { ActionItem } from '@/types';

const ActionItemTracker: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'>('ALL');
  const { meetings, updateActionItem, getOverdueActionItems } = useMeetingStore();
  const { staff } = useStaffStore();

  // Collect all action items from all meetings
  const allActionItems: (ActionItem & { meetingId: string; meetingTitle: string })[] = [];
  meetings.forEach((meeting) => {
    meeting.actionItems.forEach((item) => {
      allActionItems.push({
        ...item,
        meetingId: meeting.id,
        meetingTitle: meeting.title,
      });
    });
  });

  // Filter action items
  const filteredItems = allActionItems.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'OVERDUE') {
      return item.status !== 'COMPLETED' && isPast(new Date(item.dueDate));
    }
    return item.status === filter;
  });

  const getPriorityColor = (priority: ActionItem['priority']) => {
    const colors = {
      LOW: 'bg-neutral-100 text-neutral-700 border-neutral-300',
      MEDIUM: 'bg-secondary-100 text-secondary-700 border-secondary-300',
      HIGH: 'bg-warning-100 text-warning-700 border-warning-300',
      CRITICAL: 'bg-danger-100 text-danger-700 border-danger-300',
    };
    return colors[priority];
  };

  const getStatusColor = (status: ActionItem['status']) => {
    const colors = {
      PENDING: 'bg-neutral-100 text-neutral-700',
      IN_PROGRESS: 'bg-secondary-100 text-secondary-700',
      COMPLETED: 'bg-success-100 text-success-700',
      OVERDUE: 'bg-danger-100 text-danger-700',
    };
    return colors[status];
  };

  const handleCompleteAction = (meetingId: string, actionId: string) => {
    updateActionItem(meetingId, actionId, {
      status: 'COMPLETED',
      completedAt: new Date(),
    });
  };

  const handleUpdateStatus = (meetingId: string, actionId: string, status: ActionItem['status']) => {
    updateActionItem(meetingId, actionId, { status });
  };

  const overdueCount = getOverdueActionItems().length;
  const pendingCount = allActionItems.filter((i) => i.status === 'PENDING').length;
  const inProgressCount = allActionItems.filter((i) => i.status === 'IN_PROGRESS').length;
  const completedCount = allActionItems.filter((i) => i.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Action Item Tracker</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card bg-danger-50 border-danger-200">
            <div className="text-3xl font-bold text-danger-700">{overdueCount}</div>
            <div className="text-sm text-danger-600 font-semibold">Overdue</div>
          </div>
          
          <div className="card bg-neutral-50 border-neutral-200">
            <div className="text-3xl font-bold text-neutral-700">{pendingCount}</div>
            <div className="text-sm text-neutral-600 font-semibold">Pending</div>
          </div>
          
          <div className="card bg-secondary-50 border-secondary-200">
            <div className="text-3xl font-bold text-secondary-700">{inProgressCount}</div>
            <div className="text-sm text-secondary-600 font-semibold">In Progress</div>
          </div>
          
          <div className="card bg-success-50 border-success-200">
            <div className="text-3xl font-bold text-success-700">{completedCount}</div>
            <div className="text-sm text-success-600 font-semibold">Completed</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'OVERDUE', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              filter === f
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Action Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="card text-center py-12 text-neutral-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-lg font-semibold mb-2">No Action Items</p>
            <p className="text-sm">
              {filter === 'ALL' 
                ? 'No action items found' 
                : `No ${filter.toLowerCase().replace('_', ' ')} action items`}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const assignedStaff = staff.find((s) => s.id === item.assignedTo);
            const isOverdue = !item.completedAt && isPast(new Date(item.dueDate));
            const actualStatus = isOverdue && item.status !== 'COMPLETED' ? 'OVERDUE' : item.status;

            return (
              <div
                key={item.id}
                className={`card border-l-4 ${getPriorityColor(item.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg text-neutral-900">{item.description}</h4>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(actualStatus)}`}>
                        {actualStatus}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>
                          {assignedStaff
                            ? `${assignedStaff.firstName} ${assignedStaff.lastName}`
                            : 'Unassigned'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={isOverdue ? 'text-danger-600 font-semibold' : ''}>
                          Due: {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span>From: {item.meetingTitle}</span>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-sm text-neutral-600 bg-neutral-50 p-2 rounded mb-3">
                        {item.notes}
                      </p>
                    )}

                    {item.completedAt && (
                      <div className="text-xs text-success-600 font-semibold">
                        ✓ Completed on {format(new Date(item.completedAt), 'MMM dd, yyyy')}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    {item.status !== 'COMPLETED' && (
                      <>
                        <button
                          onClick={() => handleCompleteAction(item.meetingId, item.id)}
                          className="p-2 hover:bg-success-100 rounded transition-colors"
                          title="Mark as completed"
                        >
                          <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>

                        {item.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(item.meetingId, item.id, 'IN_PROGRESS')}
                            className="p-2 hover:bg-secondary-100 rounded transition-colors"
                            title="Start working"
                          >
                            <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActionItemTracker;
