import React from 'react';
import { Runbook } from '../types';
import { BookOpenIcon, ChevronRightIcon } from './Icons';

const Runbooks: React.FC<{ runbooks: Runbook[] }> = ({ runbooks }) => {
  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
        <BookOpenIcon className="w-5 h-5 text-brand-accent" />
        Available Runbooks
      </h3>
      <div className="space-y-1">
        {runbooks.map((runbook) => (
          <a href="#" key={runbook.id} className="group p-2 -m-2 block rounded-md hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-text group-hover:text-brand-accent transition-colors">{runbook.title}</p>
                <p className="text-xs text-brand-light mt-1">{runbook.description}</p>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-brand-accent transition-colors opacity-0 group-hover:opacity-100" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Runbooks;