import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PriceContextType {
  price: number | null;
  setPrice: (price: number | null) => void;
}

const PriceContext = createContext<PriceContextType>({
  price: null,
  setPrice: () => {}
});

export const usePriceContext = () => useContext(PriceContext);

interface PriceProviderProps {
  children: ReactNode;
}

export const PriceProvider: React.FC<PriceProviderProps> = ({ children }) => {
  const [price, setPrice] = useState<number | null>(null);

  return (
    <PriceContext.Provider value={{ price, setPrice }}>
      {children}
    </PriceContext.Provider>
  );
};

export default PriceProvider;
