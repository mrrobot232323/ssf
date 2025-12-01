import React, { useState } from 'react';
import { 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Modal,
  FlatList,
  StatusBar,
  SafeAreaView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Search, 
  Ship, 
  Scale, 
  DollarSign, 
  Percent, 
  Fish, 
  X, 
  CheckCircle2,
  Plus
} from 'lucide-react-native';

// --- MOCK CONTEXT ---
const useApp = () => {
    const [boats, setBoats] = useState([
        { id: '1', name: 'Sea Spirit', ownerName: 'Derek Doyle', image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1000&auto=format&fit=crop' },
        { id: '2', name: 'Ocean King', ownerName: 'Sarah Smith', image: 'https://images.unsplash.com/photo-1544551763-46a42a461d12?q=80&w=1000&auto=format&fit=crop' },
        { id: '3', name: 'Blue Horizon', ownerName: 'Mike Ross', image: 'https://images.unsplash.com/photo-1516410290616-2e452627e774?q=80&w=1000&auto=format&fit=crop' },
    ]);
    const addLot = (data: any) => console.log("Lot Added", data);
    return { boats, addLot };
};

// --- PREDEFINED SPECIES ---
const POPULAR_SPECIES = [
    "Prawns (Tiger)", "Prawns (White)", "Mackerel", "Tuna", "Sardine", "Squid", "Crab", "King Fish"
];

export default function NewLotScreen() {
    const router = useRouter();
    const { boats, addLot } = useApp();

    // Form State
    const [selectedBoat, setSelectedBoat] = useState<any | null>(null);
    const [species, setSpecies] = useState('');
    const [weight, setWeight] = useState('');
    const [price, setPrice] = useState('');
    const [commissionRate, setCommissionRate] = useState('5');

    // Search Modal State
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBoats = boats.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculated Values
    const weightNum = parseFloat(weight) || 0;
    const priceNum = parseFloat(price) || 0;
    const commRateNum = parseFloat(commissionRate) || 0;
    const totalAmount = weightNum * priceNum;
    const commissionAmount = (totalAmount * commRateNum) / 100;
    const payableAmount = totalAmount - commissionAmount;

    // Handlers
    const handleSave = (addAnother: boolean) => {
        if (!selectedBoat || !species || !weight || !price) {
            Alert.alert('Missing Fields', 'Please select a boat and fill in details.');
            return;
        }

        const lotData = {
            boatId: selectedBoat.id,
            species,
            weight: weightNum,
            pricePerUnit: priceNum,
            commissionRate: commRateNum,
            totalAmount,
            commissionAmount,
            payableAmount,
            date: new Date().toISOString(),
        };

        addLot(lotData);
        Alert.alert('Success', 'Lot Entry Created!');

        if (addAnother) {
            setSpecies('');
            setWeight('');
            setPrice('');
        } else {
            router.back();
        }
    };

    const handleSelectBoat = (boat: any) => {
        setSelectedBoat(boat);
        setIsSearchVisible(false);
        setSearchQuery('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0B15" />
            
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                {/* --- HEADER --- */}
                {/* Added styles.headerContainer to handle the margin top */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Lot Entry</Text>
                    <View style={{ width: 40 }} /> 
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* --- STEP 1: BOAT SELECTION --- */}
                    <Text style={styles.sectionLabel}>BOAT DETAILS</Text>
                    
                    {selectedBoat ? (
                        <View style={styles.selectedBoatCard}>
                            <Image source={{ uri: selectedBoat.image }} style={styles.boatThumb} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.selectedBoatName}>{selectedBoat.name}</Text>
                                <Text style={styles.selectedBoatOwner}>{selectedBoat.ownerName}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelectedBoat(null)} style={styles.changeButton}>
                                <Text style={styles.changeText}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.selectBoatBtn} onPress={() => setIsSearchVisible(true)}>
                            <View style={styles.iconCircle}>
                                <Ship size={20} color="#246BFD" />
                            </View>
                            <Text style={styles.selectBoatText}>Select a Boat</Text>
                            <ChevronLeft size={20} color="#666" style={{ transform: [{ rotate: '-90deg' }]}} />
                        </TouchableOpacity>
                    )}

                    {/* --- STEP 2: SPECIES --- */}
                    <Text style={[styles.sectionLabel, { marginTop: 24 }]}>CATCH DETAILS</Text>
                    
                    <View style={styles.inputContainer}>
                        <Fish size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Species Name"
                            placeholderTextColor="#666"
                            value={species}
                            onChangeText={setSpecies}
                        />
                    </View>

                    {/* Species Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                        {POPULAR_SPECIES.map((item, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={[
                                    styles.chip, 
                                    species === item && styles.chipActive
                                ]}
                                onPress={() => setSpecies(item)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    species === item && styles.chipTextActive
                                ]}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Weight & Price Row */}
                    <View style={styles.row}>
                        <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
                            <Scale size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Weight (kg)"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                                value={weight}
                                onChangeText={setWeight}
                            />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <DollarSign size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Price / kg"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>
                    </View>

                    {/* Commission */}
                    <View style={styles.inputContainer}>
                        <Percent size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Commission Rate %"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            value={commissionRate}
                            onChangeText={setCommissionRate}
                        />
                    </View>

                    {/* --- STEP 3: LIVE CALCULATIONS --- */}
                    <View style={styles.receiptCard}>
                         <View style={styles.receiptRow}>
                            <Text style={styles.receiptLabel}>Total Gross</Text>
                            <Text style={styles.receiptValue}>₹{totalAmount.toLocaleString()}</Text>
                         </View>
                         <View style={styles.receiptRow}>
                            <Text style={styles.receiptLabel}>Commission ({commissionRate}%)</Text>
                            <Text style={[styles.receiptValue, { color: '#FF575F' }]}>- ₹{commissionAmount.toLocaleString()}</Text>
                         </View>
                         <View style={styles.divider} />
                         <View style={styles.receiptRow}>
                            <Text style={styles.totalLabel}>Net Payable</Text>
                            <Text style={styles.totalValue}>₹{payableAmount.toLocaleString()}</Text>
                         </View>
                    </View>

                </ScrollView>

                {/* --- FOOTER ACTIONS --- */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.secondaryBtn} onPress={() => handleSave(true)}>
                        <Text style={styles.secondaryBtnText}>Save & Add New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => handleSave(false)}>
                        <Text style={styles.primaryBtnText}>Complete Lot</Text>
                    </TouchableOpacity>
                </View>

                {/* --- BOAT SEARCH MODAL --- */}
                <Modal visible={isSearchVisible} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                        <SafeAreaView style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setIsSearchVisible(false)}>
                                    <X size={24} color="#FFF" />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Select Boat</Text>
                                <View style={{ width: 24 }} />
                            </View>

                            <View style={styles.searchBar}>
                                <Search size={20} color="#666" />
                                <TextInput 
                                    style={styles.modalSearchInput}
                                    placeholder="Search boat name..."
                                    placeholderTextColor="#666"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoFocus
                                />
                            </View>

                            <FlatList 
                                data={filteredBoats}
                                keyExtractor={item => item.id}
                                contentContainerStyle={{ padding: 20 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectBoat(item)}>
                                        <Image source={{ uri: item.image }} style={styles.modalItemImg} />
                                        <View>
                                            <Text style={styles.modalItemName}>{item.name}</Text>
                                            <Text style={styles.modalItemOwner}>{item.ownerName}</Text>
                                        </View>
                                        <View style={{ flex: 1 }} />
                                        <CheckCircle2 size={20} color="#2A2A35" />
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <TouchableOpacity style={styles.addNewBoatRow}>
                                        <View style={styles.addIconSmall}>
                                            <Plus size={20} color="#FFF" />
                                        </View>
                                        <Text style={styles.addNewBoatText}>Add "{searchQuery}" as new boat</Text>
                                    </TouchableOpacity>
                                }
                            />
                        </SafeAreaView>
                    </View>
                </Modal>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#0B0B15" },
    container: { flex: 1, backgroundColor: "#0B0B15" },
    
    // Header
    header: { 
        paddingHorizontal: 20, 
        paddingBottom: 20, 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginTop: 40 // <--- ADDED MARGIN TOP 30 HERE
    },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: '#181822', borderWidth: 1, borderColor: '#2A2A35' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    sectionLabel: { color: '#666', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },

    // Boat Selection Styles
    selectBoatBtn: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#181822', borderRadius: 16,
        padding: 16, borderWidth: 1, borderColor: '#2A2A35', borderStyle: 'dashed'
    },
    iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(36, 107, 253, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    selectBoatText: { flex: 1, color: '#AAA', fontSize: 16 },

    selectedBoatCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#181822', borderRadius: 16,
        padding: 12, borderWidth: 1, borderColor: '#246BFD'
    },
    boatThumb: { width: 48, height: 48, borderRadius: 12, marginRight: 12 },
    selectedBoatName: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    selectedBoatOwner: { color: '#AAA', fontSize: 12 },
    changeButton: { backgroundColor: '#2A2A35', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    changeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },

    // Inputs
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#13131A', borderRadius: 12,
        borderWidth: 1, borderColor: '#2A2A35',
        marginBottom: 16, height: 56, paddingHorizontal: 16
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, color: '#FFF', fontSize: 16 },
    row: { flexDirection: 'row' },

    // Chips
    chipsScroll: { marginBottom: 16, maxHeight: 40 },
    chip: {
        backgroundColor: '#181822', paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 20, borderWidth: 1, borderColor: '#2A2A35',
        marginRight: 8, height: 36
    },
    chipActive: { backgroundColor: '#246BFD', borderColor: '#246BFD' },
    chipText: { color: '#AAA', fontSize: 12, fontWeight: '600' },
    chipTextActive: { color: '#FFF' },

    // Receipt / Calc
    receiptCard: {
        backgroundColor: '#181822', borderRadius: 20,
        padding: 20, marginTop: 10,
        borderWidth: 1, borderColor: '#2A2A35'
    },
    receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    receiptLabel: { color: '#AAA', fontSize: 14 },
    receiptValue: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#2A2A35', marginVertical: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#2A2A35' },
    totalLabel: { color: '#93D94E', fontSize: 16, fontWeight: '700' },
    totalValue: { color: '#93D94E', fontSize: 24, fontWeight: '700' },

    // Footer
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#0B0B15', borderTopWidth: 1, borderTopColor: '#2A2A35',
        flexDirection: 'row', padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20
    },
    secondaryBtn: {
        flex: 1, backgroundColor: '#181822',
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 16, marginRight: 12, height: 56,
        borderWidth: 1, borderColor: '#2A2A35'
    },
    secondaryBtnText: { color: '#FFF', fontWeight: '600' },
    primaryBtn: {
        flex: 1, backgroundColor: '#246BFD',
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 16, height: 56
    },
    primaryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },

    // Modal Styles
    modalContainer: { flex: 1, backgroundColor: '#0B0B15' },
    modalContent: { flex: 1 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    modalTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    searchBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#181822', margin: 20, marginTop: 0,
        paddingHorizontal: 16, height: 50, borderRadius: 12
    },
    modalSearchInput: { flex: 1, marginLeft: 12, color: '#FFF', fontSize: 16 },
    
    modalItem: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#181822', padding: 12, borderRadius: 12,
        marginBottom: 12, borderWidth: 1, borderColor: '#2A2A35'
    },
    modalItemImg: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    modalItemName: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    modalItemOwner: { color: '#AAA', fontSize: 12 },
    
    addNewBoatRow: {
        flexDirection: 'row', alignItems: 'center',
        padding: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#666',
        borderRadius: 12, justifyContent: 'center', marginTop: 10
    },
    addIconSmall: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#246BFD', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    addNewBoatText: { color: '#246BFD', fontWeight: '600' }
});