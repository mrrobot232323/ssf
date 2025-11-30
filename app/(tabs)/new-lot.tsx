import Colors from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NewLotScreen() {
    const { boats, addLot } = useApp();

    // Form State
    const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null);
    const [species, setSpecies] = useState('');
    const [weight, setWeight] = useState('');
    const [price, setPrice] = useState('');
    const [commissionRate, setCommissionRate] = useState('5'); // Default 5%

    // Calculated Values
    const weightNum = parseFloat(weight) || 0;
    const priceNum = parseFloat(price) || 0;
    const commRateNum = parseFloat(commissionRate) || 0;

    const totalAmount = weightNum * priceNum;
    const commissionAmount = (totalAmount * commRateNum) / 100;
    const payableAmount = totalAmount - commissionAmount;

    const handleSave = (addAnother: boolean) => {
        if (!selectedBoatId || !species || !weight || !price) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }

        addLot({
            boatId: selectedBoatId,
            species,
            weight: weightNum,
            pricePerUnit: priceNum,
            commissionRate: commRateNum,
            totalAmount,
            commissionAmount,
            payableAmount,
        });

        Alert.alert('Success', 'Lot added successfully!');

        if (addAnother) {
            // Reset fields except boat
            setSpecies('');
            setWeight('');
            setPrice('');
        } else {
            // Reset all and go back/home
            resetForm();
            router.push('/(tabs)');
        }
    };

    const resetForm = () => {
        setSelectedBoatId(null);
        setSpecies('');
        setWeight('');
        setPrice('');
        setCommissionRate('5');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>New Lot Entry</Text>
                </View>

                {/* Step 1: Select Boat */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>1. Select Boat</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.boatList}>
                        {boats.map((boat) => (
                            <TouchableOpacity
                                key={boat.id}
                                style={[
                                    styles.boatCard,
                                    selectedBoatId === boat.id && styles.selectedBoatCard
                                ]}
                                onPress={() => setSelectedBoatId(boat.id)}
                            >
                                <FontAwesome
                                    name="ship"
                                    size={24}
                                    color={selectedBoatId === boat.id ? '#FFF' : Colors.light.primary}
                                />
                                <Text style={[
                                    styles.boatName,
                                    selectedBoatId === boat.id && styles.selectedBoatText
                                ]}>{boat.name}</Text>
                                <Text style={[
                                    styles.ownerName,
                                    selectedBoatId === boat.id && styles.selectedBoatText
                                ]}>{boat.ownerName}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Step 2: Lot Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>2. Lot Details</Text>

                    <Text style={styles.label}>Species Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Prawns, Mackerel"
                        value={species}
                        onChangeText={setSpecies}
                    />

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Weight (Kg)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.0"
                                keyboardType="numeric"
                                value={weight}
                                onChangeText={setWeight}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Price / Kg</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="₹ 0.0"
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Commission %</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="5"
                        keyboardType="numeric"
                        value={commissionRate}
                        onChangeText={setCommissionRate}
                    />
                </View>

                {/* Calculations */}
                <View style={styles.calcCard}>
                    <View style={styles.calcRow}>
                        <Text style={styles.calcLabel}>Total Amount</Text>
                        <Text style={styles.calcValue}>₹{totalAmount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.calcRow}>
                        <Text style={styles.calcLabel}>Commission ({commissionRate}%)</Text>
                        <Text style={styles.calcValue}>- ₹{commissionAmount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.calcRow}>
                        <Text style={styles.finalLabel}>Final Payable</Text>
                        <Text style={styles.finalValue}>₹{payableAmount.toLocaleString()}</Text>
                    </View>
                </View>

                {/* Step 3: Actions */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => handleSave(true)}
                    >
                        <Text style={styles.secondaryButtonText}>Save & Add Another</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={() => handleSave(false)}
                    >
                        <Text style={styles.primaryButtonText}>Save Lot</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    boatList: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    boatCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginRight: 12,
        width: 120,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    selectedBoatCard: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    boatName: {
        marginTop: 8,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    ownerName: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    selectedBoatText: {
        color: '#FFF',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
        marginTop: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    calcCard: {
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    calcRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    calcLabel: {
        fontSize: 14,
        color: '#555',
    },
    calcValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#BBDEFB',
        marginVertical: 8,
    },
    finalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    finalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    actionButtons: {
        gap: 12,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: Colors.light.primary,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    secondaryButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: Colors.light.primary,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
