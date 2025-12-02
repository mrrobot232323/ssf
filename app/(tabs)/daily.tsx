import React, { useState, useMemo } from "react";
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Share2,
  Calendar,
  ChevronRight,
  TrendingUp,
  DollarSign,
  PieChart,
  Anchor,
} from "lucide-react-native";

/* ───────────────────────────────────────────
   MOCK DATA (Replace with your real data later)
──────────────────────────────────────────── */
const useApp = () => {
  const [lots] = useState([
    {
      id: "1",
      boatId: "1",
      boatName: "Sea Spirit",
      species: "Prawns",
      weight: 50,
      pricePerUnit: 400,
      totalAmount: 20000,
      commissionAmount: 1000,
      payableAmount: 19000,
      timestamp: new Date().setHours(8, 0, 0, 0),
    },
    {
      id: "2",
      boatId: "2",
      boatName: "Ocean King",
      species: "Mackerel",
      weight: 120,
      pricePerUnit: 150,
      totalAmount: 18000,
      commissionAmount: 900,
      payableAmount: 17100,
      timestamp: new Date().setHours(9, 30, 0, 0),
    },
    {
      id: "3",
      boatId: "1",
      boatName: "Sea Spirit",
      species: "Tuna",
      weight: 30,
      pricePerUnit: 800,
      totalAmount: 24000,
      commissionAmount: 1200,
      payableAmount: 22800,
      timestamp: new Date().setHours(10, 15, 0, 0),
    },
  ]);

  return { lots };
};

export default function DailyScreen() {
  const router = useRouter();
  const { lots } = useApp();

  const [selectedDate, setSelectedDate] = useState(new Date());

  /* ─────────── DAILY DATA CALCULATION ─────────── */
  const dailyStats = useMemo(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const daysLots = lots.filter(
      (lot) => lot.timestamp >= start.getTime() && lot.timestamp <= end.getTime()
    );

    const revenue = daysLots.reduce((s, l) => s + l.totalAmount, 0);
    const commission = daysLots.reduce((s, l) => s + l.commissionAmount, 0);
    const payable = daysLots.reduce((s, l) => s + l.payableAmount, 0);

    /* Species Grouping */
    const speciesMap: Record<
      string,
      { weight: number; amount: number; count: number }
    > = {};

    daysLots.forEach((lot) => {
      if (!speciesMap[lot.species]) {
        speciesMap[lot.species] = { weight: 0, amount: 0, count: 0 };
      }
      speciesMap[lot.species].weight += lot.weight;
      speciesMap[lot.species].amount += lot.totalAmount;
      speciesMap[lot.species].count += 1;
    });

    const speciesList = Object.entries(speciesMap)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.weight - a.weight);

    const maxWeight = speciesList[0]?.weight || 1;

    return {
      daysLots,
      revenue,
      commission,
      payable,
      speciesList,
      maxWeight,
    };
  }, [selectedDate, lots]);

  /* ─────────── SHARE REPORT ─────────── */
  const handleShare = async () => {
    const message = `
📊 *AquaLedger — Daily Summary*
📅 ${selectedDate.toDateString()}

💰 Gross Revenue: ₹${dailyStats.revenue.toLocaleString()}
🏷 Commission: ₹${dailyStats.commission.toLocaleString()}
✔ Net Payable: ₹${dailyStats.payable.toLocaleString()}

🐟 Catch:
${dailyStats.speciesList
  .map((s) => `• ${s.name}: ${s.weight}kg (₹${s.amount})`)
  .join("\n")}

🔹 Total Lots Today: ${dailyStats.daysLots.length}
`.trim();

    try {
      await Share.share({ message });
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
    }
  };

  /* ─────────── DATE CHANGE ─────────── */
  const changeDate = (value: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + value);
    setSelectedDate(newDate);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.screen}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Daily Summary</Text>

          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Share2 size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* DATE SELECTOR */}
          <View style={styles.dateCard}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => changeDate(-1)}
            >
              <ChevronLeft size={20} color="#777" />
            </TouchableOpacity>

            <View style={styles.dateBlock}>
              <Calendar size={16} color="#246BFD" />
              <Text style={styles.dateText}>
                {selectedDate.toDateString() === new Date().toDateString()
                  ? `Today – ${selectedDate.toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}`
                  : selectedDate.toDateString()}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => changeDate(1)}
            >
              <ChevronRight size={20} color="#777" />
            </TouchableOpacity>
          </View>

          {/* FINANCIAL GRID */}
          <View style={styles.grid}>
            {/* Revenue */}
            <View style={styles.statCard}>
              <View style={[styles.iconCircle, styles.blueBg]}>
                <TrendingUp size={18} color="#246BFD" />
              </View>
              <Text style={styles.statLabel}>Revenue</Text>
              <Text style={styles.statValue}>
                ₹{(dailyStats.revenue / 1000).toFixed(1)}k
              </Text>
            </View>

            {/* Commission */}
            <View style={styles.statCard}>
              <View style={[styles.iconCircle, styles.redBg]}>
                <PieChart size={18} color="#FF575F" />
              </View>
              <Text style={styles.statLabel}>Commission</Text>
              <Text style={[styles.statValue, { color: "#FF575F" }]}>
                ₹{(dailyStats.commission / 1000).toFixed(1)}k
              </Text>
            </View>

            {/* Net */}
            <View style={styles.statCard}>
              <View style={[styles.iconCircle, styles.greenBg]}>
                <DollarSign size={18} color="#93D94E" />
              </View>
              <Text style={styles.statLabel}>Net Pay</Text>
              <Text style={[styles.statValue, { color: "#93D94E" }]}>
                ₹{(dailyStats.payable / 1000).toFixed(1)}k
              </Text>
            </View>
          </View>

          {/* SPECIES BREAKDOWN */}
          <Text style={styles.sectionTitle}>Catch Breakdown</Text>

          <View style={styles.sectionCard}>
            {dailyStats.speciesList.length === 0 ? (
              <Text style={styles.empty}>No catch today.</Text>
            ) : (
              dailyStats.speciesList.map((item) => (
                <View key={item.name} style={styles.speciesRow}>
                  <View style={styles.speciesHeader}>
                    <Text style={styles.speciesName}>{item.name}</Text>
                    <Text style={styles.speciesAmount}>
                      ₹{item.amount.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${
                            (item.weight / dailyStats.maxWeight) * 100
                          }%`,
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.speciesMeta}>
                    {item.weight} kg • {item.count} lots
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* TRANSACTION LIST */}
          <Text style={styles.sectionTitle}>Transactions</Text>

          {dailyStats.daysLots.length === 0 ? (
            <Text style={styles.empty}>No transactions today.</Text>
          ) : (
            dailyStats.daysLots.map((lot) => (
              <View key={lot.id} style={styles.transCard}>
                <View style={styles.transLeft}>
                  <View style={styles.anchorIcon}>
                    <Anchor size={15} color="#AAA" />
                  </View>

                  <View>
                    <Text style={styles.transBoat}>{lot.boatName}</Text>

                    <Text style={styles.transInfo}>
                      {new Date(lot.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" • "}
                      {lot.species}
                    </Text>
                  </View>
                </View>

                <View style={styles.transRight}>
                  <Text style={styles.transAmount}>
                    ₹{lot.totalAmount.toLocaleString()}
                  </Text>
                  <Text style={styles.transWeight}>{lot.weight} kg</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ───────────────────────────────────────────
   STYLES — Premium Uber Typography
──────────────────────────────────────────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B15" },
  screen: { flex: 1, backgroundColor: "#0B0B15" },

  /* HEADER */
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181822",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },

  headerTitle: {
    fontFamily: "UberMove-Bold",
    fontSize: 20,
    color: "#FFF",
  },

  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#246BFD",
  },

  content: { padding: 20, paddingBottom: 120 },

  /* DATE CARD */
  dateCard: {
    backgroundColor: "#181822",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#2A2A35",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  navBtn: { padding: 10 },

  dateBlock: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },

  dateText: {
    color: "#FFF",
    fontFamily: "UberMoveText-Medium",
    fontSize: 16,
  },

  /* FINANCIAL GRID */
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#181822",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#2A2A35",
    alignItems: "center",
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  blueBg: { backgroundColor: "rgba(36,107,253,0.18)" },
  redBg: { backgroundColor: "rgba(255,87,95,0.18)" },
  greenBg: { backgroundColor: "rgba(147,217,78,0.18)" },

  statLabel: {
    color: "#AAA",
    fontFamily: "UberMoveText-Regular",
    fontSize: 13,
    marginBottom: 4,
  },

  statValue: {
    color: "#FFF",
    fontFamily: "UberMove-Bold",
    fontSize: 18,
  },

  /* SECTION TITLE */
  sectionTitle: {
    fontFamily: "UberMove-Bold",
    fontSize: 20,
    color: "#FFF",
    marginBottom: 16,
    marginTop: 10,
  },

  /* SECTION CARD */
  sectionCard: {
    backgroundColor: "#181822",
    borderRadius: 20,
    padding: 20,
    borderColor: "#2A2A35",
    borderWidth: 1,
    marginBottom: 32,
  },

  empty: {
    color: "#777",
    fontFamily: "UberMoveText-Regular",
    textAlign: "center",
    paddingVertical: 16,
  },

  /* SPECIES BREAKDOWN */
  speciesRow: { marginBottom: 20 },

  speciesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  speciesName: {
    color: "#FFF",
    fontFamily: "UberMoveText-Medium",
    fontSize: 15,
  },

  speciesAmount: {
    color: "#AAA",
    fontFamily: "UberMoveText-Regular",
    fontSize: 14,
  },

  progressTrack: {
    height: 6,
    backgroundColor: "#2A2A35",
    borderRadius: 4,
    marginBottom: 6,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#246BFD",
    borderRadius: 4,
  },

  speciesMeta: {
    color: "#777",
    fontFamily: "UberMoveText-Regular",
    fontSize: 12,
  },

  /* TRANSACTION BLOCK */
  transCard: {
    backgroundColor: "#181822",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  transLeft: { flexDirection: "row", gap: 12 },

  anchorIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#2A2A35",
    justifyContent: "center",
    alignItems: "center",
  },

  transBoat: {
    color: "#FFF",
    fontFamily: "UberMoveText-Medium",
    fontSize: 15,
  },

  transInfo: {
    color: "#777",
    fontFamily: "UberMoveText-Regular",
    fontSize: 12,
  },

  transRight: { alignItems: "flex-end" },

  transAmount: {
    color: "#93D94E",
    fontFamily: "UberMoveText-Medium",
    fontSize: 15,
  },

  transWeight: {
    color: "#AAA",
    fontFamily: "UberMoveText-Regular",
    fontSize: 12,
  },
});
