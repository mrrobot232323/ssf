import React, { useState, useEffect } from 'react';
import { 
  FlatList, 
  KeyboardAvoidingView, 
  Modal, 
  Platform, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Image, 
  StatusBar,
  SafeAreaView,
  Alert,
  RefreshControl,
  Linking, // Import Linking for calls
  ScrollView // Import ScrollView for form scrolling
} from 'react-native';
import { 
  Search, 
  Plus, 
  User, 
  Phone, 
  FileText, 
  X, 
  Camera, 
  MoreVertical,
  ChevronLeft,
  Trash2,
  Edit2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react-native';
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker'; // Import Image Picker

// --- MOCK CONTEXT ---
const useApp = () => {
  const [boats, setBoats] = useState([
    { id: '1', name: 'Sea Spirit', ownerName: 'Derek Doyle', phone: '9876543210', notes: 'Premium member', status: 'active', image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1000&auto=format&fit=crop' },
    { id: '2', name: 'Ocean King', ownerName: 'Sarah Smith', phone: '1234567890', notes: 'Engine service due', status: 'maintenance', image: 'https://images.unsplash.com/photo-1544551763-46a42a461d12?q=80&w=1000&auto=format&fit=crop' },
  ]);

  const addBoat = (boat: any) => setBoats(prev => [{...boat, id: Math.random().toString(), status: 'active'}, ...prev]);
  
  const updateBoat = (id: string, updatedData: any) => {
    setBoats(prev => prev.map(boat => boat.id === id ? { ...boat, ...updatedData } : boat));
  };

  const deleteBoat = (id: string) => {
    setBoats(prev => prev.filter(boat => boat.id !== id));
  };

  return { boats, addBoat, updateBoat, deleteBoat };
};
// --------------------

export default function BoatsScreen() {
    const router = useRouter();
    const { boats, addBoat, updateBoat, deleteBoat } = useApp();
    
    // UI States
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Data States
    const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', ownerName: '', phone: '', notes: '', image: '', status: 'active' });

    const filteredBoats = boats.filter(boat =>
        boat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        boat.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- HANDLERS ---

    // 1. Image Picker Logic
    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFormData({ ...formData, image: result.assets[0].uri });
        }
    };

    // 2. Phone Call Logic
    const handleCall = (phoneNumber: string) => {
        const url = `tel:${phoneNumber}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    Alert.alert('Error', 'Phone calls are not supported on this simulator');
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    const handleOpenAdd = () => {
        setFormData({ name: '', ownerName: '', phone: '', notes: '', image: '', status: 'active' });
        setSelectedBoatId(null);
        setIsFormVisible(true);
    };

    const handleOpenOptions = (boat: any) => {
        setSelectedBoatId(boat.id);
        setFormData(boat);
        setIsOptionsVisible(true);
    };

    const handleEditFromOptions = () => {
        setIsOptionsVisible(false);
        setTimeout(() => setIsFormVisible(true), 300);
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Boat",
            "Are you sure? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: () => {
                        if (selectedBoatId) deleteBoat(selectedBoatId);
                        setIsOptionsVisible(false);
                    }
                }
            ]
        );
    };

    const handleToggleStatus = () => {
        if (selectedBoatId) {
            const newStatus = formData.status === 'active' ? 'maintenance' : 'active';
            updateBoat(selectedBoatId, { status: newStatus });
            setIsOptionsVisible(false);
        }
    };

    const handleSave = () => {
        if (!formData.name || !formData.ownerName) {
            Alert.alert('Missing Info', 'Please enter Boat Name and Owner Name');
            return;
        }

        const finalData = {
            ...formData,
            // Fallback image if user didn't pick one
            image: formData.image || 'https://images.unsplash.com/photo-1516410290616-2e452627e774?q=80&w=1000&auto=format&fit=crop'
        };

        if (selectedBoatId) {
            updateBoat(selectedBoatId, finalData);
        } else {
            addBoat(finalData);
        }

        setIsFormVisible(false);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    // --- RENDER ITEM ---
    const renderBoatItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9} 
            onPress={() => handleOpenOptions(item)}
        >
            <View style={styles.cardImageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={[
                    styles.cardStatusBadge, 
                    { borderColor: item.status === 'active' ? '#93D94E' : '#FFD300' }
                ]}>
                    <View style={[
                        styles.statusDot, 
                        { backgroundColor: item.status === 'active' ? '#93D94E' : '#FFD300' }
                    ]} />
                    <Text style={[
                        styles.statusText,
                        { color: item.status === 'active' ? '#93D94E' : '#FFD300' }
                    ]}>
                        {item.status === 'active' ? 'Active' : 'Maintenance'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={{flex: 1}}>
                        <Text style={styles.boatName}>{item.name}</Text>
                        <Text style={styles.idText}>ID: #{item.id.substring(0,4)}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.moreBtn} 
                        onPress={() => handleOpenOptions(item)}
                    >
                        <MoreVertical size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <User size={14} color="#888" style={{marginRight: 6}} />
                        <Text style={styles.cardText}>{item.ownerName}</Text>
                    </View>
                    
                    {/* PHONE CLICKABLE AREA */}
                    <TouchableOpacity 
                        style={[styles.infoItem, styles.phoneButton]} 
                        onPress={() => handleCall(item.phone)}
                    >
                        <Phone size={14} color="#246BFD" style={{marginRight: 6}} />
                        <Text style={[styles.cardText, { color: '#246BFD', textDecorationLine: 'underline' }]}>
                            {item.phone}
                        </Text>
                    </TouchableOpacity>
                </View>

                {item.notes ? (
                    <View style={styles.noteContainer}>
                        <FileText size={14} color="#666" style={{marginRight: 6}} />
                        <Text style={styles.noteText} numberOfLines={1}>{item.notes}</Text>
                    </View>
                ) : null}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0B15" />
            
            <View style={styles.container}>
                {/* --- HEADER (Fixed Margin) --- */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Boat Management</Text>
                    <View style={{ width: 40 }} /> 
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Search size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search boats..."
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* List */}
                <FlatList
                    data={filteredBoats}
                    renderItem={renderBoatItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent} // Added padding bottom here
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#246BFD" />
                    }
                    ListHeaderComponent={
                        <TouchableOpacity style={styles.addBoatHeaderBtn} onPress={handleOpenAdd}>
                            <View style={styles.addIconBg}>
                                <Plus size={24} color="#FFF" />
                            </View>
                            <View>
                                <Text style={styles.addBoatTitle}>Register New Boat</Text>
                                <Text style={styles.addBoatSubtitle}>Tap to add details & photos</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    ListEmptyComponent={<Text style={styles.emptyText}>No boats found</Text>}
                />

                {/* Options Modal */}
                <Modal
                    visible={isOptionsVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setIsOptionsVisible(false)}
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay} 
                        activeOpacity={1} 
                        onPress={() => setIsOptionsVisible(false)}
                    >
                        <View style={styles.optionsSheet}>
                            <View style={styles.optionsHandle} />
                            <Text style={styles.optionsTitle}>Boat Options</Text>
                            
                            <TouchableOpacity style={styles.optionRow} onPress={handleEditFromOptions}>
                                <View style={[styles.optionIcon, { backgroundColor: 'rgba(36, 107, 253, 0.1)' }]}>
                                    <Edit2 size={20} color="#246BFD" />
                                </View>
                                <Text style={styles.optionText}>Edit Details</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionRow} onPress={handleToggleStatus}>
                                <View style={[styles.optionIcon, { backgroundColor: 'rgba(147, 217, 78, 0.1)' }]}>
                                    {formData.status === 'active' ? (
                                         <AlertCircle size={20} color="#FFD300" />
                                    ) : (
                                         <CheckCircle2 size={20} color="#93D94E" />
                                    )}
                                </View>
                                <Text style={styles.optionText}>
                                    {formData.status === 'active' ? 'Mark as Maintenance' : 'Mark as Active'}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.optionDivider} />

                            <TouchableOpacity style={styles.optionRow} onPress={handleDelete}>
                                <View style={[styles.optionIcon, { backgroundColor: 'rgba(255, 87, 95, 0.1)' }]}>
                                    <Trash2 size={20} color="#FF575F" />
                                </View>
                                <Text style={[styles.optionText, { color: '#FF575F' }]}>Delete Boat</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* ADD/EDIT FORM MODAL (Scrollable) */}
                <Modal
                    visible={isFormVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setIsFormVisible(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.modalOverlay}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {selectedBoatId ? 'Edit Boat' : 'Add New Boat'}
                                </Text>
                                <TouchableOpacity onPress={() => setIsFormVisible(false)}>
                                    <X size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Using pickImage here */}
                                <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
                                    {formData.image ? (
                                        <Image source={{ uri: formData.image }} style={styles.uploadedImage} />
                                    ) : (
                                        <>
                                            <View style={styles.cameraIconCircle}>
                                                <Camera size={24} color="#246BFD" />
                                            </View>
                                            <Text style={styles.uploadText}>Upload Photo</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.formContainer}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Boat Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={formData.name}
                                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                                            placeholder="e.g. Sea Queen"
                                            placeholderTextColor="#666"
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Owner Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={formData.ownerName}
                                            onChangeText={(text) => setFormData({ ...formData, ownerName: text })}
                                            placeholder="e.g. Raju"
                                            placeholderTextColor="#666"
                                        />
                                    </View>

                                    <View style={styles.rowInputs}>
                                        <View style={[styles.inputGroup, { flex: 1 }]}>
                                            <Text style={styles.label}>Phone</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={formData.phone}
                                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                                placeholder="98765..."
                                                placeholderTextColor="#666"
                                                keyboardType="phone-pad"
                                            />
                                        </View>
                                    </View>
                                    
                                     <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Notes</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={formData.notes}
                                            onChangeText={(text) => setFormData({ ...formData, notes: text })}
                                            placeholder="Extra info..."
                                            placeholderTextColor="#666"
                                            multiline
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                    <Text style={styles.saveButtonText}>
                                        {selectedBoatId ? 'Update Boat' : 'Save Boat'}
                                    </Text>
                                </TouchableOpacity>
                                <View style={{height: 20}} /> 
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#0B0B15" },
    container: { flex: 1, backgroundColor: "#0B0B15" },
    
    // HEADER FIX: Increased Padding/Margin for notch
    header: { 
        paddingHorizontal: 20, 
        paddingTop: Platform.OS === 'android' ? 40 : 20, // INCREASED TOP PADDING
        paddingBottom: 20, 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between" 
    },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: '#181822', borderWidth: 1, borderColor: '#2A2A35' },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },

    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#181822', marginHorizontal: 20, marginBottom: 20, paddingHorizontal: 15, borderRadius: 16, borderWidth: 1, borderColor: '#2A2A35', height: 50 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#FFF' },

    addBoatHeaderBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(36, 107, 253, 0.1)', borderRadius: 20, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(36, 107, 253, 0.3)', borderStyle: 'dashed' },
    addIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#246BFD', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    addBoatTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    addBoatSubtitle: { color: '#AAA', fontSize: 12, marginTop: 2 },

    // LIST FIX: Bottom Padding
    listContent: { paddingHorizontal: 20, paddingBottom: 100 }, 
    
    card: { backgroundColor: '#181822', borderRadius: 24, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A35' },
    cardImageContainer: { height: 140, width: '100%', backgroundColor: '#2A2A35' },
    cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    cardStatusBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
    statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    statusText: { fontSize: 10, fontWeight: '700' },
    
    cardContent: { padding: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    boatName: { fontSize: 18, fontWeight: '700', color: '#FFF' },
    idText: { color: '#666', fontSize: 10, marginTop: 2 },
    moreBtn: { padding: 4 },
    divider: { height: 1, backgroundColor: '#2A2A35', marginVertical: 12 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
    infoItem: { flexDirection: 'row', alignItems: 'center' },
    phoneButton: { padding: 4, backgroundColor: 'rgba(36, 107, 253, 0.1)', borderRadius: 8 }, // Highlight phone area
    cardText: { fontSize: 14, color: '#CCC', fontWeight: '500' },
    noteContainer: { marginTop: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#13131A', padding: 8, borderRadius: 8 },
    noteText: { fontSize: 12, color: '#888', flex: 1 },
    emptyText: { textAlign: 'center', color: '#666', marginTop: 40 },

    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
    optionsSheet: { backgroundColor: '#1E1E28', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    optionsHandle: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
    optionsTitle: { fontSize: 18, fontWeight: '700', color: '#FFF', marginBottom: 20, textAlign: 'center' },
    optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
    optionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    optionText: { fontSize: 16, color: '#FFF', fontWeight: '500' },
    optionDivider: { height: 1, backgroundColor: '#2A2A35', marginVertical: 8 },

    modalContent: { backgroundColor: '#181822', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
    imagePickerContainer: { height: 150, backgroundColor: '#13131A', borderRadius: 16, borderWidth: 1, borderColor: '#2A2A35', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 24, overflow: 'hidden' },
    uploadedImage: { width: '100%', height: '100%' },
    cameraIconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(36, 107, 253, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    uploadText: { color: '#246BFD', fontSize: 14, fontWeight: '600' },
    formContainer: { marginBottom: 20 },
    rowInputs: { flexDirection: 'row' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 12, color: '#AAA', marginBottom: 8, fontWeight: '600' },
    input: { backgroundColor: '#13131A', borderRadius: 12, padding: 14, fontSize: 16, color: '#FFF', borderWidth: 1, borderColor: '#2A2A35' },
    saveButton: { backgroundColor: '#246BFD', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
    saveButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});