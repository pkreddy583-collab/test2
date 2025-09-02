export enum Priority {
  CRITICAL = '1 - Critical',
  HIGH = '2 - High',
  MODERATE = '3 - Moderate',
  LOW = '4 - Low',
}

export enum SLAStatus {
  HEALTHY = 'Healthy',
  NEARING = 'Nearing Breach',
  BREACHED = 'Breached',
}

export enum Status {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  RESOLVED = 'Resolved',
}


export interface TicketHistory {
  date: Date;
  entry: string;
  user: string;
}

export interface TicketMetadata {
  [key: string]: string | number;
}

export interface Ticket {
  id: string;
  shortDescription: string;
  portfolio: string;
  priority: Priority;
  assignedTo: string;
  slaDueDate: Date;
  status: Status;
  resolvedDate?: Date;
  history: TicketHistory[];
  metadata: TicketMetadata;
}

export interface SLAConfig {
  priority: Priority;
  resolveTime: string;
}

// SRE Module Types
export enum ServiceStatus {
  OPERATIONAL = 'Operational',
  DEGRADED = 'Degraded Performance',
  OUTAGE = 'Major Outage',
}

export interface ServiceHealth {
  name: string;
  status: ServiceStatus;
}

export interface CriticalAlert {
  id: string;
  service: string;
  message: string;
  timestamp: Date;
}

export interface OnCall {
  primary: { name: string; phone: string };
  secondary: { name: string; phone: string };
}

export interface Deployment {
  id: string;
  service: string;
  version: string;
  timestamp: Date;
}

export interface Runbook {
  id: string;
  title: string;
  description: string;
}
