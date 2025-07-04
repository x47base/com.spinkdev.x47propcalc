import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export const TRADE_TASK = 'BACKGROUND_FETCH_TRADES';

async function fetchCurrentPrice(symbol: string): Promise<number | null> {
    try {
        // TODO: Implement actual API
        const res = await fetch(
            `https://api.example.com/current-price?symbol=${symbol}`
        );
        if (!res.ok) throw new Error('Network error');
        const { price } = await res.json();
        return 7.99; //price;
    } catch (err) {
        console.error(err);
        return null;
    }
}

TaskManager.defineTask(TRADE_TASK, async () => {
    try {
        const raw = await AsyncStorage.getItem('trades');
        const trades = raw ? JSON.parse(raw) : [];

        for (let t of trades.filter(x => x.exitPrice == null)) {
            const current = await fetchCurrentPrice(t.symbol);
            if (
                current != null &&
                (current <= t.stopLoss ||
                    (t.takeProfit != null && current >= t.takeProfit))
            ) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `Trade ${t.symbol} ${current <= t.stopLoss ? 'SL' : 'TP'
                            } Hit`,
                        body: `Price: ${current}`,
                    },
                    trigger: null,
                });
                t.exitPrice = current;
                t.winner = current >= (t.takeProfit ?? 0);
                t.profit = (
                    (current - t.entryPrice) *
                    t.lotSize *
                    10
                ).toFixed(2);
            }
        }

        await AsyncStorage.setItem('trades', JSON.stringify(trades));
        return BackgroundTask.BackgroundFetchResult.NewData;
    } catch (err) {
        console.error(err);
        return BackgroundTask.BackgroundFetchResult.Failed;
    }
});

export async function registerTradeTaskAsync() {
    return BackgroundTask.registerTaskAsync(TRADE_TASK, {
        minimumInterval: 15 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
    });
}
