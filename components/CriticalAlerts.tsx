import React from 'react';
import { CriticalAlert } from '../types';
import { BellIcon } from './Icons';

const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

const CriticalAlerts: React.FC<{ alerts: CriticalAlert[] }> = ({ alerts }) => {
  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
        <BellIcon className="w-5 h-5 text-red-500" />
        Critical Alerts
      </h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="border-l-4 border-red-500 pl-3">
            <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-red-700">{alert.service}</p>
                <p className="text-xs text-gray-500">{timeAgo(alert.timestamp)}</p>
            </div>
            <p className="text-sm text-brand-light">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriticalAlerts;
