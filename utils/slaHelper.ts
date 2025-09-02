
import { SLAStatus, Ticket, TicketHistory } from '../types';

const NEARING_SLA_HOURS = 24;

export const getSLAStatus = (dueDate: Date): SLAStatus => {
  const now = new Date();
  const dueDateMs = dueDate.getTime();
  const nowMs = now.getTime();
  
  if (nowMs > dueDateMs) {
    return SLAStatus.BREACHED;
  }

  const hoursRemaining = (dueDateMs - nowMs) / (1000 * 60 * 60);
  if (hoursRemaining <= NEARING_SLA_HOURS) {
    return SLAStatus.NEARING;
  }

  return SLAStatus.HEALTHY;
};


export const formatTimeRemaining = (dueDate: Date): string => {
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();

  if (diffMs < 0) {
    const breachedMs = Math.abs(diffMs);
    const days = Math.floor(breachedMs / (1000 * 60 * 60 * 24));
    if (days > 0) return `Breached by ${days}d`;
    const hours = Math.floor(breachedMs / (1000 * 60 * 60));
    if (hours > 0) return `Breached by ${hours}h`;
    const minutes = Math.floor(breachedMs / (1000 * 60));
    return `Breached by ${minutes}m`;
  }
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days > 1) return `${days} days left`;
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours > 0) return `${hours} hours left`;
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  return `${minutes} mins left`;
};

export const formatTimeRemainingDynamic = (dueDate: Date, isBreached: boolean): string => {
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const totalSeconds = Math.abs(Math.floor(diffMs / 1000));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, '0');
  
  const prefix = isBreached ? '-' : '';

  if (days > 0) {
    return `${prefix}${days}d ${pad(hours)}h`;
  }
  return `${prefix}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const calculateMTTR = (tickets: Ticket[]): string => {
    const resolvedTickets = tickets.filter(
        (t) => t.resolvedDate && t.history && t.history.length > 0
    );

    if (resolvedTickets.length === 0) {
        return 'N/A';
    }

    const totalResolutionTime = resolvedTickets.reduce((acc, ticket) => {
        // Assume the first history entry is the creation date
        const creationDate = new Date(ticket.history[0].date).getTime();
        const resolutionDate = new Date(ticket.resolvedDate!).getTime();
        return acc + (resolutionDate - creationDate);
    }, 0);

    const avgMs = totalResolutionTime / resolvedTickets.length;
    const hours = Math.floor(avgMs / (1000 * 60 * 60));
    const minutes = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
};
