import React from 'react';
import { OnCall } from '../types';
import { PhoneIcon, UserIcon } from './Icons';

interface OnCallScheduleProps {
  onCall: OnCall;
}

const OnCallSchedule: React.FC<OnCallScheduleProps> = ({ onCall }) => {
  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-brand-text mb-3">On-Call Schedule</h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-brand-light uppercase">Primary</p>
          <div className="flex items-center gap-2 mt-1">
            <UserIcon className="w-4 h-4 text-brand-accent" />
            <span className="font-medium text-brand-text">{onCall.primary.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <PhoneIcon className="w-4 h-4 text-gray-400" />
            <span>{onCall.primary.phone}</span>
          </div>
        </div>
        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-brand-light uppercase">Secondary</p>
          <div className="flex items-center gap-2 mt-1">
            <UserIcon className="w-4 h-4 text-brand-accent" />
            <span className="font-medium text-brand-text">{onCall.secondary.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <PhoneIcon className="w-4 h-4 text-gray-400" />
            <span>{onCall.secondary.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnCallSchedule;
