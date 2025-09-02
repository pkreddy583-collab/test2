import { ServiceHealth, ServiceStatus, CriticalAlert, OnCall } from '../types';

const now = new Date();
const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() - minutes * 60000);

export const services: ServiceHealth[] = [
  { name: 'Bravo Payments Gateway', status: ServiceStatus.OPERATIONAL },
  { name: 'Alpha Core Banking', status: ServiceStatus.OPERATIONAL },
  { name: 'Echo Mobile App', status: ServiceStatus.DEGRADED },
  { name: 'Romeo HR Platform', status: ServiceStatus.OUTAGE },
  { name: 'Delta Infrastructure', status: ServiceStatus.OPERATIONAL },
  { name: 'Victor Cloud Services', status: ServiceStatus.OPERATIONAL },
  { name: 'Foxtrot Online Banking', status: ServiceStatus.OPERATIONAL },
];

export const alerts: CriticalAlert[] = [
  {
    id: 'ALERT-001',
    service: 'Romeo HR Platform',
    message: 'API gateway 5xx error rate > 5%',
    timestamp: addMinutes(now, 2),
  },
  {
    id: 'ALERT-002',
    service: 'Echo Mobile App',
    message: 'P99 Latency > 2000ms',
    timestamp: addMinutes(now, 15),
  },
  {
    id: 'ALERT-003',
    service: 'DB-PROD-04',
    message: 'Disk Read IOPS high',
    timestamp: addMinutes(now, 45),
  },
];

export const onCall: OnCall = {
  primary: { name: 'David Miller', phone: '+1 (555) 123-4567' },
  secondary: { name: 'Alice Johnson', phone: '+1 (555) 987-6543' },
};
