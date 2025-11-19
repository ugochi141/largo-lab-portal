import React from 'react';

interface QCTask {
  id: string;
  equipment: string;
  task: string;
  frequency: string;
  lastCompleted: string;
  nextDue: string;
  status: 'completed' | 'due-soon' | 'overdue';
  assignedTo: string;
}

const StaffQCPage: React.FC = () => {
  const qcTasks: QCTask[] = [
    { id: 'QC001', equipment: 'Roche Cobas c303', task: 'Daily QC - Level 1', frequency: 'Daily', lastCompleted: '2025-11-18', nextDue: '2025-11-19', status: 'due-soon', assignedTo: 'Tracy Williams' },
    { id: 'QC002', equipment: 'Roche Cobas c303', task: 'Daily QC - Level 2', frequency: 'Daily', lastCompleted: '2025-11-18', nextDue: '2025-11-19', status: 'due-soon', assignedTo: 'Tracy Williams' },
    { id: 'QC003', equipment: 'Sysmex XN-2000', task: 'Hematology QC', frequency: 'Daily', lastCompleted: '2025-11-18', nextDue: '2025-11-19', status: 'due-soon', assignedTo: 'Booker Smith' },
    { id: 'QC004', equipment: 'Stago Star Max', task: 'Coagulation QC', frequency: 'Daily', lastCompleted: '2025-11-18', nextDue: '2025-11-19', status: 'due-soon', assignedTo: 'Alex Morgan' },
    { id: 'QC005', equipment: 'Roche Cobas c303', task: 'Weekly Maintenance', frequency: 'Weekly', lastCompleted: '2025-11-15', nextDue: '2025-11-22', status: 'completed', assignedTo: 'Tracy Williams' },
    { id: 'QC006', equipment: 'Sysmex XN-2000', task: 'Monthly Calibration', frequency: 'Monthly', lastCompleted: '2025-10-15', nextDue: '2025-12-15', status: 'completed', assignedTo: 'Booker Smith' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'due-soon': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const dueSoon = qcTasks.filter(t => t.status === 'due-soon').length;
  const completed = qcTasks.filter(t => t.status === 'completed').length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">QC Maintenance Schedule</h1>
      <p className="text-gray-600 mb-6">Quality control and equipment maintenance</p>

      {/* Read-Only Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔒</span>
          <p className="text-sm text-yellow-800">
            <strong>Read-Only Access:</strong> You can view the QC schedule but cannot log results.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Tasks</p>
          <p className="text-3xl font-bold text-blue-600">{qcTasks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Due Soon</p>
          <p className="text-3xl font-bold text-yellow-600">{dueSoon}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-3xl font-bold text-green-600">{completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Compliance Rate</p>
          <p className="text-3xl font-bold text-purple-600">100%</p>
        </div>
      </div>

      {/* QC Tasks */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Completed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Due</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {qcTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-sm">{task.equipment}</td>
                <td className="px-6 py-4 text-sm">{task.task}</td>
                <td className="px-6 py-4 text-sm">{task.frequency}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{task.lastCompleted}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{task.nextDue}</td>
                <td className="px-6 py-4 text-sm">{task.assignedTo}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                    {task.status === 'due-soon' ? 'Due Soon' : 
                     task.status === 'completed' ? 'Completed' : 'Overdue'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="font-bold mb-3">Status Legend</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Completed</span>
            <span className="text-gray-600">Task completed on time</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Due Soon</span>
            <span className="text-gray-600">Task due within 24 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Overdue</span>
            <span className="text-gray-600">Task past due date</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffQCPage;
