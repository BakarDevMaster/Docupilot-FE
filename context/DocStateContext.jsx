import { createContext, useContext } from 'react';

const DocStateContext = createContext();

export function DocStateProvider({ children }) {
  return (
    <DocStateContext.Provider value={{}}>
      {children}
    </DocStateContext.Provider>
  );
}

export function useDocState() {
  return useContext(DocStateContext);
}

