import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SettingsProvider } from '../context/SettingsContext';
import { registerBackgroundFetchAsync } from '../lib/backgroundTasks';
import 'nativewind';

// Prevent auto hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [ready, setReady] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });

    useEffect(() => {
        registerBackgroundFetchAsync();
    }, []);

    useEffect(() => {
        async function prepare() {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) setUser(token);
            } catch (e) {
                console.warn(e);
            } finally {
                if (fontsLoaded) setReady(true);
            }
        }
        prepare();
    }, [fontsLoaded]);

    const onLayout = useCallback(async () => {
        if (ready) {
            await SplashScreen.hideAsync();
        }
    }, [ready]);

    if (!ready) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
            <SettingsProvider>
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarStyle: {
                            backgroundColor: '#ffffff',
                            borderTopWidth: 1,
                            borderTopColor: '#e5e7eb',
                            height: 60,
                            paddingBottom: 5,
                        },
                        tabBarActiveTintColor: '#3b82f6',
                        tabBarInactiveTintColor: '#6b7280',
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: 'Calculator',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="calculator" size={size} color={color} />
                            ),
                        }}
                    />
                </Tabs>
            </SettingsProvider>
        </GestureHandlerRootView>
    );
}