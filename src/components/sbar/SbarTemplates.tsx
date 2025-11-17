import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const SBAR_SECTIONS = [
  { key: 's', title: 'Situation', description: "What's happening right now?" },
  { key: 'b', title: 'Background', description: 'What events led to this point?' },
  { key: 'a', title: 'Assessment', description: 'What do you think the problem is?' },
  { key: 'r', title: 'Recommendation', description: 'What action do you recommend?' },
];

const openTemplateWindow = (node: React.ReactElement) => {
  if (typeof window === 'undefined') return;
  const markup = '<!DOCTYPE html>' + renderToStaticMarkup(node);
  const templateWindow = window.open('', '_blank', 'noopener');
  if (!templateWindow) {
    alert('Please allow pop-ups to view the SBAR template.');
    return;
  }
  templateWindow.document.write(markup);
  templateWindow.document.close();

  const attachPrintHandler = () => {
    const trigger = templateWindow.document.getElementById('print-template');
    trigger?.addEventListener('click', () => templateWindow.print());
  };

  if (templateWindow.document.readyState === 'complete') {
    attachPrintHandler();
  } else {
    templateWindow.document.addEventListener('DOMContentLoaded', attachPrintHandler);
  }
};

const PocketCardDocument = () => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <title>SBAR Pocket Card</title>
      <style>{`
        @page { size: 3.5in 2in; margin: 0; }
        body { font-family: Arial, sans-serif; width: 3.5in; height: 2in; background: white; margin: 0; }
        .card { border: 2px solid #005EB8; border-radius: 8px; padding: 8px; height: 100%; display: flex; flex-direction: column; }
        h1 { font-size: 14px; margin: 0 0 6px 0; color: #005EB8; }
        p { margin: 0; font-size: 9px; color: #333; }
        .section { margin-bottom: 4px; }
        .section strong { display: block; font-size: 10px; color: #005EB8; }
        footer { margin-top: auto; font-size: 8px; color: #666; border-top: 1px solid #eee; padding-top: 4px; text-align: center; }
        button { margin-top: 12px; padding: 8px 12px; border-radius: 6px; background: #005EB8; color: white; border: none; cursor: pointer; font-weight: bold; }
      `}</style>
    </head>
    <body>
      <div className="card">
        <header>
          <h1>SBAR Quick Reference</h1>
          <p>Kaiser Permanente Largo Laboratory</p>
        </header>
        {SBAR_SECTIONS.map((section) => (
          <div key={section.key} className="section">
            <strong>{section.title}</strong>
            <p>{section.description}</p>
          </div>
        ))}
        <footer>Print on cardstock • GL: 1808-18801-5693</footer>
      </div>
      <button id="print-template" type="button">Print Pocket Card</button>
    </body>
  </html>
);

const BadgeCardDocument = () => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <title>SBAR Badge Card</title>
      <style>{`
        @page { size: 2.13in 3.38in; margin: 0; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 10px; margin: 0; }
        .badge { width: 2.13in; height: 3.38in; border: 3px solid #005EB8; border-radius: 10px; overflow: hidden; background: white; display: flex; flex-direction: column; }
        .header { background: linear-gradient(135deg, #005EB8, #003d7a); color: white; padding: 12px; text-align: center; }
        .header h1 { margin: 0; font-size: 18px; }
        .content { padding: 12px; flex: 1; }
        .section { border-left: 3px solid #005EB8; padding-left: 8px; margin-bottom: 10px; }
        .section strong { display: block; font-size: 11px; color: #005EB8; margin-bottom: 2px; }
        .section p { font-size: 9px; color: #333; margin: 0; }
        .footer { background: #f5f5f5; padding: 8px; text-align: center; font-size: 8px; color: #666; }
        button { margin-top: 12px; padding: 8px 12px; border-radius: 6px; background: #005EB8; color: white; border: none; cursor: pointer; font-weight: bold; }
      `}</style>
    </head>
    <body>
      <div className="badge">
        <div className="header">
          <h1>SBAR</h1>
          <p>Communication Technique</p>
        </div>
        <div className="content">
          {SBAR_SECTIONS.map((section) => (
            <div key={section.key} className="section">
              <strong>{section.title}</strong>
              <p>{section.description}</p>
            </div>
          ))}
        </div>
        <div className="footer">
          Kaiser Permanente Largo Lab<br />GL: 1808-18801-5693
        </div>
      </div>
      <button id="print-template" type="button">Print Badge Card</button>
    </body>
  </html>
);

const SpanishDocument = () => (
  <html lang="es">
    <head>
      <meta charSet="UTF-8" />
      <title>Técnica de Comunicación SBAR</title>
      <style>{`
        @page { size: Letter; margin: 1in; }
        body { font-family: Arial, sans-serif; background: white; color: #333; }
        header { text-align: center; margin-bottom: 30px; }
        header h1 { font-size: 28px; color: #005EB8; margin: 0; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        .card { border: 3px solid #005EB8; border-radius: 12px; padding: 16px; background: #f7fbff; }
        .card h2 { margin: 0 0 10px 0; color: #005EB8; }
        .card p { margin: 0; line-height: 1.4; font-size: 14px; }
        button { margin-top: 24px; padding: 10px 18px; border-radius: 6px; background: #005EB8; color: white; border: none; cursor: pointer; font-weight: bold; display: block; margin-left: auto; margin-right: auto; }
      `}</style>
    </head>
    <body>
      <header>
        <h1>Técnica de Comunicación SBAR</h1>
        <p>Kaiser Permanente Laboratorio Largo</p>
      </header>
      <section className="grid">
        {SBAR_SECTIONS.map((section) => (
          <article key={section.key} className="card">
            <h2>{section.title.charAt(0)} - {section.title}</h2>
            <p>{section.description}</p>
          </article>
        ))}
      </section>
      <button id="print-template" type="button">Imprimir Documento</button>
    </body>
  </html>
);

export const openPocketCardTemplate = () => openTemplateWindow(<PocketCardDocument />);
export const openBadgeCardTemplate = () => openTemplateWindow(<BadgeCardDocument />);
export const openSpanishTemplate = () => openTemplateWindow(<SpanishDocument />);
