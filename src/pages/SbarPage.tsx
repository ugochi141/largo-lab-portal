import React from 'react';
import { Link } from 'react-router-dom';
import { openBadgeCardTemplate, openPocketCardTemplate, openSpanishTemplate } from '@/components/sbar/SbarTemplates';

const resources = [
  {
    title: 'Pocket Reference Card',
    description: '2" x 3.5" quick reference for badge holders.',
    action: openPocketCardTemplate,
    icon: '🎫',
  },
  {
    title: 'Badge Card',
    description: 'Standard ID badge version with SBAR prompts.',
    action: openBadgeCardTemplate,
    icon: '🆔',
  },
  {
    title: 'Spanish Reference Sheet',
    description: 'One-page SBAR sheet translated for threshold language.',
    action: openSpanishTemplate,
    icon: '🌐',
  },
];

const SbarPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl shadow-strong p-8 md:p-10 text-white mb-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-widest text-primary-100 font-semibold">
            Kaiser Permanente Largo Laboratory
          </p>
          <h1 className="text-4xl font-bold">SBAR Communication Toolkit</h1>
          <p className="text-lg text-white/90">
            Structured Situation-Background-Assessment-Recommendation templates for UBT huddles,
            escalations, and leadership rounding.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              className="btn bg-white text-primary-700 hover:bg-neutral-100 font-semibold"
              href="sbar-implementation-guide.html"
              target="_blank"
              rel="noreferrer"
            >
              View Implementation Guide
            </a>
            <Link className="btn border-2 border-white/60 text-white font-semibold" to="/dashboard">
              Open Manager Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Printable Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <article key={resource.title} className="card flex flex-col gap-3">
              <div className="text-4xl" aria-hidden="true">
                {resource.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">{resource.title}</h3>
                <p className="text-neutral-600 text-sm">{resource.description}</p>
              </div>
              <button
                onClick={resource.action}
                className="btn btn-primary mt-auto"
                type="button"
              >
                Generate Template
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">How to Use SBAR</h2>
        <ul className="list-disc list-inside text-sm text-neutral-700 space-y-2">
          <li>Use the pocket card during phone escalations or when calling providers.</li>
          <li>Badge card version fits into standard 2.13" x 3.38" ID holders.</li>
          <li>Spanish sheet supports patient-facing or bilingual teams; print and post in workrooms.</li>
          <li>Record SBAR huddles in the Manager Dashboard for auditing and follow-up.</li>
        </ul>
      </section>
    </div>
  );
};

export default SbarPage;
