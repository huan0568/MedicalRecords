/*
import React, { createContext, useContext, useState } from 'react';

interface PredictionContextType {
  prediction: string;
  setPrediction: (prediction: string) => void;
}

export const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionContextProvider');
  }
  return context;
};

interface PredictionContextProviderProps {
  children: React.ReactNode;
}

export const PredictionContextProvider: React.FC<PredictionContextProviderProps> = ({ children }) => {
  const [prediction, setPrediction] = useState<string>('');

  return (
    <PredictionContext.Provider value={{ prediction, setPrediction }}>
      {children}
    </PredictionContext.Provider>
  );
};
*/


import React, { createContext, useContext, useState } from 'react';

interface PredictionContextType {
  prediction: string;
  setPrediction: (prediction: string) => void;
}

export const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionContextProvider');
  }
  return context;
};

interface PredictionContextProviderProps {
  children: React.ReactNode;
}

export const PredictionContextProvider: React.FC<PredictionContextProviderProps> = ({ children }) => {
  const [prediction, setPrediction] = useState<string>('');

  return (
    <PredictionContext.Provider value={{ prediction, setPrediction }}>
      {children}
    </PredictionContext.Provider>
  );
};
