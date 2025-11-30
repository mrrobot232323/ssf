import Colors from '@/constants/Colors';
import { Boat, useApp } from '@/context/AppContext';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BoatsScreen() {
    const { boats, addBoat } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newBoat, setNewBoat] = useState({ name: '', ownerName: '', phone: '', notes: '' });

    const filteredBoats = boats.filter(boat =>
        boat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        boat.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddBoat = () => {
        if (!newBoat.name || !newBoat.ownerName) {
            alert('Please enter Boat Name and Owner Name');
            return;
        }
        addBoat(newBoat);
        setNewBoat({ name: '', ownerName: '', phone: '', notes: '' });
        setIsModalVisible(false);
    };

    const renderBoatItem = ({ item }: { item: Boat }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.boatName}>{item.name}</Text>
                <FontAwesome name="ship" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.cardRow}>
                <FontAwesome name="user" size={16} color="#666" style={styles.icon} />
                <Text style={styles.cardText}>{item.ownerName}</Text>
            </View>
            <View style={styles.cardRow}>
                <FontAwesome name="phone" size={16} color="#666" style={styles.icon} />
                <Text style={styles.cardText}>{item.phone}</Text>
            </View>
            {item.notes ? (
                <View style={styles.cardRow}>
                    <FontAwesome name="sticky-note" size={16} color="#666" style={styles.icon} />
                    <Text style={styles.cardText}>{item.notes}</Text>
                </View>
            ) : null}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Boat Management</Text>
            </View>

            <View style={styles.searchContainer}>
                <FontAwesome name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search boats..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredBoats}
                renderItem={renderBoatItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No boats found</Text>}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setIsModalVisible(true)}
            >
                <FontAwesome name="plus" size={24} color="#FFF" />
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Boat</Text>

                        <Text style={styles.label}>Boat Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newBoat.name}
                            onChangeText={(text) => setNewBoat({ ...newBoat, name: text })}
                            placeholder="e.g. Sea Queen"
                        />

                        <Text style={styles.label}>Owner Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newBoat.ownerName}
                            onChangeText={(text) => setNewBoat({ ...newBoat, ownerName: text })}
                            placeholder="e.g. Raju"
                        />

                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={newBoat.phone}
                            onChangeText={(text) => setNewBoat({ ...newBoat, phone: text })}
                            placeholder="e.g. 9876543210"
                            keyboardType="phone-pad"
                        />

                        <Text style={styles.label}>Notes (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={newBoat.notes}
                            onChangeText={(text) => setNewBoat({ ...newBoat, notes: text })}
                            placeholder="Additional details"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleAddBoat}
                            >
                                <Text style={styles.saveButtonText}>Save Boat</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 20,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    boatName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        width: 20,
        marginRight: 8,
    },
    cardText: {
        fontSize: 16,
        color: '#555',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 40,
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    modalButton: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: Colors.light.primary,
        marginLeft: 10,
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 16,
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
});
