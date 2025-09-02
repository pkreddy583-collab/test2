

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell, PieChart, Pie, LineChart, Line } from 'recharts';
import { Ticket, Status, SLAStatus, Priority } from '../types';
import { HierarchyBeam } from '../data/hierarchy';
import { getSLAStatus, calculateMTTR } from '../utils/slaHelper';
import { TicketIcon, GaugeIcon, WrenchScrewdriverIcon, CheckCircleIcon } from './Icons';
import { mockTickets } from '../data/mockData'; // For MTTR calculation on active view

interface HeatmapProps {
  tickets: Ticket[];
  hierarchy: HierarchyBeam[];
  viewMode: 'active' | 'resolved';
}

const slaColors = {
  [SLAStatus.BREACHED]: '#ef4444',
  [SLAStatus.NEARING]: '#f59e0b',
  [SLAStatus.HEALTHY]: '#71B844',
};

const priorityColors = {
  [Priority.CRITICAL]: '#ef4444',
  [Priority.HIGH]: '#f97316',
  [Priority.MODERATE]: '#f59e0b',
  [Priority.LOW]: '#71B844',
};

const ChartWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-brand-secondary p-4 rounded-lg shadow-md h-80">
    <h3 className="text-lg font-semibold text-brand-text mb-4">{title}</h3>
    {children}
  </div>
);

const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-md flex items-center gap-4">
        <div className="bg-brand-accent/10 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-brand-light">{title}</p>
            <p className="text-2xl font-bold text-brand-text">{value}</p>
        </div>
    </div>
);

const ActiveView: React.FC<{ tickets: Ticket[], hierarchy: HierarchyBeam[] }> = ({ tickets, hierarchy }) => {
    const kpis = useMemo(() => {
        const total = tickets.length;
        if (total === 0) return { total: 0, health: 0, critical: 0, mttr: 'N/A' };

        const healthyCount = tickets.filter(t => getSLAStatus(t.slaDueDate) === SLAStatus.HEALTHY).length;
        const health = Math.round((healthyCount / total) * 100);
        const critical = tickets.filter(t => t.priority === Priority.CRITICAL).length;
        
        // Calculate MTTR based on tickets resolved in the last 30 days for context
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentResolved = mockTickets.filter(t => t.resolvedDate && new Date(t.resolvedDate) > thirtyDaysAgo);
        const mttr = calculateMTTR(recentResolved);

        return { total, health, critical, mttr };
    }, [tickets]);

    const slaByBeamData = useMemo(() => {
        return hierarchy.map(beam => {
            const beamPortfolios = beam.units.flatMap(u => u.portfolios.map(p => p.name));
            const beamTickets = tickets.filter(t => beamPortfolios.includes(t.portfolio));
            return {
                name: beam.name,
                [SLAStatus.HEALTHY]: beamTickets.filter(t => getSLAStatus(t.slaDueDate) === SLAStatus.HEALTHY).length,
                [SLAStatus.NEARING]: beamTickets.filter(t => getSLAStatus(t.slaDueDate) === SLAStatus.NEARING).length,
                [SLAStatus.BREACHED]: beamTickets.filter(t => getSLAStatus(t.slaDueDate) === SLAStatus.BREACHED).length,
            };
        });
    }, [tickets, hierarchy]);

     const ticketTrendData = useMemo(() => {
        const days = 30;
        const trend = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                created: 0,
                resolved: 0
            };
        });

        mockTickets.forEach(ticket => {
            const createdDate = new Date(ticket.history[0].date);
            const resolvedDate = ticket.resolvedDate ? new Date(ticket.resolvedDate) : null;
            const today = new Date();

            const msInDay = 24 * 60 * 60 * 1000;
            const createdDiffDays = Math.floor((today.getTime() - createdDate.getTime()) / msInDay);
            
            if (createdDiffDays < days && createdDiffDays >= 0) {
                 trend[days - 1 - createdDiffDays].created++;
            }

            if (resolvedDate) {
                 const resolvedDiffDays = Math.floor((today.getTime() - resolvedDate.getTime()) / msInDay);
                 if (resolvedDiffDays < days && resolvedDiffDays >= 0) {
                    trend[days - 1 - resolvedDiffDays].resolved++;
                 }
            }
        });

        return trend;
    }, []);

    const priorityDistributionData = useMemo(() => {
        const data = Object.values(Priority).map(p => ({
            name: p.split(' - ')[1],
            value: tickets.filter(t => t.priority === p).length,
            color: priorityColors[p]
        }));
        return data.filter(d => d.value > 0);
    }, [tickets]);

    const portfolioHotspots = useMemo(() => {
        const portfolioMap = new Map<string, { breached: number; total: number }>();
        tickets.forEach(ticket => {
            if (!portfolioMap.has(ticket.portfolio)) {
                portfolioMap.set(ticket.portfolio, { breached: 0, total: 0 });
            }
            const data = portfolioMap.get(ticket.portfolio)!;
            data.total++;
            if (getSLAStatus(ticket.slaDueDate) === SLAStatus.BREACHED) {
                data.breached++;
            }
        });
        return Array.from(portfolioMap.entries())
            .filter(([, data]) => data.breached > 0)
            .sort((a, b) => b[1].breached - a[1].breached || b[1].total - a[1].total)
            .slice(0, 5);
    }, [tickets]);

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Active Tickets" value={kpis.total} icon={<TicketIcon className="w-6 h-6 text-brand-accent" />} />
                <KpiCard title="Overall SLA Health" value={`${kpis.health}%`} icon={<GaugeIcon className="w-6 h-6 text-brand-accent" />} />
                <KpiCard title="Critical Open Incidents" value={kpis.critical} icon={<TicketIcon className="w-6 h-6 text-sla-breached" />} />
                <KpiCard title="MTTR (Last 30d)" value={kpis.mttr} icon={<WrenchScrewdriverIcon className="w-6 h-6 text-brand-accent" />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <ChartWrapper title="SLA Health by Business Unit">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={slaByBeamData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: '#f0f4f8'}} />
                            <Legend wrapperStyle={{fontSize: "12px", paddingTop: "20px"}}/>
                            <Bar dataKey={SLAStatus.HEALTHY} stackId="a" fill={slaColors[SLAStatus.HEALTHY]} name="Healthy" />
                            <Bar dataKey={SLAStatus.NEARING} stackId="a" fill={slaColors[SLAStatus.NEARING]} name="Nearing" />
                            <Bar dataKey={SLAStatus.BREACHED} stackId="a" fill={slaColors[SLAStatus.BREACHED]} name="Breached" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>
                <ChartWrapper title="Ticket Trend (Last 30 Days)">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ticketTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                             <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{fontSize: 10}} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend wrapperStyle={{fontSize: "12px", paddingTop: "20px"}}/>
                            <Line type="monotone" dataKey="created" name="Created" stroke="#f97316" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#71B844" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartWrapper>
                <div className="grid grid-rows-2 gap-6">
                    <ChartWrapper title="Priority Distribution">
                        <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie data={priorityDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                                    {priorityDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                     <div className="bg-brand-secondary p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-brand-text mb-2">Portfolio Hotspots</h3>
                        <p className="text-xs text-brand-light mb-3">Top 5 portfolios by breached SLAs</p>
                        <table className="w-full text-sm">
                           <tbody>
                               {portfolioHotspots.map(([name, data]) => (
                                   <tr key={name} className="border-b last:border-0">
                                       <td className="py-2 font-medium">{name}</td>
                                       <td className="py-2 text-right">
                                           <span className="font-bold text-sla-breached">{data.breached}</span>
                                           <span className="text-gray-400"> / {data.total}</span>
                                        </td>
                                   </tr>
                               ))}
                           </tbody>
                        </table>
                     </div>
                </div>
            </div>
        </div>
    );
};

// FIX: Update ResolvedView to accept `hierarchy` prop to ensure it uses filtered data, consistent with ActiveView.
const ResolvedView: React.FC<{ tickets: Ticket[], hierarchy: HierarchyBeam[] }> = ({ tickets, hierarchy }) => {
    const kpis = useMemo(() => {
        const total = tickets.length;
        if (total === 0) return { total: 0, mttr: 'N/A', inSla: 0 };
        const mttr = calculateMTTR(tickets);

        const inSlaCount = tickets.filter(t => {
            const resolvedTime = t.resolvedDate!.getTime();
            const slaTime = t.slaDueDate.getTime();
            return resolvedTime <= slaTime;
        }).length;
        const inSla = Math.round((inSlaCount / total) * 100);

        return { total, mttr, inSla };
    }, [tickets]);
    
    const resolutionByBeamData = useMemo(() => {
        const beamMap = new Map<string, number>();
        const portfolioToBeam = new Map<string, string>();
        // FIX: Use the `hierarchy` prop instead of the undefined `HIERARCHY_DATA` to build the portfolio-to-beam mapping.
        hierarchy.forEach(beam => {
            beam.units.forEach(unit => {
                unit.portfolios.forEach(portfolio => {
                    portfolioToBeam.set(portfolio.name, beam.name);
                });
            });
            beamMap.set(beam.name, 0);
        });

        tickets.forEach(ticket => {
            const beamName = portfolioToBeam.get(ticket.portfolio);
            if (beamName) {
                beamMap.set(beamName, (beamMap.get(beamName) || 0) + 1);
            }
        });

        return Array.from(beamMap.entries()).map(([name, value]) => ({ name, tickets: value }));
    // FIX: Add `hierarchy` to the dependency array.
    }, [tickets, hierarchy]);

    const resolvedByPriorityData = useMemo(() => {
        return Object.values(Priority).map(p => ({
            name: p.split(' - ')[1],
            tickets: tickets.filter(t => t.priority === p).length,
            fill: priorityColors[p],
        })).filter(d => d.tickets > 0);
    }, [tickets]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <KpiCard title="Total Resolved Tickets" value={kpis.total} icon={<TicketIcon className="w-6 h-6 text-brand-accent" />} />
                 <KpiCard title="Mean Time to Resolution" value={kpis.mttr} icon={<WrenchScrewdriverIcon className="w-6 h-6 text-brand-accent" />} />
                 <KpiCard title="Resolved Within SLA" value={`${kpis.inSla}%`} icon={<CheckCircleIcon className="w-6 h-6 text-brand-accent" />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWrapper title="Tickets Resolved by Business Unit">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={resolutionByBeamData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis allowDecimals={false} />
                            <Tooltip cursor={{fill: '#f0f4f8'}} />
                            <Bar dataKey="tickets" fill={slaColors[SLAStatus.HEALTHY]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>
                 <ChartWrapper title="Resolved Tickets by Priority">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={resolvedByPriorityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis allowDecimals={false} />
                            <Tooltip cursor={{fill: '#f0f4f8'}}/>
                            <Bar dataKey="tickets" radius={[4, 4, 0, 0]}>
                                {resolvedByPriorityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartWrapper>
            </div>
        </div>
    );
};

const LeadershipHeatmap: React.FC<HeatmapProps> = ({ tickets, hierarchy, viewMode }) => {
  return (
    <div className="animate-fade-in">
        {viewMode === 'active' 
            ? <ActiveView tickets={tickets} hierarchy={hierarchy} /> 
            // FIX: Pass the `hierarchy` prop to `ResolvedView`.
            : <ResolvedView tickets={tickets} hierarchy={hierarchy} />
        }
    </div>
  );
};

export default LeadershipHeatmap;