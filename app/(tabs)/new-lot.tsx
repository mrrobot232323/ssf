import React, { useState } from "react";
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
  Image,
} from "react-native";
import { useRouter } from "expo-router";
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
  Plus,
} from "lucide-react-native";

/* ───────────────────────────────────────────────
   MOCK BOATS (MVP LOCAL DATA)
─────────────────────────────────────────────── */
const useApp = () => {
  const [boats] = useState([
    {
      id: "1",
      name: "Sea Spirit",
      ownerName: "Derek Doyle",
      image:
        "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1000",
    },
    {
      id: "2",
      name: "Ocean King",
      ownerName: "Sarah Smith",
      image:
        "https://images.unsplash.com/photo-1544551763-46a42a461d12?q=80&w=1000",
    },
    {
      id: "3",
      name: "Blue Horizon",
      ownerName: "Mike Ross",
      image:
        "https://images.unsplash.com/photo-1516410290616-2e452627e774?q=80&w=1000",
    },
  ]);

  const addLot = (data: any) => console.log("Lot Added:", data);
  return { boats, addLot };
};

/* ───────────────────────────────────────────────
   Common Species
─────────────────────────────────────────────── */
const POPULAR_SPECIES = [
  "Prawns (Tiger)",
  "Prawns (White)",
  "Mackerel",
  "Tuna",
  "Sardine",
  "Squid",
  "Crab",
  "King Fish",
];

export default function NewLotScreen() {
  const router = useRouter();
  const { boats, addLot } = useApp();

  /* Form State */
  const [selectedBoat, setSelectedBoat] = useState<any | null>(null);
  const [species, setSpecies] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [commissionRate, setCommissionRate] = useState("5");

  /* Modal State */
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBoats = boats.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* Calculations */
  const total = (parseFloat(weight) || 0) * (parseFloat(price) || 0);
  const commission = (total * (parseFloat(commissionRate) || 0)) / 100;

  /* Submit Handler */
  const handleSave = (addAnother: boolean) => {
    if (!selectedBoat || !species || !weight || !price) {
      Alert.alert("Missing Fields", "Please fill in all required details.");
      return;
    }

    addLot({
      boatId: selectedBoat.id,
      species,
      weight,
      price,
      commissionRate,
      total,
      commission,
      payable: total - commission,
      date: new Date().toISOString(),
    });

    Alert.alert("Success", "Lot added!");

    if (addAnother) {
      setSpecies("");
      setWeight("");
      setPrice("");
      return;
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
        {/* ───────────────── HEADER ───────────────── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>New Lot Entry</Text>

          <View style={{ width: 32 }} />
        </View>

        {/* ───────────────── FORM CONTENT ───────────────── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* BOAT DETAILS */}
          <Text style={styles.sectionHeading}>BOAT DETAILS</Text>

          {/* Selected Boat */}
          {selectedBoat ? (
            <View style={styles.selectedBoatCard}>
              <Image
                source={{ uri: selectedBoat.image }}
                style={styles.selectedBoatImg}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.boatName}>{selectedBoat.name}</Text>
                <Text style={styles.boatOwner}>{selectedBoat.ownerName}</Text>
              </View>

              <TouchableOpacity
                style={styles.changeBtn}
                onPress={() => setSelectedBoat(null)}
              >
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectBoatBtn}
              onPress={() => setIsSearchVisible(true)}
            >
              <View style={styles.iconCircle}>
                <Ship size={18} color="#246BFD" />
              </View>
              <Text style={styles.selectBoatText}>Select a Boat</Text>
              <ChevronLeft
                size={18}
                color="#777"
                style={{ transform: [{ rotate: "-90deg" }] }}
              />
            </TouchableOpacity>
          )}

          {/* CATCH DETAILS */}
          <Text style={[styles.sectionHeading, { marginTop: 30 }]}>
            CATCH DETAILS
          </Text>

          {/* Species Input */}
          <View style={styles.inputWrap}>
            <Fish size={18} color="#777" style={styles.inputIcon} />
            <TextInput
              placeholder="Species Name"
              placeholderTextColor="#777"
              value={species}
              onChangeText={setSpecies}
              style={styles.input}
            />
          </View>

          {/* Popular Species Quick Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 12 }}
          >
            {POPULAR_SPECIES.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setSpecies(item)}
                style={[
                  styles.chip,
                  species === item && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    species === item && styles.chipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Weight + Price */}
          <View style={styles.row}>
            <View style={[styles.inputWrap, { flex: 1, marginRight: 10 }]}>
              <Scale size={18} color="#777" style={styles.inputIcon} />
              <TextInput
                placeholder="Weight (kg)"
                placeholderTextColor="#777"
                style={styles.input}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <View style={[styles.inputWrap, { flex: 1 }]}>
              <DollarSign size={18} color="#777" style={styles.inputIcon} />
              <TextInput
                placeholder="Price / kg"
                placeholderTextColor="#777"
                style={styles.input}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          {/* Commission */}
          <View style={styles.inputWrap}>
            <Percent size={18} color="#777" style={styles.inputIcon} />
            <TextInput
              placeholder="Commission %"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={commissionRate}
              onChangeText={setCommissionRate}
              style={styles.input}
            />
          </View>

          {/* Receipt */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Total Gross</Text>
              <Text style={styles.receiptValue}>₹{total}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>
                Commission ({commissionRate}%)
              </Text>
              <Text style={[styles.receiptValue, { color: "#FF575F" }]}>
                -₹{commission}
              </Text>
            </View>

            <View style={styles.dashDivider} />

            <View style={styles.receiptRow}>
              <Text style={styles.totalLabel}>Net Payable</Text>
              <Text style={styles.totalValue}>₹{total - commission}</Text>
            </View>
          </View>
        </ScrollView>

        {/* FOOTER BUTTONS */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => handleSave(true)}
          >
            <Text style={styles.secondaryText}>Save & Add New</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => handleSave(false)}
          >
            <Text style={styles.primaryText}>Complete Lot</Text>
          </TouchableOpacity>
        </View>

        {/* ───────────────── BOAT SEARCH MODAL ───────────────── */}
        <Modal visible={isSearchVisible} animationType="slide" transparent>
          <View style={styles.modalBg}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setIsSearchVisible(false)}>
                  <X size={26} color="#FFF" />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Select Boat</Text>

                <View style={{ width: 26 }} />
              </View>

              {/* Search Bar */}
              <View style={styles.modalSearchWrap}>
                <Search size={18} color="#666" />
                <TextInput
                  placeholder="Search boat..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.modalSearchInput}
                  autoFocus
                />
              </View>

              {/* Boats List */}
              <FlatList
                data={filteredBoats}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 18 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedBoat(item);
                      setIsSearchVisible(false);
                    }}
                    style={styles.modalItem}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.modalItemImg}
                    />

                    <View>
                      <Text style={styles.modalItemName}>{item.name}</Text>
                      <Text style={styles.modalItemOwner}>
                        {item.ownerName}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }} />
                    <CheckCircle2 size={20} color="#2A2A35" />
                  </TouchableOpacity>
                )}
              />
            </SafeAreaView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ───────────────────────────────────────────
   STYLES — UberMove Fonts + AquaLedger UI
─────────────────────────────────────────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B15" },
  screen: { flex: 1, backgroundColor: "#0B0B15" },

  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    color: "#FFF",
    fontSize: 20,
    fontFamily: "UberMove-Bold",
  },

  content: { padding: 22, paddingBottom: 120 },

  /* Sections */
  sectionHeading: {
    fontSize: 13,
    letterSpacing: 1,
    color: "#777",
    fontFamily: "UberMoveText-Medium",
  },

  /* Boat selection */
  selectBoatBtn: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#181822",
    borderRadius: 16,
    borderColor: "#2A2A35",
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 10,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(36,107,253,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  selectBoatText: {
    flex: 1,
    color: "#AAA",
    fontFamily: "UberMoveText-Regular",
    fontSize: 16,
  },

  selectedBoatCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#181822",
    borderWidth: 1,
    borderColor: "#246BFD",
    marginBottom: 10,
  },

  selectedBoatImg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 14,
  },

  boatName: {
    color: "#FFF",
    fontSize: 17,
    fontFamily: "UberMoveText-Medium",
  },

  boatOwner: {
    color: "#AAA",
    marginTop: 2,
    fontSize: 13,
    fontFamily: "UberMoveText-Regular",
  },

  changeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#2A2A35",
    borderRadius: 8,
  },

  changeText: {
    color: "#FFF",
    fontFamily: "UberMoveText-Medium",
    fontSize: 12,
  },

  /* Inputs */
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#13131A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A2A35",
    marginBottom: 16,
  },

  inputIcon: { marginRight: 12 },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFF",
    fontFamily: "UberMoveText-Regular",
  },

  /* Chips */
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#181822",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
    marginRight: 8,
  },

  chipActive: { backgroundColor: "#246BFD", borderColor: "#246BFD" },

  chipText: {
    color: "#AAA",
    fontSize: 12,
    fontFamily: "UberMoveText-Medium",
  },

  chipTextActive: {
    color: "#FFF",
    fontFamily: "UberMoveText-Medium",
  },

  row: { flexDirection: "row" },

  /* Receipt */
  receiptCard: {
    backgroundColor: "#181822",
    padding: 18,
    borderRadius: 20,
    borderColor: "#2A2A35",
    borderWidth: 1,
    marginTop: 10,
  },

  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  receiptLabel: {
    fontSize: 14,
    color: "#AAA",
    fontFamily: "UberMoveText-Regular",
  },

  receiptValue: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "UberMoveText-Medium",
  },

  dashDivider: {
    width: "100%",
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#2A2A35",
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 15,
    color: "#93D94E",
    fontFamily: "UberMoveText-Medium",
  },

  totalValue: {
    fontSize: 26,
    color: "#93D94E",
    fontFamily: "UberMove-Bold",
  },

  /* Footer */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 18,
    backgroundColor: "#0B0B15",
    borderTopColor: "#2A2A35",
    borderTopWidth: 1,
  },

  secondaryBtn: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#181822",
    borderColor: "#2A2A35",
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 54,
  },

  secondaryText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "UberMoveText-Medium",
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: "#246BFD",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 54,
  },

  primaryText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "UberMove-Bold",
  },

  /* Modal */
  modalBg: {
    flex: 1,
    backgroundColor: "#0B0B15",
  },

  modalHeader: {
    padding: 20,
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "UberMove-Bold",
  },

  modalSearchWrap: {
    height: 50,
    backgroundColor: "#181822",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderColor: "#2A2A35",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  modalSearchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#FFF",
    fontFamily: "UberMoveText-Regular",
  },

  modalItem: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#181822",
    marginBottom: 14,
    borderColor: "#2A2A35",
    borderWidth: 1,
    alignItems: "center",
  },

  modalItemImg: {
    width: 42,
    height: 42,
    borderRadius: 10,
    marginRight: 12,
  },

  modalItemName: {
    fontSize: 16,
    color: "#FFF",
    fontFamily: "UberMoveText-Medium",
  },

  modalItemOwner: {
    fontSize: 12,
    color: "#AAA",
    fontFamily: "UberMoveText-Regular",
  },
});
