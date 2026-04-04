import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const TicketContext = createContext(undefined);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const data = await api.get('/tickets');
      setTickets(data);
    } catch (_) {}
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const addTicket = async (ticketData) => {
    const newTicket = await api.post('/tickets', ticketData);
    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = async (ticketId, status) => {
    const updated = await api.put(`/tickets/${ticketId}`, { status });
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
  };

  const assignTicket = async (ticketId, technician) => {
    const updated = await api.put(`/tickets/${ticketId}`, { assigned_to: technician });
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicketStatus, assignTicket, fetchTickets }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) throw new Error('useTickets must be used within a TicketProvider');
  return context;
};
