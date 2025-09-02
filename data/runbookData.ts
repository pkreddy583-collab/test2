import { Runbook } from '../types';

export const RUNBOOKS: Runbook[] = [
  {
    id: 'RB-001',
    title: 'Restart Payment Gateway Service',
    description: 'Standard procedure for a graceful restart of the payments API.',
  },
  {
    id: 'RB-002',
    title: 'Database Failover Procedure',
    description: 'Steps to initiate a manual failover of the primary database cluster.',
  },
  {
    id: 'RB-003',
    title: 'Clear Batch Job Queue',
    description: 'How to safely purge and restart a stuck batch processing job.',
  },
  {
    id: 'RB-004',
    title: 'Investigate High CPU on Web Nodes',
    description: 'Diagnostic steps for identifying the root cause of high CPU utilization.',
  },
];
