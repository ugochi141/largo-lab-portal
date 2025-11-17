import React, { useState } from 'react';
import { downloadTemplateWithExamples, downloadBlankTemplate } from '../utils/scheduleTemplateGenerator';
import { parseScheduleTemplate } from '../utils/scheduleTemplateParser';
import type { ProductionDaySchedule } from '../types';

export function ScheduleManager() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<{
    success: boolean;
    schedule?: ProductionDaySchedule;
    errors?: string[];
    warnings?: string[];
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadTemplate = (includeExamples: boolean) => {
    if (!selectedDate) {
      alert('Please select a date first');
      return;
    }

    if (includeExamples) {
      downloadTemplateWithExamples(selectedDate);
    } else {
      downloadBlankTemplate(selectedDate);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      alert('Please upload an Excel (.xlsx) file');
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);
    setParseResult(null);
    setShowPreview(false);

    try {
      const result = await parseScheduleTemplate(file);
      setParseResult(result);
      setShowPreview(result.success);
    } catch (error) {
      setParseResult({
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplySchedule = () => {
    if (!parseResult?.success || !parseResult.schedule || !selectedDate) {
      return;
    }

    // Store in localStorage for Daily Schedule to pick up
    const existingData = localStorage.getItem('dailyScheduleData');
    const scheduleData = existingData ? JSON.parse(existingData) : {};

    scheduleData[selectedDate] = parseResult.schedule;

    localStorage.setItem('dailyScheduleData', JSON.stringify(scheduleData));

    alert(`Schedule for ${selectedDate} has been saved!\n\nGo to Daily Schedule to view it.`);

    // Reset form
    setUploadedFile(null);
    setParseResult(null);
    setShowPreview(false);
    setSelectedDate('');
  };

  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary-700">Schedule Manager</h1>
        <p className="text-neutral-600 mt-2">
          Download an Excel template, fill in staff information, and upload to create a daily schedule
        </p>
      </div>

      {/* Step 1: Select Date */}
      <div className="bg-white rounded-lg shadow-soft p-6 mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full mr-2">1</span>
            Select Date
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={() => setSelectedDate(getTodayDate())}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition"
            >
              Use Today
            </button>
            {selectedDate && (
              <span className="text-neutral-600">
                Selected: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
      </div>

      {/* Step 2: Download Template */}
      <div className="bg-white rounded-lg shadow-soft p-6 mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full mr-2">2</span>
            Download Template
          </h2>
          <div className="space-y-3">
            <p className="text-neutral-600">Choose a template type to download:</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDownloadTemplate(true)}
                disabled={!selectedDate}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download with Examples
              </button>
              <button
                onClick={() => handleDownloadTemplate(false)}
                disabled={!selectedDate}
                className="px-6 py-3 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Blank Template
              </button>
            </div>
            {!selectedDate && (
              <p className="text-sm text-warning-600">Please select a date first</p>
            )}
          </div>
      </div>

      {/* Step 3: Upload Completed Template */}
      <div className="bg-white rounded-lg shadow-soft p-6 mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full mr-2">3</span>
            Upload Completed Template
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="px-6 py-3 bg-success-600 text-white rounded-md hover:bg-success-700 cursor-pointer transition flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose File
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {uploadedFile && (
                <span className="text-neutral-600">{uploadedFile.name}</span>
              )}
              {isProcessing && (
                <span className="text-primary-600">Processing...</span>
              )}
            </div>

            {/* Validation Results */}
            {parseResult && !parseResult.success && parseResult.errors && (
              <div className="bg-danger-50 border border-danger-200 rounded-md p-4">
                <h3 className="text-danger-800 font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Errors Found
                </h3>
                <ul className="list-disc list-inside space-y-1 text-danger-700">
                  {parseResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {parseResult?.warnings && parseResult.warnings.length > 0 && (
              <div className="bg-warning-50 border border-warning-200 rounded-md p-4">
                <h3 className="text-warning-800 font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Warnings
                </h3>
                <ul className="list-disc list-inside space-y-1 text-warning-700">
                  {parseResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {parseResult?.success && (
              <div className="bg-success-50 border border-success-200 rounded-md p-4">
                <h3 className="text-success-800 font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  File Valid - Ready to Apply
                </h3>
                {parseResult.schedule && (
                  <p className="text-success-700 mt-2">
                    {parseResult.schedule.phleb.length} phlebotomists, {parseResult.schedule.lab.length} lab staff
                  </p>
                )}
              </div>
            )}
          </div>
      </div>

      {/* Preview */}
      {showPreview && parseResult?.schedule && (
        <div className="bg-white rounded-lg shadow-soft p-6 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Preview Schedule</h2>

            <div className="space-y-6">
              {/* Phlebotomists */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Phlebotomists ({parseResult.schedule.phleb.length})</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Nickname</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Assignment</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Shift</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Start</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {parseResult.schedule.phleb.map((staff, index) => (
                        <tr key={index} className="hover:bg-neutral-50">
                          <td className="px-4 py-2 text-sm text-neutral-900">{staff.name}</td>
                          <td className="px-4 py-2 text-sm text-neutral-600">{staff.nickname}</td>
                          <td className="px-4 py-2 text-sm text-neutral-600">{staff.assignment}</td>
                          <td className="px-4 py-2 text-sm text-neutral-600">{staff.shift}</td>
                          <td className="px-4 py-2 text-sm text-neutral-600">{staff.startTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lab Staff */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Lab Staff ({parseResult.schedule.lab.length})</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Nickname</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Dept</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Assignment</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Shift</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase">Start</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {parseResult.schedule.lab.map((staff, index) => (
                        <tr key={index} className="hover:bg-neutral-50">
                          <td className="px-4 py-2 text-sm text-neutral-900">{staff.name}</td>
                          <td className="px-4 py-2 text-sm text-neutral-600">{staff.nickname}</td>
                          <td className="px-4 py-2 text-sm text-neutral-600">{staff.dept}</td>
                          <td className="px-4 py-2 text-sm text-neutral-600 max-w-md truncate" title={staff.assignment}>
                            {staff.assignment}
                          </td>
                          <td className="px-4 py-2 text-sm text-neutral-600">{staff.shift}</td>
                          <td className="px-4 py-2 text-sm text-neutral-600">{staff.startTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleApplySchedule}
                className="px-8 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply Schedule for {selectedDate}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
