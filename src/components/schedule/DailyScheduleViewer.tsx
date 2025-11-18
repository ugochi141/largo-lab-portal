import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { productionScheduleData } from '@/data/productionScheduleData';
import type { ProductionPhlebStaff, ProductionLabStaff } from '@/types';

const DailyScheduleViewer: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const scheduleForDate = productionScheduleData[dateKey];

  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header with date navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-primary-700">Daily Schedule</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousDay}
              className="px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              aria-label="Previous day"
            >
              ← Previous
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextDay}
              className="px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              aria-label="Next day"
            >
              Next →
            </button>
          </div>
        </div>
        <div className="text-lg text-neutral-600">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {!scheduleForDate ? (
        <div className="card text-center py-12">
          <div className="text-neutral-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-neutral-900 mb-2">No Schedule Available</p>
          <p className="text-neutral-600">No schedule data found for {format(selectedDate, 'MMMM d, yyyy')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Phlebotomy Staff Section */}
          <div className="card">
            <h2 className="text-2xl font-bold text-primary-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
              Phlebotomy Staff ({scheduleForDate.phleb.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Role/Assignment</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Shift</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Breaks</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleForDate.phleb
                    .sort((a, b) => a.startTime - b.startTime)
                    .map((staff: ProductionPhlebStaff, index: number) => (
                      <tr
                        key={index}
                        className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-sm text-neutral-600">
                          {staff.startTime < 12
                            ? `${staff.startTime}:00 AM`
                            : staff.startTime === 12
                            ? '12:00 PM'
                            : `${staff.startTime - 12}:00 PM`}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-neutral-900">{staff.nickname}</div>
                          <div className="text-sm text-neutral-500">{staff.name}</div>
                        </td>
                        <td className="py-3 px-4 text-neutral-700">
                          {staff.role || staff.assignment || 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-neutral-600">{staff.shift}</td>
                        <td className="py-3 px-4 text-sm text-neutral-600">{staff.breaks || 'None'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Laboratory Staff Section */}
          <div className="card">
            <h2 className="text-2xl font-bold text-success-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-success-500 rounded-full"></span>
              Laboratory Staff ({scheduleForDate.lab.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Department</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Assignment</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Shift</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-700">Breaks</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleForDate.lab
                    .sort((a, b) => a.startTime - b.startTime)
                    .map((staff: ProductionLabStaff, index: number) => (
                      <tr
                        key={index}
                        className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-sm text-neutral-600">
                          {staff.startTime < 12
                            ? `${staff.startTime}:00 AM`
                            : staff.startTime === 12
                            ? '12:00 PM'
                            : `${staff.startTime - 12}:00 PM`}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-neutral-900">{staff.nickname}</div>
                          <div className="text-sm text-neutral-500">{staff.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              staff.dept === 'MLS'
                                ? 'bg-success-100 text-success-700'
                                : staff.dept === 'MLT'
                                ? 'bg-primary-100 text-primary-700'
                                : 'bg-secondary-100 text-secondary-700'
                            }`}
                          >
                            {staff.dept}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-700">{staff.assignment}</td>
                        <td className="py-3 px-4 font-mono text-sm text-neutral-600">{staff.shift}</td>
                        <td className="py-3 px-4 text-sm text-neutral-600">{staff.breaks}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-primary-50 border-primary-200">
              <div className="text-sm text-primary-600 font-semibold mb-1">Total Phlebotomy Staff</div>
              <div className="text-3xl font-bold text-primary-700">{scheduleForDate.phleb.length}</div>
            </div>
            <div className="card bg-success-50 border-success-200">
              <div className="text-sm text-success-600 font-semibold mb-1">Total Laboratory Staff</div>
              <div className="text-3xl font-bold text-success-700">{scheduleForDate.lab.length}</div>
            </div>
            <div className="card bg-secondary-50 border-secondary-200">
              <div className="text-sm text-secondary-600 font-semibold mb-1">Total Staff On Duty</div>
              <div className="text-3xl font-bold text-secondary-700">
                {scheduleForDate.phleb.length + scheduleForDate.lab.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyScheduleViewer;
