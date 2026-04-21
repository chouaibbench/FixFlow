import React, { useEffect, useState } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { api } from '../lib/api';
import { Badge } from './ui/Badge';
import { useLanguage } from '../context/LanguageContext';

export const MachineHistory = ({ machine, onClose }) => {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/machines/${machine.id}/history`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [machine.id]);

  const getStatusIcon = (status) => {
    if (status === 'resolved')    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (status === 'in-progress') return <Clock className="h-4 w-4 text-amber-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b p-6 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold">{machine.name}</h2>
            <p className="text-sm text-slate-500">{machine.location} — {t('breakdownHistory')}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {loading && <p className="text-sm text-slate-500">{t('loading')}...</p>}
          {!loading && data?.tickets?.length === 0 && (
            <div className="flex flex-col items-center py-10 text-slate-400">
              <CheckCircle2 className="mb-3 h-10 w-10" />
              <p>{t('noHistoryYet')}</p>
            </div>
          )}
          {!loading && data?.tickets?.length > 0 && (
            <div className="space-y-4">
              {data.tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-lg border border-slate-100 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      <span className="font-medium text-sm">{ticket.description}</span>
                    </div>
                    <Badge variant={ticket.priority === 'critical' ? 'destructive' : ticket.priority === 'high' ? 'warning' : 'secondary'}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  {ticket.resolutionNotes && (
                    <div className="mt-3 flex gap-2 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <p className="text-sm text-emerald-800 dark:text-emerald-300">{ticket.resolutionNotes}</p>
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                    <span>{t('reported')}: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    {ticket.assignedTo && <span>{t('assignedTo')}: {ticket.assignedTo}</span>}
                    {ticket.status === 'resolved' && (
                      <span className="text-emerald-500">
                        {t('resolved')}: {new Date(ticket.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
