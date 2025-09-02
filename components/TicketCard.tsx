import React from 'react';
import { Ticket, SLAStatus, Status } from '../types';
import { getSLAStatus, formatTimeRemaining } from '../utils/slaHelper';
import { ClockIcon, UserIcon, CheckCircleIcon } from './Icons';

const slaColorClasses: Record<SLAStatus, { bg: string; text: string; border: string }> = {
  [SLAStatus.HEALTHY]: { bg: 'bg-sla-healthy/10', text: 'text-sla-healthy', border: 'border-sla-healthy' },
  [SLAStatus.NEARING]: { bg: 'bg-sla-nearing/10', text: 'text-sla-nearing', border: 'border-sla-nearing' },
  [SLAStatus.BREACHED]: { bg: 'bg-sla-breached/10', text: 'text-sla-breached', border: 'border-sla-breached' },
};

const resolvedColorClasses = {
  bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-400'
}

interface TicketCardProps {
    ticket: Ticket;
    onClick: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const isResolved = ticket.status === Status.RESOLVED;
  const slaStatus = isResolved ? SLAStatus.HEALTHY : getSLAStatus(ticket.slaDueDate); // Default for typing
  const colors = isResolved ? resolvedColorClasses : slaColorClasses[slaStatus];
  const timeRemaining = isResolved ? `Resolved on ${ticket.resolvedDate?.toLocaleDateString()}` : formatTimeRemaining(ticket.slaDueDate);

  return (
    <button 
        onClick={onClick}
        className={`w-full text-left bg-brand-secondary p-3 rounded-md border-l-4 ${colors.border} shadow-sm hover:shadow-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer animate-fade-in`}>
        <div className="flex justify-between items-start">
            <p className="text-sm font-bold text-brand-text pr-2">{ticket.id}</p>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}>{isResolved ? 'Resolved' : slaStatus}</span>
        </div>
        <p className="text-sm text-brand-light my-2">{ticket.shortDescription}</p>
        <div className="flex justify-between items-center text-xs text-brand-light mt-3 pt-2 border-t border-brand-primary">
            <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" />{ticket.assignedTo}</span>
            <span className={`flex items-center gap-1 font-medium ${colors.text}`}>
            {isResolved ? <CheckCircleIcon className="w-3 h-3" /> : <ClockIcon className="w-3 h-3" />}
            {timeRemaining}
            </span>
        </div>
    </button>
  );
};

export default TicketCard;
