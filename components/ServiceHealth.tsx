import React from 'react';
import { ServiceHealth, ServiceStatus } from '../types';

const statusStyles: Record<ServiceStatus, { indicator: string; text: string }> = {
  [ServiceStatus.OPERATIONAL]: { indicator: 'bg-green-500', text: 'text-green-700' },
  [ServiceStatus.DEGRADED]: { indicator: 'bg-yellow-500', text: 'text-yellow-700' },
  [ServiceStatus.OUTAGE]: { indicator: 'bg-red-500', text: 'text-red-700' },
};

const ServiceHealthList: React.FC<{ services: ServiceHealth[] }> = ({ services }) => {
  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-brand-text mb-4">Service Health</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between">
            <p className="text-sm font-medium text-brand-text">{service.name}</p>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[service.status].indicator}`}></span>
              <span className={`text-sm font-semibold ${statusStyles[service.status].text}`}>
                {service.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceHealthList;
