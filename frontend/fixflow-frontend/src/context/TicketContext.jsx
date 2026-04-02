import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_TICKETS } from '../data/mockData';

const TicketContext = createContext(undefined);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const savedTickets = localStorage.getItem('fixflow_tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    } else {
      setTickets(MOCK_TICKETS);
    }
  }, []);

  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('fixflow_tickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  const addTicket = (ticketData) => {
    const newTicket = {
      ...ticketData,
      id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const updateTicketStatus = (ticketId, status) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const assignTicket = (ticketId, technician) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, assignedTo: technician, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicketStatus, assignTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
