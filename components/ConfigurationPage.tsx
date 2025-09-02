import React from 'react';
import { SLA_CONFIG } from '../data/slaConfig';

const ConfigurationPage: React.FC = () => {
  return (
    <div className="animate-fade-in bg-brand-secondary p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-brand-text mb-2">SLA Configuration</h2>
      <p className="text-brand-light mb-6">
        This table outlines the standard Service Level Agreement (SLA) resolution times for tickets based on their priority.
      </p>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
              >
                Priority Level
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
              >
                Time to Resolve
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {SLA_CONFIG.map((item) => (
              <tr key={item.priority} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text">{item.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-light">{item.resolveTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <h4 className="font-bold text-blue-800">System Integration</h4>
          <p className="text-sm text-blue-700 mt-1">
              This configuration is for display purposes. The definitive SLA timers are managed and pulled directly from the source ticketing system (e.g., ServiceNow). This web application visualizes the data provided by the integrated system's API.
          </p>
      </div>
    </div>
  );
};

export default ConfigurationPage;
