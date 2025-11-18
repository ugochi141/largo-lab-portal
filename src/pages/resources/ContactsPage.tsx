import React from 'react';
import { Link } from 'react-router-dom';

const ContactsPage: React.FC = () => {
  const contacts = [
    { category: 'Emergency', name: '911', number: '911', desc: 'Fire, Medical, Police Emergency' },
    { category: 'Security', name: 'Hospital Security', number: '(301) 555-5000', desc: '24/7 Security Desk' },
    { category: 'Lab Director', name: 'Dr. Alex Morgan', number: '(301) 555-0101', desc: 'Laboratory Director' },
    { category: 'IT Support', name: 'Helpdesk', number: '(301) 555-HELP', desc: 'Technical Support' },
    { category: 'Vendor', name: 'Roche Diagnostics', number: '1-800-428-2336', desc: 'Chemistry Equipment' },
    { category: 'Vendor', name: 'Sysmex America', number: '1-888-879-7639', desc: 'Hematology Equipment' },
    { category: 'Vendor', name: 'Cepheid', number: '1-888-838-3222', desc: 'Molecular Testing' },
    { category: 'Vendor', name: 'Stago', number: '1-800-725-0607', desc: 'Coagulation Equipment' },
  ];

  const categories = [...new Set(contacts.map(c => c.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600">Home</Link> → 
        <span className="font-medium"> Emergency Contacts</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">Emergency Contacts Directory</h1>
      <p className="text-gray-600 mb-6">Important phone numbers and emergency contacts</p>

      {categories.map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.filter(c => c.category === category).map((contact, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{contact.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">{contact.number}</p>
                <p className="text-sm text-gray-600">{contact.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactsPage;
