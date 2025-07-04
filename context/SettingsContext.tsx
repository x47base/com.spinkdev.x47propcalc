import { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Settings {
    unitsPerLot: number;
    leverage: number;
}

const DEFAULTS: Settings = {
    unitsPerLot: 100000,
    leverage: 100,
};

export const SettingsContext = createContext<{
    settings: Settings;
    update: (newSettings: Partial<Settings>) => Promise<void>;
}>({
    settings: DEFAULTS,
    update: async () => { },
});

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(DEFAULTS);

    useEffect(() => {
        (async () => {
            const json = await AsyncStorage.getItem('settings');
            if (json) setSettings(JSON.parse(json));
        })();
    }, []);

    const update = async (newSettings: Partial<Settings>) => {
        const merged = { ...settings, ...newSettings };
        setSettings(merged);
        await AsyncStorage.setItem('settings', JSON.stringify(merged));
    };

    return (
        <SettingsContext.Provider value={{ settings, update }}>
            {children}
        </SettingsContext.Provider>
    );
}
