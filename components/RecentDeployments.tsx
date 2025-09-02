import React from 'react';
import { Deployment } from '../types';
import { RocketLaunchIcon } from './Icons';

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

const RecentDeployments: React.FC<{ deployments: Deployment[] }> = ({ deployments }) => {
  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
        <RocketLaunchIcon className="w-5 h-5 text-brand-accent" />
        Recent Deployments
      </h3>
      <div className="space-y-3">
        {deployments.map((deployment) => (
          <div key={deployment.id}>
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-brand-text">{deployment.service}</p>
                <p className="text-xs text-gray-500">{timeAgo(deployment.timestamp)}</p>
            </div>
            <p className="text-sm text-brand-light">Version <span className="font-semibold">{deployment.version}</span> deployed.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDeployments;
