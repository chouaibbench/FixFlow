import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Factory, Clock, AlertTriangle, CheckCircle2, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMachines } from '../../context/MachineContext';
import { api } from '../../lib/api';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { TicketList } from '../../components/TicketList';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { cn, getExpiryMessage } from '../../lib/utils';
import { useTickets } from '../../context/TicketContext';
import { useLanguage } from '../../context/LanguageContext';

export const TechnicianDashboard = () => {
  const { machines } = useMachines();
  const { tickets, updateTicketStatus, assignTicket } = useTickets();
  const { t } = useLanguage();
  const machinesWithIssues = new Set(tickets.filter(t => t.status !== 'resolved').map(t => t.machine_id));
  const machinesOnline = machines.length - machinesWithIssues.size;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' && t.createdAt && t.updatedAt);
  const avgResolution = resolvedTickets.length  ? (resolvedTickets.reduce((sum, t) => sum + (new Date(t.updatedAt) - new Date(t.createdAt)) / 3600000, 0) / resolvedTickets.length).toFixed(1) : '-';
  const [activeTab, setActiveTab] = useState('all');
  const [activityLogs, setActivityLogs] = useState([]);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [supervisor, setSupervisor] = useState(null);
  const [machineStats, setMachineStats] = useState([]);

  useEffect(() => {
    api.get('/logs').then(setActivityLogs).catch(() => {});
    api.get('/supervisor').then(setSupervisor).catch(() => {});
    api.get('/machines/stats').then(setMachineStats).catch(() => {});
  }, []);

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  const handleUpdateTicketStatus = (ticketId, status) => {
    updateTicketStatus(ticketId, status);
    toast.info(`Ticket ${ticketId} updated to ${status}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('maintenanceDashboard')}</h2>
        <p className="text-slate-500">{t('maintenanceDashboardDesc')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-80">{t('activeTickets')}</CardTitle>
            <TicketIcon className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter((t) => t.status !== 'resolved').length}</div>
            <p className="text-xs opacity-70">{t('updatedRealTime')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('machinesOnline')}</CardTitle>
            <Factory className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{machinesOnline} / {machines.length}</div>
            <p className="text-xs text-slate-500">{machines.length > 0 ? Math.round((machinesOnline / machines.length) * 100) : 0}% operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('avgResolution')}</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResolution} hrs</div>
            <p className="text-xs text-emerald-500">{t('basedOnResolved')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('criticalIssues')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{tickets.filter((t) => t.priority === 'critical').length}</div>
            <p className="text-xs text-slate-500">{t('requiresAction')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{t('maintenanceTickets')}</h3>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-slate-100 dark:bg-slate-900">
                <TabsTrigger value="all">{t('all')}</TabsTrigger>
                <TabsTrigger value="pending">{t('pending')}</TabsTrigger>
                <TabsTrigger value="in-progress">{t('active')}</TabsTrigger>
                <TabsTrigger value="resolved">{t('resolved')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <TicketList tickets={filteredTickets} onUpdateStatus={handleUpdateTicketStatus} onAssign={assignTicket} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('recentActivity')}</CardTitle>
              <CardDescription>{t('latestUpdates')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const logsToShow = showAllLogs ? activityLogs : activityLogs.slice(0, 8);
                // Group by date MM/DD/YYYY
                const groups = logsToShow.reduce((acc, log) => {
                  const d = new Date(log.created_at);
                  const key = `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}`;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(log);
                  return acc;
                }, {});

                return Object.entries(groups).map(([date, logs]) => (
                  <div key={date}>
                    <div className="sticky top-0 mb-3 flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{date}</span>
                      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-4">
                      {logs.map((log) => (
                        <div key={log.id} className="flex gap-3">
                          <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-indigo-500">
                            <Clock className="h-3.5 w-3.5" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium leading-snug">{log.description}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </p>
                            <p className="text-xs text-amber-500">{getExpiryMessage(log.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-xs text-indigo-600 dark:text-indigo-400" onClick={() => setShowAllLogs(prev => !prev)}>
                {showAllLogs ? t('showLess') : t('viewAllActivity')}
              </Button>
            </CardFooter>
          </Card>

          {machineStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart2 className="h-4 w-4 text-indigo-500" />
                  {t('mostProblematic')}
                </CardTitle>
                <CardDescription>{t('byOpenTickets')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {machineStats.slice(0, 5).map((m, i) => (
                  <div key={m.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {m.open_tickets_count > 0 && (
                        <Badge variant="destructive">{m.open_tickets_count} open</Badge>
                      )}
                      <span className="text-xs text-slate-400">{m.tickets_count} total</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white">            <CardHeader>
              <CardTitle className="text-lg">{t('needHelp')}</CardTitle>
              <CardDescription className="text-indigo-100">{t('contactSupervisor')}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(supervisor?.email ?? 'admin')}`} fallback="AD" className="h-12 w-12 border-2 border-white/20" />
              <div>
                <p className="font-bold">{supervisor?.name ?? 'Admin'}</p>
                <p className="text-xs text-indigo-100">Shift Supervisor{supervisor?.phone ? ` • ${supervisor.phone}` : ''}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50" onClick={() => supervisor?.phone && window.open(`tel:${supervisor.phone}`)}>{t('callSupervisor')}</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
