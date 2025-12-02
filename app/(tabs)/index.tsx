import { useRouter } from "expo-router";
import {
  Activity,
  Anchor,
  ArrowUpRight,
  BarChart2,
  Calendar,
  DollarSign,
  MessageCircle,
  PieChart,
  Plus,
  Ship,
  TrendingUp,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const dp = require("../../assets/images/dp.png");

const { width } = Dimensions.get("window");

// --- MOCK DATA ---
const MOCK_BOATS = [
  { id: "1", name: "Sea Spirit" },
  { id: "2", name: "Ocean King" },
  { id: "3", name: "Blue Horizon" },
  { id: "4", name: "Wave Rider" },
  { id: "5", name: "Tide Hunter" },
];

const MOCK_LOTS = [
  { id: "101", totalAmount: 50000, commissionAmount: 5000, payableAmount: 45000, timestamp: Date.now() },
  { id: "102", totalAmount: 23000, commissionAmount: 2300, payableAmount: 20700, timestamp: Date.now() },
  { id: "103", totalAmount: 15000, commissionAmount: 1500, payableAmount: 13500, timestamp: Date.now() - 86400000 },
  { id: "104", totalAmount: 80000, commissionAmount: 8000, payableAmount: 72000, timestamp: Date.now() - 432000000 },
  { id: "105", totalAmount: 120000, commissionAmount: 12000, payableAmount: 108000, timestamp: Date.now() - 1728000000 },
];

export default function HomeScreen() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<"Today" | "Week" | "Month">("Today");

  const handleNav = (route: string) => {
    try {
      router.push(route as any);
    } catch (e) {
      console.log("Navigation Error:", e);
    }
  };

  // --- DYNAMIC FINANCIAL CALCULATIONS ---
  const financials = useMemo(() => {
    const now = new Date();
    const startOfPeriod = new Date();
    startOfPeriod.setHours(0, 0, 0, 0);

    if (timeRange === "Week") startOfPeriod.setDate(now.getDate() - 7);
    if (timeRange === "Month") startOfPeriod.setDate(now.getDate() - 30);

    const filteredLots = MOCK_LOTS.filter((lot) => lot.timestamp >= startOfPeriod.getTime());
    const revenue = filteredLots.reduce((sum, item) => sum + item.totalAmount, 0);
    const payable = filteredLots.reduce((sum, item) => sum + item.payableAmount, 0);
    const profit = filteredLots.reduce((sum, item) => sum + item.commissionAmount, 0);

    return { revenue, payable, profit, count: filteredLots.length };
  }, [timeRange]);

  const targetMap = { Today: 100000, Week: 700000, Month: 3000000 };
  const currentTarget = targetMap[timeRange];
  const progress = Math.min((financials.revenue / currentTarget) * 100, 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B15" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            {/* Brand pill with avatar (left) + Aqualedger (right) */}
            <View style={styles.brandPill}>
              <View style={styles.brandAvatarWrapper}>
                <Image source={dp} style={styles.brandAvatar} />
              </View>
              <Text style={styles.brandTitle}>Aqualedger</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationBtn}>
                <MessageCircle size={26} color="#FFF" strokeWidth={1.5} />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>2</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.profileBtn} onPress={() => handleNav("/profile")}>
                <Image
                  source={{ uri: "https://cdn.dribbble.com/userupload/41849246/file/original-942c6a9ffac280bfc04190f0a60f3771.png" }}
                  style={styles.profileImg}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.greetingContainer}>
            <Text style={styles.greetingTextBig}>Hello,</Text>
            <Text style={styles.greetingTextName}>Derek Doyle 👋</Text>
          </View>
        </View>

        {/* OVERVIEW */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>

          <View style={styles.filterContainer}>
            {(["Today", "Week", "Month"] as const).map((range) => (
              <TouchableOpacity
                key={range}
                onPress={() => setTimeRange(range)}
                style={[
                  styles.filterPill,
                  timeRange === range && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    timeRange === range && styles.filterTextActive,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SCROLL CARDS */}
        <ScrollView
          horizontal
          style={styles.cardScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardScrollContent}
        >
          {/* Revenue */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>{timeRange.toUpperCase()} REVENUE</Text>
              <View style={[styles.iconCircle, { backgroundColor: "rgba(36,107,253,0.15)" }]}>
                <Activity size={20} color="#246BFD" />
              </View>
            </View>
            <Text style={styles.cardAmount}>₹{financials.revenue.toLocaleString()}</Text>
            <View style={styles.trendContainer}>
              <ArrowUpRight size={16} color="#93D94E" />
              <Text style={styles.trendText}>+12% vs last {timeRange.toLowerCase()}</Text>
            </View>
          </View>

          {/* Commission */}
          <View style={[styles.card, { borderColor: "rgba(147,217,78,0.3)" }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>NET COMMISSION</Text>
              <View style={[styles.iconCircle, { backgroundColor: "rgba(147,217,78,0.15)" }]}>
                <TrendingUp size={20} color="#93D94E" />
              </View>
            </View>
            <Text style={[styles.cardAmount, { color: "#93D94E" }]}>
              ₹{financials.profit.toLocaleString()}
            </Text>
            <Text style={styles.trendLabel}>Pure profit margin</Text>
          </View>

          {/* Payable */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>PAYABLE</Text>
              <View style={[styles.iconCircle, { backgroundColor: "rgba(255,87,95,0.15)" }]}>
                <DollarSign size={20} color="#FF575F" />
              </View>
            </View>
            <Text style={styles.cardAmount}>₹{financials.payable.toLocaleString()}</Text>
            <Text style={styles.trendLabel}>{financials.count} lots processed</Text>
          </View>
        </ScrollView>

        {/* GOAL PROGRESS */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>{timeRange} Goal</Text>
              <Text style={styles.progressSubtitle}>
                Target: ₹{(currentTarget / 1000).toFixed(0)}k
              </Text>
            </View>

            <View style={styles.percentPill}>
              <Text style={styles.percentText}>{Math.round(progress)}%</Text>
            </View>
          </View>

          <View style={styles.track}>
            <View style={[styles.bar, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* BOATS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleNoMargin}>Active Boats</Text>
          <TouchableOpacity onPress={() => handleNav("/boats")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boatRow}>
          <TouchableOpacity style={styles.addBoatBtn} onPress={() => handleNav("/boats")}>
            <Plus size={24} color="#666" />
          </TouchableOpacity>

          {MOCK_BOATS.map((boat, idx) => (
            <View key={boat.id} style={styles.boatItem}>
              <TouchableOpacity style={styles.boatIconBtn} onPress={() => handleNav("/boats")}>
                <Ship size={24} color="#FFF" />
                <View style={[styles.statusDot, { backgroundColor: idx % 2 ? "#666" : "#93D94E" }]} />
              </TouchableOpacity>
              <Text style={styles.boatName}>{boat.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* QUICK ACTIONS */}
        <Text
          style={[
            styles.sectionTitleNoMargin,
            { marginTop: 28, marginBottom: 16, paddingHorizontal: 24 },
          ]}
        >
          Quick Actions
        </Text>

        <View style={styles.gridContainer}>
          <View style={styles.gridRowTop}>
            <TouchableOpacity style={styles.largeGridCard} onPress={() => handleNav("/explore")}>
              <View style={styles.largeCardIconBg}>
                <PieChart size={32} color="#8E55EA" />
              </View>
              <View>
                <Text style={styles.gridValue}>{MOCK_LOTS.length}</Text>
                <Text style={styles.gridLabel}>ALL LOTS</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediumGridCard} onPress={() => handleNav("/daily")}>
              <View style={[styles.iconCircleSmall, { backgroundColor: "rgba(36,107,253,0.15)" }]}>
                <BarChart2 size={24} color="#246BFD" />
              </View>
              <Text style={styles.mediumCardTitle}>Daily</Text>
              <Text style={styles.mediumCardSub}>Report</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gridRowBottom}>
            <TouchableOpacity style={styles.smallCard} onPress={() => handleNav("/new-lot")}>
              <View style={[styles.iconCircleSmall, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
                <Plus size={20} color="#FFF" />
              </View>
              <Text style={styles.smallCardText}>New Lot</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallCard} onPress={() => handleNav("/boats")}>
              <View style={[styles.iconCircleSmall, { backgroundColor: "rgba(142,85,234,0.15)" }]}>
                <Anchor size={20} color="#8E55EA" />
              </View>
              <Text style={styles.smallCardText}>Boats</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallCard} onPress={() => handleNav("/weekly")}>
              <View style={[styles.iconCircleSmall, { backgroundColor: "rgba(147,217,78,0.15)" }]}>
                <Calendar size={20} color="#93D94E" />
              </View>
              <Text style={styles.smallCardText}>Weekly</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// -----------------------------------------------------------------------------
// UPDATED STYLES WITH UBERMOVE FONTS
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0B0B15" },
  container: { flex: 1 },

  // HEADER
  headerContainer: {
    paddingRight: 70,
    paddingLeft: 0,
    paddingTop: Platform.OS === "web" ? 40 : 20,
    paddingBottom: 10,
    marginTop: Platform.OS === "web" ? 20 : 0,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  // Brand pill
  brandPill: {
    flex: 1,
    marginLeft: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#181822",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },

  brandTitle: {
    fontSize: 22,
    fontFamily: "UberMove-Bold",
    color: "#FFF",
    marginLeft: 12,
  },

  brandAvatarWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111119",
  },

  brandAvatar: {
    width: "100%",
    height: "100%",
  },

  headerTitle: {
    fontSize: 20,
    fontFamily: "UberMove-Bold",
    color: "#FFF",
    letterSpacing: 1,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 0,
  },

  notificationBtn: {
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },

  notificationBadge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "#FF575F",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0B0B15",
  },

  notificationBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontFamily: "UberMove-Bold",
  },

  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },

  profileImg: { width: "100%", height: "100%" },

  greetingContainer: {
    marginBottom: 20,
    paddingHorizontal: 24,
  },

  greetingTextBig: {
    fontSize: 34,
    fontFamily: "UberMove-Bold",
    color: "#FFF",
    lineHeight: 42,
  },

  greetingTextName: {
    fontSize: 34,
    fontFamily: "UberMove-Bold",
    color: "#246BFD",
    lineHeight: 42,
  },

  // SECTION HEADERS
  sectionHeaderContainer: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionHeader: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: "UberMove-Bold",
    color: "#FFF",
  },

  sectionTitleNoMargin: {
    fontSize: 18,
    fontFamily: "UberMove-Bold",
    color: "#FFF",
  },

  seeAllText: {
    color: "#246BFD",
    fontSize: 14,
    fontFamily: "UberMoveText-Medium",
  },

  // FILTER
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#181822",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },

  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  filterPillActive: {
    backgroundColor: "#2A2A35",
  },

  filterText: {
    color: "#666",
    fontSize: 12,
    fontFamily: "UberMoveText-Regular",
  },

  filterTextActive: {
    color: "#FFF",
    fontFamily: "UberMoveText-Medium",
  },

  // CARDS
  cardScroll: { marginBottom: 32 },
  cardScrollContent: { paddingHorizontal: 24 },

  card: {
    width: 280,
    backgroundColor: "#181822",
    borderRadius: 24,
    padding: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
    flexShrink: 0,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  cardLabel: {
    color: "#AAA",
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: "UberMoveText-Medium",
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  cardAmount: {
    fontSize: 30,
    fontFamily: "UberMove-Bold",
    color: "#FFF",
    marginBottom: 8,
  },

  trendContainer: { flexDirection: "row", alignItems: "center" },

  trendText: {
    color: "#93D94E",
    fontSize: 12,
    fontFamily: "UberMoveText-Medium",
    marginLeft: 4,
  },

  trendLabel: {
    color: "#666",
    fontSize: 12,
    fontFamily: "UberMoveText-Regular",
  },

  // PROGRESS
  progressContainer: {
    marginHorizontal: 24,
    backgroundColor: "#181822",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressTitle: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "UberMove-Bold",
  },

  progressSubtitle: {
    color: "#AAA",
    fontFamily: "UberMoveText-Regular",
    fontSize: 12,
  },

  percentPill: {
    backgroundColor: "rgba(147,217,78,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  percentText: {
    color: "#93D94E",
    fontFamily: "UberMove-Bold",
    fontSize: 14,
  },

  track: {
    width: "100%",
    height: 12,
    backgroundColor: "#2A2A35",
    borderRadius: 6,
    marginTop: 16,
  },

  bar: {
    height: "100%",
    backgroundColor: "#93D94E",
    borderRadius: 6,
  },

  // BOATS
  boatRow: { paddingHorizontal: 24, flexDirection: "row" },

  addBoatBtn: {
    width: 64,
    height: 74,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181822",
    borderRadius: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#2A2A35",
    flexShrink: 0,
  },

  boatItem: {
    width: 64,
    alignItems: "center",
    marginRight: 16,
  },

  boatIconBtn: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#181822",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },

  statusDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#181822",
  },

  boatName: {
    marginTop: 8,
    color: "#AAA",
    fontSize: 11,
    textAlign: "center",
    fontFamily: "UberMoveText-Regular",
  },

  // GRID
  gridContainer: { paddingHorizontal: 24 },

  gridRowTop: { flexDirection: "row", gap: 12, marginBottom: 12 },

  largeGridCard: {
    flex: 2,
    backgroundColor: "#181822",
    padding: 20,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },

  largeCardIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(142, 85, 234, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  largeCardContent: { justifyContent: "center" },

  gridValue: {
    color: "#FFF",
    fontSize: 24,
    fontFamily: "UberMove-Bold",
  },

  gridLabel: {
    color: "#AAA",
    fontSize: 10,
    fontFamily: "UberMoveText-Medium",
  },

  mediumGridCard: {
    flex: 1,
    backgroundColor: "#181822",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A2A35",
    paddingVertical: 16,
  },

  mediumCardTitle: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 8,
    fontFamily: "UberMoveText-Medium",
  },

  mediumCardSub: {
    color: "#AAA",
    fontSize: 10,
    fontFamily: "UberMoveText-Regular",
  },

  gridRowBottom: { flexDirection: "row", gap: 12 },

  smallCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#181822",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },

  iconCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  smallCardText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: "UberMoveText-Medium",
  },
});
