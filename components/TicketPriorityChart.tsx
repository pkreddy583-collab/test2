import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Ticket, Priority, SLAStatus } from '../types';
import { getSLAStatus } from '../utils/slaHelper';

interface TicketPriorityChartProps {
  tickets: Ticket[];
}

const priorityColors = {
  [Priority.CRITICAL]: '#ef4444',
  [Priority.HIGH]: '#f97316',
  [Priority.MODERATE]: '#f59e0b',
  [Priority.LOW]: '#71B844',
};

const slaColors = {
  [SLAStatus.BREACHED]: '#ef4444',
  [SLAStatus.NEARING]: '#f59e0b',
  [SLAStatus.HEALTHY]: '#71B844',
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-brand-secondary p-3 rounded-md border border-brand-accent shadow-lg text-sm">
        <p className="font-bold text-brand-text mb-2">{`${label}`}</p>
        {/* FIX: Use bracket notation to access properties of slaColors using enum values. */}
        <p style={{ color: slaColors[SLAStatus.HEALTHY] }}>Healthy: {data.healthy}</p>
        <p style={{ color: slaColors[SLAStatus.NEARING] }}>Nearing Breach: {data.nearing}</p>
        <p style={{ color: slaColors[SLAStatus.BREACHED] }}>Breached: {data.breached}</p>
        <p className="text-brand-light mt-1">Total: {data.total}</p>
      </div>
    );
  }
  return null;
};


const TicketPriorityChart: React.FC<TicketPriorityChartProps> = ({ tickets }) => {
  const data = Object.values(Priority).map(p => {
    const priorityTickets = tickets.filter(t => t.priority === p);
    return {
      name: p.split(' - ')[1],
      total: priorityTickets.length,
      priority: p,
      healthy: priorityTickets.filter(t => getSLAStatus(t.slaDueDate) === SLAStatus.HEALTHY).length,
      nearing: priorityTickets.filter(t => getSLAStatus(t.slaDueDate) === SLAStatus.NEARING).length,
      breached: priorityTickets.filter(t => getSLAStatus(t.slaDueDate) === SLAStatus.BREACHED).length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(113, 184, 68, 0.3)' }} />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={priorityColors[entry.priority]} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TicketPriorityChart;