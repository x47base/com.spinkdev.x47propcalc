import { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Keyboard,
    Alert,
    StyleSheet
} from 'react-native';
import { Button, Card } from '@rneui/themed';
import * as Notifications from 'expo-notifications';
import { SettingsContext, type Trade } from '../context/SettingsContext';
import { SafeAreaView } from 'react-native-safe-area-context';

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function CalculatorScreen() {
    const { settings, addTrade } = useContext(SettingsContext);

    const [symbol, setSymbol] = useState('');
    const [accountBalance, setAccountBalance] = useState('');
    const [riskPercentage, setRiskPercentage] = useState('');
    const [entryPrice, setEntryPrice] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // Request notification permissions once
    useEffect(() => { Notifications.requestPermissionsAsync(); }, []);

    const calculateTrade = () => {
        setError('');
        const balance = parseFloat(accountBalance);
        const riskPct = parseFloat(riskPercentage) / 100;
        const entry = parseFloat(entryPrice);
        const sl = parseFloat(stopLoss);
        const tp = parseFloat(takeProfit);

        if (!symbol.trim()) return setError('Symbol required');
        if ([balance, riskPct, entry, sl].some(v => isNaN(v) || v <= 0)) {
            return setError('Enter valid, positive numbers');
        }
        if (Math.abs(entry - sl) < 1e-6) {
            return setError('Entry and Stop Loss cannot match');
        }

        const riskAmount = balance * riskPct;
        const pipMultiplier = symbol.includes('JPY') ? 100 : 10000;
        const pipDistanceInPips = Math.abs(entry - sl) * pipMultiplier;
        const pipValuePerLot = (settings.unitsPerLot / 100000) * 10;
        const lotSizeNum = riskAmount / (pipDistanceInPips * pipValuePerLot);
        const lotSize = lotSizeNum.toFixed(2);

        const potentialLoss = (-riskAmount).toFixed(2);
        const profitDistance = tp ? Math.abs(entry - tp) * pipMultiplier : 0;
        const potentialProfit = tp
            ? (profitDistance * 10 * lotSizeNum).toFixed(2)
            : '0.00';
        const riskReward = tp
            ? (profitDistance / pipDistanceInPips).toFixed(2)
            : 'N/A';

        setResult({ lotSize, riskAmount: riskAmount.toFixed(2), potentialProfit, potentialLoss, riskReward });
        Keyboard.dismiss();
    };

    const saveTrade = async () => {
        try {
            const trade: Trade = {
                id: Date.now(),
                symbol,
                entryPrice,
                stopLoss,
                takeProfit,
                ...result
            };
            addTrade(trade);
            /*
            const stored = await AsyncStorage.getItem('trades');
            const list = stored ? JSON.parse(stored) : [];
            await AsyncStorage.setItem('trades', JSON.stringify([trade, ...list]));
            */
            Alert.alert('Saved', 'Trade has been saved');
            await Notifications.scheduleNotificationAsync({
                content: { title: 'Trade Reminder', body: `${symbol} entry at ${entryPrice}` },
                trigger: { seconds: 3600 }
            });
        } catch {
            Alert.alert('Error', 'Could not save trade');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 20 }}>
                    Trade Calculator
                </Text>
                <View style={{ marginBottom: 16 }}>
                    <TextInput
                        placeholder="Symbol (e.g. EURUSD)"
                        value={symbol}
                        onChangeText={setSymbol}
                        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 }}
                    />
                    <TextInput
                        placeholder="Balance ($)"
                        keyboardType="numeric"
                        value={accountBalance}
                        onChangeText={setAccountBalance}
                        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 }}
                    />
                    <TextInput
                        placeholder="Risk (%)"
                        keyboardType="numeric"
                        value={riskPercentage}
                        onChangeText={setRiskPercentage}
                        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 }}
                    />
                    <TextInput
                        placeholder="Entry Price"
                        keyboardType="numeric"
                        value={entryPrice}
                        onChangeText={setEntryPrice}
                        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 }}
                    />
                    <TextInput
                        placeholder="Stop Loss"
                        keyboardType="numeric"
                        value={stopLoss}
                        onChangeText={setStopLoss}
                        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 }}
                    />
                    <TextInput
                        placeholder="Take Profit (optional)"
                        keyboardType="numeric"
                        value={takeProfit}
                        onChangeText={setTakeProfit}
                        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12 }}
                    />
                    {error ? <Text style={{ color: '#e53e3e', textAlign: 'center', marginVertical: 12 }}>{error}</Text> : null}
                    <Button title="Calculate" onPress={calculateTrade} containerStyle={{ marginTop: 16, borderRadius: 8 }} />
                </View>
                {result && (
                    <Card containerStyle={styles.card}>
                        <Card.Title>
                            <Text style={styles.title}>Results</Text>
                        </Card.Title>
                        <Card.Divider />
                        <View style={styles.body}>
                            <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.label}>Lot Size</Text>
                                    <Text style={styles.value}>{result.lotSize}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.label}>Risk Amount</Text>
                                    <Text style={styles.value}>${result.riskAmount}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={styles.label}>Potential Profit</Text>
                                    <Text style={styles.value}>${result.potentialProfit}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.label}>Potential Loss</Text>
                                    <Text style={styles.value}>${result.potentialLoss}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.cellFull}>
                                    <Text style={styles.label}>R/R Ratio</Text>
                                    <Text style={styles.value}>{result.riskReward}</Text>
                                </View>
                            </View>
                        </View>
                        {/* Save button */}
                        <View style={styles.buttonWrapper}>
                            <Button title="Save & Remind" onPress={saveTrade} />
                        </View>
                    </Card>
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
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    body: {
        paddingHorizontal: 16,
        marginBottom: 16,
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
    buttonWrapper: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});
