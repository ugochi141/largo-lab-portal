import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface StaffMember {
  name: string;
  nickname: string;
  role?: string;
  dept?: string;
  assignment?: string;
  shift: string;
  breaks: string;
  startTime: number;
}

interface DaySchedule {
  phleb: StaffMember[];
  lab: StaffMember[];
}

interface ScheduleData {
  [date: string]: DaySchedule;
}

const SchedulePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await axios.get(`${API_BASE_URL}/api/schedules/daily`);
      setScheduleData(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      // Use default schedule dates as fallback
      setScheduleData({
        '2025-11-19': { phleb: [], lab: [] }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value + 'T00:00:00');
    setCurrentDate(newDate);
  };

  const getCurrentSchedule = (): DaySchedule => {
    const dateKey = getDateKey(currentDate);
    return scheduleData[dateKey] || { phleb: [], lab: [] };
  };

  const currentSchedule = getCurrentSchedule();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-4xl mb-2">🏥</div>
          <h1 className="text-3xl font-bold text-gray-900">Kaiser Permanente Largo Laboratory</h1>
          <h2 className="text-xl text-gray-600 mt-2">Daily Staff Schedule - Detailed View</h2>
        </header>

        {/* Date Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-lg p-5 mb-6 text-center">
          <div className="text-lg font-bold text-blue-700">{formatDate(currentDate)}</div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-lg p-5 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => changeDate(-1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                ← Previous
              </button>
              <input
                type="date"
                value={getDateKey(currentDate)}
                onChange={handleDateChange}
                className="border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={() => changeDate(1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                Next →
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                ✏️ {editMode ? 'View Mode' : 'Edit Mode'}
              </button>
              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                📄 Print
              </button>
            </div>
          </div>
        </div>

        {/* Phlebotomy Staff Section */}
        <div className="mb-8">
          <div className="border-b-4 border-blue-600 pb-2 mb-4">
            <h2 className="text-2xl font-bold text-blue-700">Phlebotomy Staff</h2>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Staff Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Assignment</th>
                  <th className="px-4 py-3 text-left font-semibold">Shift</th>
                  <th className="px-4 py-3 text-left font-semibold">Break Schedule</th>
                </tr>
              </thead>
              <tbody>
                {currentSchedule.phleb.length > 0 ? (
                  currentSchedule.phleb.map((staff, index) => (
                    <tr
                      key={index}
                      className={`border-l-4 border-orange-400 ${
                        index % 2 === 0 ? 'bg-blue-50' : 'bg-white'
                      } hover:bg-blue-100 transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-600">{staff.nickname}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{staff.role}</td>
                      <td className="px-4 py-3 text-gray-700">{staff.shift}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{staff.breaks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No phlebotomy staff scheduled for this date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Laboratory Technicians Section */}
        <div className="mb-8">
          <div className="border-b-4 border-blue-600 pb-2 mb-4">
            <h2 className="text-2xl font-bold text-blue-700">Laboratory Technicians</h2>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Staff Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Dept</th>
                  <th className="px-4 py-3 text-left font-semibold">Assignment</th>
                  <th className="px-4 py-3 text-left font-semibold">Shift</th>
                  <th className="px-4 py-3 text-left font-semibold">Break Schedule</th>
                </tr>
              </thead>
              <tbody>
                {currentSchedule.lab.length > 0 ? (
                  currentSchedule.lab.map((staff, index) => {
                    const deptColor =
                      staff.dept === 'MLS'
                        ? 'border-blue-600'
                        : staff.dept === 'MLT'
                        ? 'border-green-500'
                        : 'border-purple-600';
                    return (
                      <tr
                        key={index}
                        className={`border-l-4 ${deptColor} ${
                          index % 2 === 0 ? 'bg-blue-50' : 'bg-white'
                        } hover:bg-blue-100 transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">{staff.name}</div>
                          <div className="text-sm text-gray-600">{staff.nickname}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{staff.dept}</td>
                        <td className="px-4 py-3 text-gray-700">{staff.assignment}</td>
                        <td className="px-4 py-3 text-gray-700">{staff.shift}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{staff.breaks}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No laboratory technicians scheduled for this date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-600">
          <div className="text-2xl mb-2">⚕️</div>
          <p className="font-semibold text-gray-900">Kaiser Permanente Largo Clinical Core Laboratory</p>
          <p className="text-sm mt-2">Daily Schedule | Last Updated: {new Date().toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Clinical Excellence Through Efficient Scheduling</p>
        </footer>
      </div>
    </div>
  );
};

export default SchedulePage;
