import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const MachineContext = createContext(undefined);

export const MachineProvider = ({ children }) => {
  const { user } = useAuth();
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    api.get('/machines')
      .then((data) => setMachines(data))
      .catch(() => setMachines([]))
      .finally(() => setIsLoading(false));
  }, [user]);
  

  return (
    <MachineContext.Provider value={{ machines, isLoading }}>
      {children}
    </MachineContext.Provider>
  );
};

export const useMachines = () => {
  const context = useContext(MachineContext);
  if (context === undefined) throw new Error('useMachines must be used within a MachineProvider');
  return context;
};
