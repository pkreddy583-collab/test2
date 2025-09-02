import React, { useState, useMemo } from 'react';
import { mockTickets } from './data/mockData';
import { HIERARCHY_DATA } from './data/hierarchy';
import { onCall, services, alerts } from './data/sreData';
import { Ticket, Priority, Status } from './types';

// Components
import TicketCard from './components/TicketCard';
import TicketPriorityChart from './components/TicketPriorityChart';
import LeadershipHeatmap from './components/LeadershipHeatmap';
import ConfigurationPage from './components/ConfigurationPage';
import TicketDetailModal from './components/TicketDetailModal';
import Chatbot from './components/Chatbot';
import KeyMetrics from './components/KeyMetrics';
import OnCallSchedule from './components/OnCallSchedule';
import ServiceHealth from './components/ServiceHealth';
import CriticalAlerts from './components/CriticalAlerts';
import { Squares2X2Icon, ChartBarIcon, CogIcon } from './components/Icons';

const App: React.FC = () => {
  const [page, setPage] = useState<'operations' | 'heatmap' | 'configuration'>('operations');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedBeam, setSelectedBeam] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'active' | 'resolved'>('active');
  const [timeRange, setTimeRange] = useState<string>('30'); // '7', '30', '90', 'all'

  const availableUnits = useMemo(() => {
    if (selectedBeam === 'all') return [];
    const beam = HIERARCHY_DATA.find(b => b.name === selectedBeam);
    return beam ? beam.units : [];
  }, [selectedBeam]);

  const availablePortfolios = useMemo(() => {
    if (selectedUnit === 'all') return [];
    const unit = availableUnits.find(u => u.name === selectedUnit);
    return unit ? unit.portfolios : [];
  }, [selectedUnit, availableUnits]);

  const handleBeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBeam(e.target.value);
    setSelectedUnit('all');
    setSelectedPortfolio('all');
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnit(e.target.value);
    setSelectedPortfolio('all');
  };
  
  const displayedHierarchy = useMemo(() => {
    let beams = HIERARCHY_DATA;
    if (selectedBeam !== 'all') {
        beams = beams.filter(b => b.name === selectedBeam);
    }

    return beams.map(beam => {
        let units = beam.units;
        if (selectedUnit !== 'all') {
            units = units.filter(u => u.name === selectedUnit);
        }

        return {
            ...beam,
            units: units.map(unit => {
                let portfolios = unit.portfolios;
                if (selectedPortfolio !== 'all') {
                    portfolios = portfolios.filter(p => p.name === selectedPortfolio);
                }
                return { ...unit, portfolios };
            }).filter(u => u.portfolios.length > 0)
        };
    }).filter(b => b.units.length > 0);
  }, [selectedBeam, selectedUnit, selectedPortfolio]);

  const displayedTickets = useMemo(() => {
    let portfoliosInScope = displayedHierarchy
      .flatMap(beam => beam.units)
      .flatMap(unit => unit.portfolios)
      .map(p => p.name);
    
    let tickets = mockTickets.filter(ticket => portfoliosInScope.includes(ticket.portfolio));

    if (viewMode === 'active') {
      return tickets
        .filter(ticket => ticket.status !== Status.RESOLVED)
        .sort((a, b) => a.slaDueDate.getTime() - b.slaDueDate.getTime());
    } else { // resolved view
      const now = new Date();
      const daysToMilliseconds = (days: number) => days * 24 * 60 * 60 * 1000;

      return tickets
        .filter(ticket => {
          if (ticket.status !== Status.RESOLVED || !ticket.resolvedDate) {
            return false;
          }
          if (timeRange === 'all') {
            return true;
          }
          const rangeMs = daysToMilliseconds(parseInt(timeRange, 10));
          return now.getTime() - ticket.resolvedDate.getTime() <= rangeMs;
        })
        .sort((a, b) => b.resolvedDate!.getTime() - a.resolvedDate!.getTime());
    }
  }, [displayedHierarchy, viewMode, timeRange]);

  const ticketsByPriority = useMemo(() => {
    return Object.values(Priority).reduce((acc, priority) => {
      acc[priority] = displayedTickets.filter(t => t.priority === priority);
      return acc;
    }, {} as Record<Priority, Ticket[]>);
  }, [displayedTickets]);
  
  const selectionTitle = useMemo(() => {
    if (selectedPortfolio !== 'all') return selectedPortfolio;
    if (selectedUnit !== 'all') return selectedUnit;
    if (selectedBeam !== 'all') return selectedBeam;
    return "All Beams";
  }, [selectedBeam, selectedUnit, selectedPortfolio]);

  const priorityOrder = [Priority.CRITICAL, Priority.HIGH, Priority.MODERATE, Priority.LOW];
  const viewModeText = viewMode === 'active' ? 'Active' : 'Resolved';
  const filterSelectClasses = "bg-gray-100 text-brand-text rounded-md px-3 py-1.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all disabled:opacity-50 disabled:bg-gray-200";
  
  const NavLink: React.FC<{
      targetPage: 'operations' | 'heatmap' | 'configuration';
      icon: React.ReactNode;
      text: string;
  }> = ({ targetPage, icon, text }) => {
    const isActive = page === targetPage;
    return (
      <button
        onClick={() => setPage(targetPage)}
        className={`flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
          isActive
            ? 'bg-brand-accent text-white shadow'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span className="mr-3">{icon}</span>
        {text}
      </button>
    );
  };

  return (
    <div className="flex h-full bg-brand-primary font-sans text-brand-text">
      <aside className="w-64 bg-brand-secondary p-4 flex flex-col shadow-lg">
        <h1 className="text-2xl font-bold text-brand-text mb-8 px-2">SLA Command Center</h1>
        <nav className="flex flex-col gap-2">
            <NavLink targetPage="operations" icon={<Squares2X2Icon className="w-6 h-6" />} text="Operations" />
            <NavLink targetPage="heatmap" icon={<ChartBarIcon className="w-6 h-6" />} text="Leadership View" />
            <NavLink targetPage="configuration" icon={<CogIcon className="w-6 h-6" />} text="Configuration" />
        </nav>
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 bg-brand-secondary p-4 rounded-lg shadow-md flex justify-end items-center gap-4">
            <div className="flex items-center bg-gray-200 rounded-full p-1">
              <button onClick={() => setViewMode('active')} className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${viewMode === 'active' ? 'bg-white text-brand-accent shadow' : 'text-gray-500 hover:bg-gray-300'}`}>
                Active
              </button>
              <button onClick={() => setViewMode('resolved')} className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${viewMode === 'resolved' ? 'bg-white text-brand-accent shadow' : 'text-gray-500 hover:bg-gray-300'}`}>
                Resolved
              </button>
            </div>

            {viewMode === 'resolved' && (
                <div className="flex items-center space-x-2 animate-fade-in">
                <label htmlFor="time-slicer-select" className="text-sm font-medium text-brand-light">Period:</label>
                <select 
                    id="time-slicer-select" 
                    value={timeRange} 
                    onChange={e => setTimeRange(e.target.value)}
                    className={filterSelectClasses}
                >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="all">All Time</option>
                </select>
                </div>
            )}
            
            <div className="flex items-center gap-2 border-l pl-4">
                <select value={selectedBeam} onChange={handleBeamChange} className={filterSelectClasses}>
                    <option value="all">All Beams</option>
                    {HIERARCHY_DATA.map(beam => (
                        <option key={beam.name} value={beam.name}>{beam.name}</option>
                    ))}
                </select>
                <select value={selectedUnit} onChange={handleUnitChange} className={filterSelectClasses} disabled={selectedBeam === 'all'}>
                    <option value="all">All Units</option>
                    {availableUnits.map(unit => (
                        <option key={unit.name} value={unit.name}>{unit.name}</option>
                    ))}
                </select>
                <select value={selectedPortfolio} onChange={e => setSelectedPortfolio(e.target.value)} className={filterSelectClasses} disabled={selectedUnit === 'all'}>
                    <option value="all">All Portfolios</option>
                    {availablePortfolios.map(portfolio => (
                        <option key={portfolio.name} value={portfolio.name}>{portfolio.name}</option>
                    ))}
                </select>
            </div>
          </div>

          {page === 'operations' && (
             <div className="animate-fade-in">
                <KeyMetrics />
                <div className="mt-6 grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <div className="xl:col-span-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {priorityOrder.map(priority => (
                        <div key={priority} className="bg-brand-secondary p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-brand-accent">{priority} ({ticketsByPriority[priority]?.length || 0})</h3>
                            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                            {ticketsByPriority[priority] && ticketsByPriority[priority].length > 0 ? (
                                ticketsByPriority[priority].map(ticket => (
                                <TicketCard key={ticket.id} ticket={ticket} onClick={() => setSelectedTicket(ticket)}/>
                                ))
                            ) : (
                                <p className="text-brand-light text-sm text-center py-4">No {viewMode} tickets with this priority.</p>
                            )}
                            </div>
                        </div>
                        ))}
                    </div>
                    <aside className="xl:col-span-1 space-y-6">
                        <ServiceHealth services={services} />
                        <CriticalAlerts alerts={alerts} />
                        <OnCallSchedule onCall={onCall} />
                    </aside>
                </div>
             </div>
          )}
          {page === 'heatmap' && (
            <LeadershipHeatmap tickets={displayedTickets} hierarchy={displayedHierarchy} viewMode={viewMode} />
          )}
          {page === 'configuration' && (
              <ConfigurationPage />
          )}
        </main>
      </div>
      
      {selectedTicket && <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
      <Chatbot />
    </div>
  );
};

export default App;