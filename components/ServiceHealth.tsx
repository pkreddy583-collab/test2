import React from 'react';
import { ServiceHealth, ServiceStatus } from '../types';

const statusStyles: Record<ServiceStatus, { border: string; text: string; bg: string }> = {
  [ServiceStatus.OPERATIONAL]: { border: 'border-green-500', text: 'text-green-700', bg: 'hover:bg-green-50' },
  [ServiceStatus.DEGRADED]: { border: 'border-yellow-500', text: 'text-yellow-700', bg: 'hover:bg-yellow-50' },
  [ServiceStatus.OUTAGE]: { border: 'border-red-500', text: 'text-red-700', bg: 'hover:bg-red-50' },
};

const ServiceHealthList: React.FC<{ services: ServiceHealth[] }> = ({ services }) => {
  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-brand-text mb-4">Service Health</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className={`p-3 border-l-4 rounded-r-md transition-colors ${statusStyles[service.status].border} ${statusStyles[service.status].bg}`}>
            <p className="text-sm font-medium text-brand-text">{service.name}</p>
            <p className={`text-xs font-semibold ${statusStyles[service.status].text}`}>
              {service.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceHealthList;