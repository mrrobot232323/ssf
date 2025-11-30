import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Boat = {
    id: string;
    name: string;
    ownerName: string;
    phone: string;
    notes?: string;
};

export type Lot = {
    id: string;
    boatId: string;
    species: string;
    weight: number;
    pricePerUnit: number;
    commissionRate: number;
    totalAmount: number;
    commissionAmount: number;
    payableAmount: number;
    timestamp: number;
};

interface AppContextType {
    boats: Boat[];
    lots: Lot[];
    addBoat: (boat: Omit<Boat, 'id'>) => void;
    addLot: (lot: Omit<Lot, 'id' | 'timestamp'>) => void;
    getBoatName: (id: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [boats, setBoats] = useState<Boat[]>([
        // Dummy data for initial view
        { id: '1', name: 'Sea Queen', ownerName: 'Raju', phone: '9876543210' },
        { id: '2', name: 'Ocean Star', ownerName: 'Mani', phone: '9123456789' },
    ]);
    const [lots, setLots] = useState<Lot[]>([]);

    const addBoat = (boat: Omit<Boat, 'id'>) => {
        const newBoat = { ...boat, id: Date.now().toString() };
        setBoats(prev => [...prev, newBoat]);
    };

    const addLot = (lot: Omit<Lot, 'id' | 'timestamp'>) => {
        const newLot = { ...lot, id: Date.now().toString(), timestamp: Date.now() };
        setLots(prev => [newLot, ...prev]);
    };

    const getBoatName = (id: string) => {
        return boats.find(b => b.id === id)?.name || 'Unknown Boat';
    };

    return (
        <AppContext.Provider value={{ boats, lots, addBoat, addLot, getBoatName }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
