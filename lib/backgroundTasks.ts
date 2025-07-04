import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export const FETCH_TRADES_TASK = 'BACKGROUND_FETCH_TRADES';

const fetchCurrentPrice = async (symbol: string) => {
    // Replace with your actual API call to fetch the current price
    // For example, using a public API or your own backend
    // This is a placeholder implementation
    try {
        const response = await fetch(`https://api.example.com/current-price?symbol=${symbol}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.price; //TODO: Adjust based on new API
    } catch (error) {
        console.error(`Failed to fetch current price for ${symbol}:`, error);
        // throw error;
    }
};

TaskManager.defineTask(FETCH_TRADES_TASK, async () => {
    try {
        const data = await AsyncStorage.getItem('trades');
        const trades = data ? JSON.parse(data) : [];

        // For each open trade, fetch price and compare
        for (let trade of trades.filter(t => t.exitPrice == null)) {
            // You must supply your own fetch logic here:
            const current = await fetchCurrentPrice(trade.symbol);

            if (current <= trade.stopLoss || (trade.takeProfit && current >= trade.takeProfit)) {
                // Notify
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: `Trade ${trade.symbol} ${current <= trade.stopLoss ? 'SL' : 'TP'} Hit`,
                        body: `Price: ${current}`,
                    },
                    trigger: null, // immediate
                });
                // Update trade as closed
                trade.exitPrice = current;
                trade.winner = current >= trade.takeProfit;
                trade.profit = ((current - trade.entryPrice) * trade.lotSize * 10).toFixed(2);
            }
        }
        // Write back updated trades
        await AsyncStorage.setItem('trades', JSON.stringify(trades));
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (err) {
        console.error(err);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

export async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(FETCH_TRADES_TASK, {
        minimumInterval: 15 * 60,    // every 15 minutes
        stopOnTerminate: false,
        startOnBoot: true,
    });
}
