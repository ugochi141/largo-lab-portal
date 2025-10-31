import React, { useState } from 'react';
import MeetingScheduler from '@/components/dashboard/MeetingScheduler';
import ActionItemTracker from '@/components/dashboard/ActionItemTracker';
import { useMeetingStore } from '@/store/meetingStore';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'meetings' | 'actions' | 'rounding'>('overview');
  const { getUpcomingMeetings, getOverdueActionItems } = useMeetingStore();

  const upcomingMeetings = getUpcomingMeetings();
  const overdueActions = getOverdueActionItems();

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '📊' },
    { id: 'meetings' as const, label: 'Meetings', icon: '📅', badge: upcomingMeetings.length },
    { id: 'actions' as const, label: 'Action Items', icon: '✓', badge: overdueActions.length },
    { id: 'rounding' as const, label: 'Staff Rounding', icon: '🔄' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary-700">Manager Dashboard</h1>
        <p className="text-neutral-600 mt-2">
          Manage meetings, track action items, and monitor team performance
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="flex gap-4" aria-label="Dashboard tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 font-semibold text-sm border-b-2 transition-all
                flex items-center gap-2
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-700'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }
              `}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-danger-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pb-12">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card bg-primary-50 border-primary-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white text-2xl">
                    📅
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary-700">{upcomingMeetings.length}</div>
                    <div className="text-sm text-primary-600">Upcoming Meetings</div>
                  </div>
                </div>
              </div>

              <div className="card bg-danger-50 border-danger-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-danger-500 rounded-lg flex items-center justify-center text-white text-2xl">
                    ⚠️
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-danger-700">{overdueActions.length}</div>
                    <div className="text-sm text-danger-600">Overdue Actions</div>
                  </div>
                </div>
              </div>

              <div className="card bg-success-50 border-success-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-success-500 rounded-lg flex items-center justify-center text-white text-2xl">
                    ✓
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success-700">0</div>
                    <div className="text-sm text-success-600">Completed Today</div>
                  </div>
                </div>
              </div>

              <div className="card bg-secondary-50 border-secondary-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center text-white text-2xl">
                    👥
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary-700">0</div>
                    <div className="text-sm text-secondary-600">Staff Rounds</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('meetings')}
                  className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-left border border-primary-200"
                >
                  <div className="text-3xl mb-2">📅</div>
                  <div className="font-semibold text-neutral-900">Schedule Meeting</div>
                  <div className="text-sm text-neutral-600">Create one-on-one or team meeting</div>
                </button>

                <button
                  onClick={() => setActiveTab('actions')}
                  className="p-4 bg-success-50 hover:bg-success-100 rounded-lg transition-colors text-left border border-success-200"
                >
                  <div className="text-3xl mb-2">✓</div>
                  <div className="font-semibold text-neutral-900">View Action Items</div>
                  <div className="text-sm text-neutral-600">Track and complete tasks</div>
                </button>

                <button
                  onClick={() => setActiveTab('rounding')}
                  className="p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors text-left border border-secondary-200"
                >
                  <div className="text-3xl mb-2">🔄</div>
                  <div className="font-semibold text-neutral-900">Staff Rounding</div>
                  <div className="text-sm text-neutral-600">Check in with team members</div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Recent Activity</h3>
              <div className="text-center py-8 text-neutral-400">
                <p>No recent activity</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'meetings' && <MeetingScheduler />}

        {activeTab === 'actions' && <ActionItemTracker />}

        {activeTab === 'rounding' && (
          <div className="card">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Staff Rounding</h3>
            <div className="text-center py-12 text-neutral-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-semibold mb-2">Staff Rounding System</p>
              <p className="text-sm">Track staff check-ins, concerns, and follow-up actions</p>
              <p className="text-xs text-neutral-500 mt-4">Full implementation coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
