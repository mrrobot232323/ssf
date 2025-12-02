import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
    AlertCircle,
    Camera,
    CheckCircle2,
    ChevronLeft,
    Edit2,
    FileText,
    MoreVertical,
    Phone,
    Plus,
    Search,
    Trash2,
    User,
    X,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// -----------------------------------------------------------
// TYPES
// -----------------------------------------------------------

type Boat = {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  notes: string;
  status: "active" | "maintenance";
  image: string;
};

type BoatFormData = {
  name: string;
  ownerName: string;
  phone: string;
  notes: string;
  image: string;
  status: "active" | "maintenance";
};

// -----------------------------------------------------------
// MOCK DATA + LOCAL STORE (self-contained as requested)
// -----------------------------------------------------------

const initialBoats: Boat[] = [
  {
    id: "1",
    name: "Sea Spirit",
    ownerName: "Derek Doyle",
    phone: "9876543210",
    notes: "Premium member",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Ocean King",
    ownerName: "Sarah Smith",
    phone: "1234567890",
    notes: "Engine service due",
    status: "maintenance",
    image:
      "https://images.unsplash.com/photo-1544551763-46a42a461d12?q=80&w=1000&auto=format&fit=crop",
  },
];

// -----------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------

export default function BoatsScreen() {
  const router = useRouter();

  const [boats, setBoats] = useState<Boat[]>(initialBoats);

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const [formData, setFormData] = useState<BoatFormData>({
    name: "",
    ownerName: "",
    phone: "",
    notes: "",
    image: "",
    status: "active",
  });

  // -----------------------------------------------------------
  // HELPERS
  // -----------------------------------------------------------

  const addBoat = (boat: BoatFormData) => {
    setBoats((prev) => [
      { ...boat, id: Math.random().toString(), status: "active" },
      ...prev,
    ]);
  };

  const updateBoat = (id: string, data: Partial<BoatFormData>) => {
    setBoats((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data } : b))
    );
  };

  const deleteBoat = (id: string) => {
    setBoats((prev) => prev.filter((b) => b.id !== id));
  };

  const filteredBoats = boats.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -----------------------------------------------------------
  // PICK IMAGE
  // -----------------------------------------------------------

  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  // -----------------------------------------------------------
  // PHONE CALL
  // -----------------------------------------------------------

  const handleCall = (number: string) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to place call.");
    });
  };

  // -----------------------------------------------------------
  // OPTIONS SHEET
  // -----------------------------------------------------------

  const handleOpenOptions = (boat: Boat) => {
    setSelectedBoatId(boat.id);
    setFormData({
      name: boat.name,
      ownerName: boat.ownerName,
      phone: boat.phone,
      notes: boat.notes,
      image: boat.image,
      status: boat.status,
    });
    setIsOptionsVisible(true);
  };

  const handleEditFromOptions = () => {
    setIsOptionsVisible(false);
    setTimeout(() => setIsFormVisible(true), 250);
  };

  const handleToggleStatus = () => {
    if (!selectedBoatId) return;

    updateBoat(selectedBoatId, {
      status: formData.status === "active" ? "maintenance" : "active",
    });

    setIsOptionsVisible(false);
  };

  const handleDelete = () => {
    if (!selectedBoatId) return;

    Alert.alert("Delete boat", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteBoat(selectedBoatId);
          setIsOptionsVisible(false);
        },
      },
    ]);
  };

  // -----------------------------------------------------------
  // FORM SAVE
  // -----------------------------------------------------------

  const handleSave = () => {
    if (!formData.name || !formData.ownerName) {
      Alert.alert("Missing fields", "Boat name and owner name are required.");
      return;
    }

    const payload = {
      ...formData,
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1516410290616-2e452627e774?q=80&w=1000&auto=format&fit=crop",
    };

    if (selectedBoatId) {
      updateBoat(selectedBoatId, payload);
    } else {
      addBoat(payload);
    }

    setIsFormVisible(false);
  };

  // -----------------------------------------------------------
  // REFRESH
  // -----------------------------------------------------------

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  // -----------------------------------------------------------
  // RENDER BOAT ITEM
  // -----------------------------------------------------------

  const renderItem = ({ item }: { item: Boat }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => handleOpenOptions(item)}
    >
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />

        <View
          style={[
            styles.statusBadge,
            {
              borderColor:
                item.status === "active" ? "#93D94E" : "#FFD300",
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.status === "active" ? "#93D94E" : "#FFD300",
              },
            ]}
          />
          <Text
            style={[
              styles.statusLabel,
              {
                color:
                  item.status === "active" ? "#93D94E" : "#FFD300",
              },
            ]}
          >
            {item.status === "active" ? "Active" : "Maintenance"}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.boatName}>{item.name}</Text>
            <Text style={styles.boatId}>ID: #{item.id.slice(0, 4)}</Text>
          </View>

          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => handleOpenOptions(item)}
          >
            <MoreVertical size={20} color="#777" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <User size={14} color="#888" style={{ marginRight: 6 }} />
            <Text style={styles.infoText}>{item.ownerName}</Text>
          </View>

          <TouchableOpacity
            style={styles.phoneTag}
            onPress={() => handleCall(item.phone)}
          >
            <Phone size={14} color="#246BFD" style={{ marginRight: 6 }} />
            <Text style={styles.phoneText}>{item.phone}</Text>
          </TouchableOpacity>
        </View>

        {item.notes ? (
          <View style={styles.notesRow}>
            <FileText size={14} color="#777" style={{ marginRight: 6 }} />
            <Text style={styles.notesText} numberOfLines={1}>
              {item.notes}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  // -----------------------------------------------------------
  // UI
  // -----------------------------------------------------------

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Boat Management</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Search size={20} color="#777" />
          <TextInput
            value={searchQuery}
            placeholder="Search boats..."
            placeholderTextColor="#777"
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* List */}
        <FlatList
          data={filteredBoats}
          renderItem={renderItem}
          keyExtractor={(b) => b.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#246BFD"
            />
          }
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <TouchableOpacity
              style={styles.addBoatBanner}
              onPress={() => {
                setFormData({
                  name: "",
                  ownerName: "",
                  phone: "",
                  notes: "",
                  image: "",
                  status: "active",
                });
                setSelectedBoatId(null);
                setIsFormVisible(true);
              }}
            >
              <View style={styles.addIcon}>
                <Plus size={24} color="#FFF" />
              </View>

              <View>
                <Text style={styles.addBoatTitle}>Register New Boat</Text>
                <Text style={styles.addBoatSubtitle}>
                  Tap to add details & photos
                </Text>
              </View>
            </TouchableOpacity>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No boats found</Text>
          }
        />

        {/* ------------------------------------------------------- */}
        {/* Options Sheet */}
        {/* ------------------------------------------------------- */}

        <Modal
          visible={isOptionsVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setIsOptionsVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsOptionsVisible(false)}
          >
            <View style={styles.optionsSheet}>
              <View style={styles.dragHandle} />

              <Text style={styles.optionsTitle}>Boat Options</Text>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={handleEditFromOptions}
              >
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: "rgba(36,107,253,0.1)" },
                  ]}
                >
                  <Edit2 size={20} color="#246BFD" />
                </View>
                <Text style={styles.optionText}>Edit Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={handleToggleStatus}
              >
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: "rgba(147,217,78,0.1)" },
                  ]}
                >
                  {formData.status === "active" ? (
                    <AlertCircle size={20} color="#FFD300" />
                  ) : (
                    <CheckCircle2 size={20} color="#93D94E" />
                  )}
                </View>
                <Text style={styles.optionText}>
                  {formData.status === "active"
                    ? "Mark as Maintenance"
                    : "Mark as Active"}
                </Text>
              </TouchableOpacity>

              <View style={styles.optionsDivider} />

              <TouchableOpacity
                style={styles.optionRow}
                onPress={handleDelete}
              >
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: "rgba(255,87,95,0.1)" },
                  ]}
                >
                  <Trash2 size={20} color="#FF575F" />
                </View>
                <Text style={[styles.optionText, { color: "#FF575F" }]}>
                  Delete Boat
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ------------------------------------------------------- */}
        {/* Add/Edit Form */}
        {/* ------------------------------------------------------- */}

        <Modal
          visible={isFormVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsFormVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.formOverlay}
          >
            <View style={styles.formSheet}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>
                  {selectedBoatId ? "Edit Boat" : "Add New Boat"}
                </Text>
                <TouchableOpacity onPress={() => setIsFormVisible(false)}>
                  <X size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={pickImage}
                >
                  {formData.image ? (
                    <Image
                      source={{ uri: formData.image }}
                      style={styles.uploadedImage}
                    />
                  ) : (
                    <>
                      <View style={styles.cameraCircle}>
                        <Camera size={24} color="#246BFD" />
                      </View>
                      <Text style={styles.uploadText}>Upload Photo</Text>
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.formBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Boat Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Sea Queen"
                      placeholderTextColor="#666"
                      value={formData.name}
                      onChangeText={(t) =>
                        setFormData({ ...formData, name: t })
                      }
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Owner Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Raju"
                      placeholderTextColor="#666"
                      value={formData.ownerName}
                      onChangeText={(t) =>
                        setFormData({ ...formData, ownerName: t })
                      }
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="phone-pad"
                      placeholder="98765..."
                      placeholderTextColor="#666"
                      value={formData.phone}
                      onChangeText={(t) =>
                        setFormData({ ...formData, phone: t })
                      }
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Extra info..."
                      placeholderTextColor="#666"
                      value={formData.notes}
                      multiline
                      onChangeText={(t) =>
                        setFormData({ ...formData, notes: t })
                      }
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSave}
                >
                  <Text style={styles.saveBtnText}>
                    {selectedBoatId ? "Update Boat" : "Save Boat"}
                  </Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// -----------------------------------------------------------
// STYLES
// -----------------------------------------------------------

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B15" },
  screen: { flex: 1, backgroundColor: "#0B0B15" },

  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#181822",
    borderColor: "#2A2A35",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    color: "#FFF",
    fontFamily: "UberMove-Bold",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#181822",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },

  searchInput: {
    flex: 1,
    color: "#FFF",
    fontFamily: "UberMoveText-Regular",
    fontSize: 15,
    marginLeft: 10,
  },

  listContent: { paddingHorizontal: 20, paddingBottom: 120 },

  // Add New Boat Banner
  addBoatBanner: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: "rgba(36,107,253,0.1)",
    borderWidth: 1,
    borderColor: "rgba(36,107,253,0.3)",
    borderStyle: "dashed",
    alignItems: "center",
  },

  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#246BFD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  addBoatTitle: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "UberMoveText-Medium",
  },

  addBoatSubtitle: {
    color: "#AAA",
    fontSize: 12,
    fontFamily: "UberMoveText-Regular",
    marginTop: 2,
  },

  // Card
  card: {
    borderRadius: 24,
    backgroundColor: "#181822",
    borderWidth: 1,
    borderColor: "#2A2A35",
    overflow: "hidden",
    marginBottom: 20,
  },

  cardImageWrap: {
    width: "100%",
    height: 140,
    backgroundColor: "#2A2A35",
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  statusLabel: {
    fontSize: 10,
    fontFamily: "UberMoveText-Medium",
  },

  cardBody: { padding: 16 },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  boatName: {
    fontSize: 18,
    color: "#FFF",
    fontFamily: "UberMove-Bold",
  },

  boatId: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
    fontFamily: "UberMoveText-Regular",
  },

  moreBtn: { padding: 4 },

  divider: {
    height: 1,
    backgroundColor: "#2A2A35",
    marginVertical: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoItem: { flexDirection: "row", alignItems: "center" },

  infoText: {
    color: "#CCC",
    fontSize: 14,
    fontFamily: "UberMoveText-Regular",
  },

  phoneTag: {
    flexDirection: "row",
    backgroundColor: "rgba(36,107,253,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: "center",
  },

  phoneText: {
    color: "#246BFD",
    fontSize: 13,
    fontFamily: "UberMoveText-Medium",
    textDecorationLine: "underline",
  },

  notesRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#13131A",
    padding: 8,
    borderRadius: 8,
  },

  notesText: {
    fontSize: 12,
    color: "#999",
    fontFamily: "UberMoveText-Regular",
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 40,
    fontFamily: "UberMoveText-Regular",
  },

  // Options Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },

  optionsSheet: {
    backgroundColor: "#1E1E28",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },

  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },

  optionsTitle: {
    fontSize: 18,
    color: "#FFF",
    fontFamily: "UberMove-Bold",
    textAlign: "center",
    marginBottom: 24,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },

  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  optionText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "UberMoveText-Medium",
  },

  optionsDivider: {
    height: 1,
    backgroundColor: "#2A2A35",
    marginVertical: 12,
  },

  // Form Sheet
  formOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  formSheet: {
    backgroundColor: "#181822",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "90%",
  },

  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  formTitle: {
    fontSize: 20,
    color: "#FFF",
    fontFamily: "UberMove-Bold",
  },

  imagePicker: {
    height: 150,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
    borderStyle: "dashed",
    backgroundColor: "#13131A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },

  cameraCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(36,107,253,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  uploadedImage: {
    width: "100%",
    height: "100%",
  },

  uploadText: {
    color: "#246BFD",
    fontSize: 14,
    fontFamily: "UberMoveText-Medium",
  },

  formBody: {
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    color: "#AAA",
    fontSize: 12,
    marginBottom: 6,
    fontFamily: "UberMoveText-Medium",
  },

  input: {
    backgroundColor: "#13131A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A35",
    padding: 14,
    fontSize: 15,
    color: "#FFF",
    fontFamily: "UberMoveText-Regular",
  },

  saveBtn: {
    backgroundColor: "#246BFD",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },

  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "UberMove-Bold",
  },
});
