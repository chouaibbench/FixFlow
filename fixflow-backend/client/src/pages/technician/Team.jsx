import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { useTickets } from '../../context/TicketContext';

export const TechnicianTeam = () => {
  const [technicians, setTechnicians] = useState([]);
  const { tickets } = useTickets();

  useEffect(() => {
    api.get('/users')
      .then((data) => setTechnicians(data.filter((u) => u.role === 'technician')))
      .catch(() => {});
  }, []);

  const getAssignedCount = (userId) =>
    tickets.filter((t) => t.assigned_to === userId && t.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Technician Team</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {technicians.length === 0 ? (
          <p className="text-slate-500">No technicians found.</p>
        ) : (
          technicians.map((tech) => (
            <Card key={tech.id}>
              <CardContent className="pt-6 flex items-center gap-4">
                <Avatar
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(tech.email)}`}
                  fallback={tech.name[0]}
                  className="h-12 w-12"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold truncate">{tech.name}</p>
                  <p className="text-xs text-slate-500 truncate">{tech.email}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Active tickets: <span className="font-medium">{getAssignedCount(tech.id)}</span>
                  </p>
                </div>
                <Badge variant={tech.is_online ? 'success' : 'secondary'}>
                  {tech.is_online ? 'Online' : 'Offline'}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
