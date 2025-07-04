import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Settings {
    unitsPerLot: number;
    leverage: number;
}

export interface Trade {
    id: number;
    symbol: string;
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    lotSize: number;
    riskReward: number;
    exitPrice?: number;
    profit?: number;
    winner?: boolean;
}

export interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
    trades: Trade[];
    addTrade: (trade: Trade) => Promise<void>;
    updateTrade: (id: number, updated: Partial<Trade>) => Promise<void>;
    removeTrade: (id: number) => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
    unitsPerLot: 100000,
    leverage: 100,
};

export const SettingsContext = createContext<SettingsContextType>({
    settings: DEFAULT_SETTINGS,
    updateSettings: async () => { },
    trades: [],
    addTrade: async () => { },
    updateTrade: async () => { },
    removeTrade: async () => { },
});

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [trades, setTrades] = useState<Trade[]>([]);

    // Load settings and trades on mount
    useEffect(() => {
        (async () => {
            const settingsJson = await AsyncStorage.getItem('settings');
            if (settingsJson) setSettings(JSON.parse(settingsJson));

            const tradesJson = await AsyncStorage.getItem('trades');
            if (tradesJson) setTrades(JSON.parse(tradesJson));
        })();
    }, []);

    const updateSettings = async (newSettings: Partial<Settings>) => {
        const merged = { ...settings, ...newSettings };
        setSettings(merged);
        await AsyncStorage.setItem('settings', JSON.stringify(merged));
    };

    const persistTrades = async (updatedTrades: Trade[]) => {
        setTrades(updatedTrades);
        await AsyncStorage.setItem('trades', JSON.stringify(updatedTrades));
    };

    const addTrade = async (trade: Trade) => {
        const updated = [trade, ...trades];
        await persistTrades(updated);
    };

    const updateTrade = async (id: number, updatedFields: Partial<Trade>) => {
        const updated = trades.map(t => t.id === id ? { ...t, ...updatedFields } : t);
        await persistTrades(updated);
    };

    const removeTrade = async (id: number) => {
        const updated = trades.filter(t => t.id !== id);
        await persistTrades(updated);
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            trades,
            addTrade,
            updateTrade,
            removeTrade,
        }}>
            {children}
        </SettingsContext.Provider>
    );
}
