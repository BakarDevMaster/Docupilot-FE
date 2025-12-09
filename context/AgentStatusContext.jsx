import { createContext, useContext } from 'react';

const AgentStatusContext = createContext();

export function AgentStatusProvider({ children }) {
  return (
    <AgentStatusContext.Provider value={{}}>
      {children}
    </AgentStatusContext.Provider>
  );
}

export function useAgentStatus() {
  return useContext(AgentStatusContext);
}

