import { useContext, useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import { SettingsContext } from '../context/SettingsContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { settings, update } = useContext(SettingsContext);
    const [units, setUnits] = useState(settings.unitsPerLot.toString());
    const [lev, setLev] = useState(settings.leverage.toString());

    const save = async () => {
        const u = parseFloat(units);
        const l = parseFloat(lev);
        if (isNaN(u) || u <= 0 || isNaN(l) || l <= 0) {
            return Alert.alert('Invalid', 'Please enter positive numbers');
        }
        await update({ unitsPerLot: u, leverage: l });
        Alert.alert('Saved', 'Settings updated');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 20 }}>
                    Settings
                </Text>
                <View style={{ marginBottom: 16 }}>
                    <Text>Units per Lot</Text>
                    <TextInput
                        keyboardType="numeric"
                        value={units}
                        onChangeText={setUnits}
                        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginVertical: 8 }}
                    />
                    <Text>Leverage</Text>
                    <TextInput
                        keyboardType="numeric"
                        value={lev}
                        onChangeText={setLev}
                        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginVertical: 8 }}
                    />
                    <Button title="Save Settings" onPress={save} containerStyle={{ marginTop: 16 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
