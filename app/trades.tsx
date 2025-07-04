import { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Card } from 'react-native-elements';
import "nativewind";

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

import { useNavigation } from '@react-navigation/native';

export default function TradesScreen() {
    const navigation = useNavigation();
    const [trades, setTrades] = useState([]);

    const loadTrades = async () => {
        const stored = await AsyncStorage.getItem('trades');
        setTrades(stored ? JSON.parse(stored) : []);
    };

    useEffect(() => {
        loadTrades();
        const sub = Notifications.addNotificationReceivedListener(() => loadTrades());
        return () => sub.remove();
    }, []);

    const deleteTrade = async (id: any) => {
        const filtered = trades.filter(t => t.id !== id);
        await AsyncStorage.setItem('trades', JSON.stringify(filtered));
        setTrades(filtered);
    };
    const editTrade = async (updated: any) => {
        const newList = trades.map(t => t.id === updated.id ? updated : t);
        await AsyncStorage.setItem('trades', JSON.stringify(newList));
        setTrades(newList);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 20 }}>
                    Saved Trades
                </Text>
                {trades.length ? trades.map(t => (
                    <Card containerStyle={styles.card} key={t.id}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.symbol}>{t.symbol}</Text>
                            <View style={styles.buttons}>
                                <Button
                                    type="outline"
                                    size="sm"
                                    onPress={() => navigation.navigate('edit-trade', { trade: t, onSave: editTrade })}
                                    containerStyle={styles.buttonSpacing}
                                    title="Edit"
                                />
                                <Button
                                    type="outline"
                                    size="sm"
                                    onPress={() => deleteTrade(t.id)}
                                    title="Delete"
                                />
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.body}>
                            <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.label}>Entry</Text>
                                    <Text style={styles.value}>{t.entryPrice}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.label}>SL</Text>
                                    <Text style={styles.value}>{t.stopLoss}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.label}>TP</Text>
                                    <Text style={styles.value}>{t.takeProfit}</Text>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.label}>Lot</Text>
                                    <Text style={styles.value}>{t.lotSize}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.label}>R/R</Text>
                                    <Text style={styles.value}>{t.riskReward}</Text>
                                </View>
                                {t.exitPrice != null && (
                                    <View style={styles.cell}>
                                        <Text style={styles.label}>Exit</Text>
                                        <Text style={styles.value}>{t.exitPrice}</Text>
                                    </View>
                                )}
                            </View>

                            {t.exitPrice != null && (
                                <View style={styles.row}>
                                    <View style={styles.cellFull}>
                                        <Text style={[styles.value, t.winner ? styles.winner : styles.loser]}>
                                            P/L: ${t.profit} • {t.winner ? 'Winner' : 'Loser'}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </Card>
                )) : (
                    <Text style={{ textAlign: 'center', marginTop: 40, color: '#718096' }}>No saved trades yet</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        padding: 0,
        marginVertical: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    symbol: {
        fontSize: 18,
        fontWeight: '600',
    },
    buttons: {
        flexDirection: 'row',
    },
    buttonSpacing: {
        marginRight: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    body: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    cell: {
        flex: 1,
    },
    cellFull: {
        flex: 1,
    },
    label: {
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 4,
    },
    value: {
        fontSize: 14,
        lineHeight: 20,
    },
    winner: {
        color: 'green',
    },
    loser: {
        color: 'red',
    },
});
