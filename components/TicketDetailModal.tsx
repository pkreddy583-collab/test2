import React, { useEffect, useState } from 'react';
import { Ticket, SLAStatus, Status } from '../types';
import { getSLAStatus, formatTimeRemainingDynamic } from '../utils/slaHelper';
import { XMarkIcon, UserIcon, ClockIcon, InProgressIcon, NewIcon, OnHoldIcon } from './Icons';

interface ModalProps {
  ticket: Ticket;
  onClose: () => void;
}

const slaColorClasses: Record<SLAStatus, { text: string; bg: string }> = {
    [SLAStatus.HEALTHY]: { text: 'text-sla-healthy', bg: 'bg-sla-healthy/10' },
    [SLAStatus.NEARING]: { text: 'text-sla-nearing', bg: 'bg-sla-nearing/10' },
    [SLAStatus.BREACHED]: { text: 'text-sla-breached', bg: 'bg-sla-breached/10' },
};

const statusIconMap: Record<Status, React.ReactNode> = {
  [Status.NEW]: <NewIcon className="w-5 h-5 text-blue-500" title="New" />,
  [Status.IN_PROGRESS]: <InProgressIcon className="w-5 h-5 text-green-500" title="In Progress" />,
  [Status.ON_HOLD]: <OnHoldIcon className="w-5 h-5 text-yellow-500" title="On Hold" />,
  [Status.RESOLVED]: null,
};


const Timer: React.FC<{ dueDate: Date }> = ({ dueDate }) => {
    const [timeString, setTimeString] = useState('');
    const slaStatus = getSLAStatus(dueDate);
    const isBreached = slaStatus === SLAStatus.BREACHED;
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTimeString(formatTimeRemainingDynamic(dueDate, isBreached));
      }, 1000);
      setTimeString(formatTimeRemainingDynamic(dueDate, isBreached)); // Initial call
      return () => clearInterval(interval);
    }, [dueDate, isBreached]);
  
    return <span className={`font-mono font-bold text-2xl ${slaColorClasses[slaStatus].text}`}>{timeString}</span>;
};

const TicketDetailModal: React.FC<ModalProps> = ({ ticket, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const slaStatus = getSLAStatus(ticket.slaDueDate);
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
              <h2 className="text-xl font-bold text-brand-text">{ticket.id}</h2>
              <p className="text-sm text-brand-light">{ticket.shortDescription}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
            {/* Main Content */}
            <div className="flex-[2] p-6 overflow-y-auto">
                <h3 className="font-semibold text-brand-text mb-4">Activity Feed</h3>
                <div className="space-y-6">
                    {ticket.history.map((item, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-brand-accent">
                                {item.user.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-brand-text">{item.user} <span className="text-xs text-brand-light font-normal ml-2">{new Date(item.date).toLocaleString()}</span></p>
                                <p className="text-sm text-gray-600 mt-1">{item.entry}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar */}
            <aside className="flex-1 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
                 <div className="mb-6">
                    <h4 className="text-xs font-semibold uppercase text-brand-light mb-2">SLA Countdown</h4>
                    <div className={`p-3 rounded-lg flex items-center gap-3 ${slaColorClasses[slaStatus].bg}`}>
                        <ClockIcon className={`w-6 h-6 ${slaColorClasses[slaStatus].text}`} />
                        <Timer dueDate={ticket.slaDueDate} />
                    </div>
                 </div>

                <div className="mb-6">
                    <h4 className="text-xs font-semibold uppercase text-brand-light mb-3">Details</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Assignee</span>
                            <span className="font-semibold text-brand-text flex items-center gap-2"><UserIcon className="w-4 h-4" />{ticket.assignedTo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="font-semibold text-brand-text flex items-center gap-2">{statusIconMap[ticket.status]} {ticket.status}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500">Priority</span>
                            <span className="font-semibold text-brand-text">{ticket.priority}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Portfolio</span>
                            <span className="font-semibold text-brand-text">{ticket.portfolio}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-semibold uppercase text-brand-light mb-3">Metadata</h4>
                     <div className="space-y-3 text-sm bg-white border rounded-lg p-3">
                        {Object.entries(ticket.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                                <span className="text-gray-500">{key}</span>
                                <span className="font-medium text-brand-text text-right">{String(value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
