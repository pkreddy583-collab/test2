import { Priority, SLAConfig } from '../types';

export const SLA_CONFIG: SLAConfig[] = [
  {
    priority: Priority.CRITICAL,
    resolveTime: '4 Hours',
  },
  {
    priority: Priority.HIGH,
    resolveTime: '24 Hours',
  },
  {
    priority: Priority.MODERATE,
    resolveTime: '3 Business Days',
  },
  {
    priority: Priority.LOW,
    resolveTime: '5 Business Days',
  },
];
