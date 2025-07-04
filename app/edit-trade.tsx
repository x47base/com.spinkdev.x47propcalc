import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView, Text, TextInput, Alert, ScrollView, View } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditTradeScreen() {
    const navigation = useNavigation();
    const router = useRoute();
    const { trade } = router.params;
    const [exitPrice, setExitPrice] = useState(trade.exitPrice?.toString() || '');
    const [winner, setWinner] = useState(trade.winner ?? false);
    const [profit, setProfit] = useState(trade.profit?.toString() || '');
    const [trades, setTrades] = useState([]);

    const loadTrades = async () => {
        const stored = await AsyncStorage.getItem('trades');
        setTrades(stored ? JSON.parse(stored) : []);
    };

    useEffect(() => {
        loadTrades();
    }, []);

    const onSave = async (updated: any) => {
        const newList = trades.map(t => t.id === updated.id ? updated : t);
        await AsyncStorage.setItem('trades', JSON.stringify(newList));
        setTrades(newList);
    };

    const save = () => {
        const exit = parseFloat(exitPrice);
        const prof = parseFloat(profit);
        if (isNaN(exit) || isNaN(prof)) {
            return Alert.alert('Invalid', 'Enter numeric exit and profit');
        }
        onSave({ ...trade, exitPrice: exit, profit: prof.toFixed(2), winner });
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('index');
        };
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 20 }}>
                    Edit Trade
                </Text>
                <View style={{ marginBottom: 16 }}>
                    <TextInput
                        placeholder="Exit Price"
                        keyboardType="numeric"
                        value={exitPrice}
                        onChangeText={setExitPrice}
                        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginVertical: 8 }}
                    />
                    <TextInput
                        placeholder="Profit / Loss ($)"
                        keyboardType="numeric"
                        value={profit}
                        onChangeText={setProfit}
                        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginVertical: 8 }}
                    />
                    <Button
                        title={winner ? 'Mark as Loser' : 'Mark as Winner'}
                        type="outline"
                        onPress={() => setWinner(!winner)}
                    />
                    <Button title="Save Changes" onPress={save} containerStyle={{ marginTop: 16 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}