import React from 'react';

const StaffSupportPage: React.FC = () => {
  const resources = [
    {
      category: 'Equipment Manuals',
      items: [
        { name: 'Roche Cobas c303 User Manual', icon: '📘' },
        { name: 'Sysmex XN-2000 Quick Guide', icon: '📗' },
        { name: 'Stago Star Max Operation Manual', icon: '📕' },
      ]
    },
    {
      category: 'IT Support',
      items: [
        { name: 'Lab Information System (LIS) Login Issues', icon: '💻' },
        { name: 'Printer Troubleshooting', icon: '🖨️' },
        { name: 'Email & Password Reset', icon: '📧' },
      ]
    },
    {
      category: 'Safety Resources',
      items: [
        { name: 'Chemical Spill Response', icon: '⚠️' },
        { name: 'Bloodborne Pathogen Procedures', icon: '🩸' },
        { name: 'Fire Safety & Evacuation', icon: '🔥' },
      ]
    },
    {
      category: 'Training Materials',
      items: [
        { name: 'New Employee Orientation', icon: '🎓' },
        { name: 'Competency Assessment Forms', icon: '📋' },
        { name: 'Continuing Education Resources', icon: '📚' },
      ]
    },
  ];

  const contacts = [
    { role: 'Lab Director', name: 'Dr. Alex Morgan', phone: '(301) 555-0101', email: 'alex.morgan@kp.org', available: 'Mon-Fri 8AM-5PM' },
    { role: 'IT Support', name: 'Tech Desk', phone: '(301) 555-4357', email: 'helpdesk@kp.org', available: '24/7' },
    { role: 'Safety Officer', name: 'Safety Team', phone: '(301) 555-7233', email: 'safety@kp.org', available: 'Mon-Fri 8AM-5PM' },
    { role: 'Facilities', name: 'Maintenance', phone: '(301) 555-3278', email: 'facilities@kp.org', available: '24/7' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Technical Support</h1>
      <p className="text-gray-600 mb-6">Resources and assistance for laboratory staff</p>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
          <div className="text-2xl mb-2">📞</div>
          <p className="font-bold text-blue-900">Emergency</p>
          <p className="text-2xl font-bold text-blue-600">(301) 555-9111</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
          <div className="text-2xl mb-2">💻</div>
          <p className="font-bold text-green-900">IT Helpdesk</p>
          <p className="text-2xl font-bold text-green-600">(301) 555-4357</p>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
          <div className="text-2xl mb-2">🔧</div>
          <p className="font-bold text-purple-900">Facilities</p>
          <p className="text-2xl font-bold text-purple-600">(301) 555-3278</p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="font-bold text-red-900">Safety</p>
          <p className="text-2xl font-bold text-red-600">(301) 555-7233</p>
        </div>
      </div>

      {/* Resources */}
      <h2 className="text-2xl font-bold mb-4">Resources Library</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {resources.map((section, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">{section.category}</h3>
            <div className="space-y-3">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                  </div>
                  <button
                    className="bg-gray-200 text-gray-500 px-3 py-1 rounded text-sm cursor-not-allowed"
                    disabled
                    title="View-only access"
                  >
                    View Only
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {contacts.map((contact, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                👤
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{contact.role}</h3>
                <p className="text-sm text-gray-600 mb-2">{contact.name}</p>
                <div className="space-y-1 text-sm">
                  <p>📞 {contact.phone}</p>
                  <p className="text-blue-600">📧 {contact.email}</p>
                  <p className="text-gray-500">🕐 {contact.available}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Common Issues */}
      <h2 className="text-2xl font-bold mb-4">Common Issues & Solutions</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y">
          <div className="p-6">
            <h3 className="font-bold mb-2">🖨️ Printer Not Working</h3>
            <p className="text-sm text-gray-600 mb-2">
              1. Check if printer is on and has paper<br/>
              2. Verify printer is selected in print dialog<br/>
              3. Contact IT if issue persists: (301) 555-4357
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-bold mb-2">💻 Cannot Access LIS</h3>
            <p className="text-sm text-gray-600 mb-2">
              1. Verify your network connection<br/>
              2. Try clearing browser cache<br/>
              3. Contact IT Helpdesk: (301) 555-4357
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-bold mb-2">🔧 Equipment Malfunction</h3>
            <p className="text-sm text-gray-600 mb-2">
              1. Note error message/code<br/>
              2. Check equipment log book<br/>
              3. Contact Lab Director: (301) 555-0101
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-bold mb-2">📦 Supply Running Low</h3>
            <p className="text-sm text-gray-600 mb-2">
              1. Check inventory system for reorder status<br/>
              2. Note item in supply log<br/>
              3. Notify Lab Manager immediately
            </p>
          </div>
        </div>
      </div>

      {/* Read-Only Notice */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔒</span>
          <p className="text-sm text-yellow-800">
            <strong>Read-Only Access:</strong> You can view resources but cannot download files. 
            Contact your administrator for full access or to request specific resources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffSupportPage;
