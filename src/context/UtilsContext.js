import React from 'react';
import is from 'is_js';

export const UtilsContext = React.createContext(null);

export const UtilsProvider = ({ children }) => {
  const isMobileView = is.mobile();

  return (
    <UtilsContext.Provider value={{isMobileView}}>
      <>
          {children}
      </>
    </UtilsContext.Provider>
  );
}