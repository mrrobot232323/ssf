// WeeklySummary.tsx
import React, { useMemo, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Share2,
  CheckCircle2,
  Wallet,
  Anchor,
  TrendingUp,
} from "lucide-react-native";

/**
 * WeeklySummary.tsx
 *
 * Full rewrite — Uber-style typography, premium UI, collapsible boat cards,
 * weekly totals, shareable reports, light animations (LayoutAnimation).
 *
 * Assumes fonts are already loaded globally (UberMove-Bold, UberMoveText-Medium, UberMoveText-Regular).
 */

// Enable LayoutAnimation on Android (safe guard)
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ---------------------------
   Mock data (replace with your app data)
   --------------------------- */
const mockBoats = [
  {
    id: "1",
    name: "Sea Spirit",
    ownerName: "Derek Doyle",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Ocean King",
    ownerName: "Sarah Smith",
    image:
      "https://images.unsplash.com/photo-1544551763-46a42a461d12?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Blue Horizon",
    ownerName: "Mike Ross",
    image:
      "https://images.unsplash.com/photo-1516410290616-2e452627e774?q=80&w=1000&auto=format&fit=crop",
  },
];

const now = Date.now();
const mockLots = [
  {
    id: "101",
    boatId: "1",
    totalAmount: 50000,
    commissionAmount: 5000,
    payableAmount: 45000,
    timestamp: now,
  },
  {
    id: "102",
    boatId: "1",
    totalAmount: 20000,
    commissionAmount: 2000,
    payableAmount: 18000,
    timestamp: now - 86400000,
  },
  {
    id: "103",
    boatId: "2",
    totalAmount: 80000,
    commissionAmount: 8000,
    payableAmount: 72000,
    timestamp: now,
  },
  {
    id: "104",
    boatId: "3",
    totalAmount: 15000,
    commissionAmount: 1500,
    payableAmount: 13500,
    timestamp: now - 172800000,
  },
  {
    id: "105",
    boatId: "1",
    totalAmount: 100000,
    commissionAmount: 10000,
    payableAmount: 90000,
    timestamp: now - 604800000,
  },
];

/* ---------------------------
   Helpers
   --------------------------- */
function startOfWeek(date: Date) {
  const s = new Date(date);
  const day = s.getDay(); // 0..6 (Sun..Sat)
  s.setDate(s.getDate() - day);
  s.setHours(0, 0, 0, 0);
  return s;
}
function endOfWeekFrom(start: Date) {
  const e = new Date(start);
  e.setDate(e.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
}

/* ---------------------------
   Component
   --------------------------- */
export default function WeeklySummary() {

  const router = useRouter();

  // local "app" data - replace with real context/store
  const boats = mockBoats;
  const lots = mockLots;

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [expandedBoatId, setExpandedBoatId] = useState<string | null>(null);
  const [settledBoatIds, setSettledBoatIds] = useState<string[]>([]);

  // compute week range & aggregates
  const weekly = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end = endOfWeekFrom(start);

    const weeksLots = lots.filter((l) => l.timestamp >= start.getTime() && l.timestamp <= end.getTime());

    const stats: Record<
      string,
      { revenue: number; commission: number; payable: number; count: number; lots: typeof weeksLots }
    > = {};

    let totalPayable = 0;

    for (const lot of weeksLots) {
      if (!stats[lot.boatId]) stats[lot.boatId] = { revenue: 0, commission: 0, payable: 0, count: 0, lots: [] };
      stats[lot.boatId].revenue += lot.totalAmount;
      stats[lot.boatId].commission += lot.commissionAmount;
      stats[lot.boatId].payable += lot.payableAmount;
      stats[lot.boatId].count += 1;
      stats[lot.boatId].lots.push(lot);
      totalPayable += lot.payableAmount;
    }

    return { start, end, stats, totalPayable };
  }, [currentDate, lots]);

  /* ---------------------------
     UI handlers
     --------------------------- */
  const changeWeek = (direction: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + direction * 7);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentDate(next);
    setExpandedBoatId(null);
  };

  const toggleExpand = (boatId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedBoatId((prev) => (prev === boatId ? null : boatId));
  };

  const handleSettle = (boatId: string) => {
    Alert.alert("Settle Week", "Mark this boat as paid for the selected week?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          setSettledBoatIds((prev) => (prev.includes(boatId) ? prev : [...prev, boatId]));
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        },
      },
    ]);
  };

  const handleShareBoat = async (boatId: string) => {
    const stats = weekly.stats[boatId];
    const boat = boats.find((b) => b.id === boatId);
    if (!stats || !boat) return;

    const message = `
📅 Weekly Settlement (${weekly.start.toLocaleDateString()} - ${weekly.end.toLocaleDateString()})
⛵ ${boat.name} — ${boat.ownerName}

💰 Revenue: ₹${stats.revenue.toLocaleString()}
🏷️ Commission: ₹${stats.commission.toLocaleString()}
✅ Net Payable: ₹${stats.payable.toLocaleString()}

Lots: ${stats.count}

— AquaLedger
`.trim();

    try {
      await Share.share({ message });
    } catch (err) {
      Alert.alert("Share failed", (err as Error).message);
    }
  };

  const isTodayWeek = useMemo(() => {
    const s = startOfWeek(new Date());
    return s.getTime() === startOfWeek(currentDate).getTime();
  }, [currentDate]);

  /* ---------------------------
     Render
     --------------------------- */
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0B15" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerLeftBtn}>
            <ChevronLeft size={22} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Weekly Settlement</Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Week navigator */}
          <View style={styles.weekNav}>
            <TouchableOpacity onPress={() => changeWeek(-1)} style={styles.weekNavBtn}>
              <ChevronLeft size={18} color="#666" />
            </TouchableOpacity>

            <View style={styles.weekLabel}>
              <Calendar size={16} color="#246BFD" style={{ marginRight: 8 }} />
              <Text style={styles.weekLabelText}>
                {weekly.start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} -{" "}
                {weekly.end.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </Text>
            </View>

            <TouchableOpacity onPress={() => changeWeek(1)} style={styles.weekNavBtn}>
              <ChevronRight size={18} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Grand total */}
          <View style={styles.grand}>
            <View style={{ flex: 1 }}>
              <Text style={styles.grandLabel}>Total Payable This Week</Text>
              <Text style={styles.grandValue}>₹{weekly.totalPayable.toLocaleString()}</Text>
            </View>
            <View style={styles.grandIcon}>
              <Wallet size={22} color="#0B0B15" />
            </View>
          </View>

          {/* Boat cards */}
          <View style={styles.list}>
            {Object.keys(weekly.stats).length === 0 ? (
              <View style={styles.empty}>
                <Anchor size={44} color="#2A2A35" />
                <Text style={styles.emptyText}>No transactions for this week</Text>
              </View>
            ) : (
              Object.entries(weekly.stats).map(([boatId, stats]) => {
                const boat = boats.find((b) => b.id === boatId) || {
                  id: boatId,
                  name: "Unknown Boat",
                  ownerName: "",
                  image: undefined,
                };
                const expanded = expandedBoatId === boatId;
                const settled = settledBoatIds.includes(boatId);

                return (
                  <View key={boatId} style={[styles.card, settled && styles.cardSettled]}>
                    <TouchableOpacity
                      onPress={() => toggleExpand(boatId)}
                      activeOpacity={0.85}
                      style={styles.cardHeader}
                    >
                      <View style={styles.cardLeft}>
                        <Image source={{ uri: boat.image }} style={styles.avatar} />
                        <View style={{ marginLeft: 12 }}>
                          <Text style={styles.boatName}>{boat.name}</Text>
                          <Text style={styles.boatOwner}>{boat.ownerName}</Text>
                        </View>
                      </View>

                      <View style={styles.cardRight}>
                        <Text style={[styles.payable, settled && { color: "#AAA" }]}>₹{stats.payable.toLocaleString()}</Text>

                        <View style={styles.chevWrap}>
                          {settled && (
                            <View style={styles.paidBadge}>
                              <CheckCircle2 size={12} color="#93D94E" style={{ marginRight: 6 }} />
                              <Text style={styles.paidText}>PAID</Text>
                            </View>
                          )}
                          {expanded ? <ChevronUp size={16} color="#666" /> : <ChevronDown size={16} color="#666" />}
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Expanded details */}
                    {expanded && (
                      <View style={styles.cardDetails}>
                        <View style={styles.detailRow}>
                          <View style={styles.detailBlock}>
                            <Text style={styles.detailLabel}>Revenue</Text>
                            <Text style={styles.detailValue}>₹{stats.revenue.toLocaleString()}</Text>
                          </View>

                          <View style={styles.detailBlock}>
                            <Text style={styles.detailLabel}>Commission</Text>
                            <Text style={[styles.detailValue, { color: "#FF575F" }]}>₹{stats.commission.toLocaleString()}</Text>
                          </View>

                          <View style={styles.detailBlock}>
                            <Text style={styles.detailLabel}>Lots</Text>
                            <Text style={styles.detailValue}>{stats.count}</Text>
                          </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.actionsRow}>
                          <TouchableOpacity
                            style={[styles.actionBtn, styles.actionShare]}
                            onPress={() => handleShareBoat(boatId)}
                            activeOpacity={0.85}
                          >
                            <Share2 size={16} color="#FFF" />
                            <Text style={styles.actionText}>Share Report</Text>
                          </TouchableOpacity>

                          {!settled && (
                            <TouchableOpacity
                              style={[styles.actionBtn, styles.actionSettle]}
                              onPress={() => handleSettle(boatId)}
                              activeOpacity={0.85}
                            >
                              <CheckCircle2 size={16} color="#0B0B15" />
                              <Text style={[styles.actionText, { color: "#0B0B15" }]}>Settle</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------------------------
   Styles
   --------------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0B0B15" },
  container: { flex: 1, backgroundColor: "#0B0B15" },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeftBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#181822",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  headerTitle: {
    fontSize: 20,
    color: "#FFF",
    fontFamily: "UberMove-Bold",
    letterSpacing: 0.2,
  },
  headerRightPlaceholder: { width: 40 },

  // Content
  content: { paddingHorizontal: 20, paddingBottom: 120 },

  // Week navigator
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#181822",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#2A2A35",
    marginBottom: 18,
  },
  weekNavBtn: { padding: 6, borderRadius: 10 },
  weekLabel: { flexDirection: "row", alignItems: "center" },
  weekLabelText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "UberMoveText-Medium",
  },

  // Grand
  grand: {
    backgroundColor: "#93D94E",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    shadowColor: "#93D94E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  grandLabel: {
    color: "#0B0B15",
    fontSize: 13,
    fontFamily: "UberMoveText-Medium",
    marginBottom: 6,
  },
  grandValue: {
    color: "#0B0B15",
    fontSize: 24,
    fontFamily: "UberMove-Bold",
  },
  grandIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  // List
  list: { marginTop: 6 },

  empty: { alignItems: "center", padding: 36, opacity: 0.6 },
  emptyText: { color: "#666", marginTop: 10, fontFamily: "UberMoveText-Regular" },

  // Card
  card: {
    backgroundColor: "#181822",
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#2A2A35",
    overflow: "hidden",
  },
  cardSettled: { borderColor: "rgba(147,217,78,0.25)", opacity: 0.92 },

  cardHeader: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#2A2A35" },
  boatName: { color: "#FFF", fontSize: 16, fontFamily: "UberMove-Bold" },
  boatOwner: { color: "#AAA", fontSize: 12, fontFamily: "UberMoveText-Regular" },

  cardRight: { alignItems: "flex-end", justifyContent: "center" },
  payable: { color: "#93D94E", fontSize: 15, fontFamily: "UberMoveText-Medium" },

  chevWrap: { marginTop: 6, flexDirection: "row", alignItems: "center" },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(147,217,78,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  paidText: { color: "#93D94E", fontSize: 11, fontFamily: "UberMoveText-Medium" },

  // Details
  cardDetails: {
    backgroundColor: "#13131A",
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#2A2A35",
  },
  detailRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  detailBlock: { flex: 1, alignItems: "flex-start" },
  detailLabel: { color: "#888", fontSize: 12, fontFamily: "UberMoveText-Regular", marginBottom: 6 },
  detailValue: { color: "#FFF", fontSize: 14, fontFamily: "UberMoveText-Medium" },

  divider: { height: 1, backgroundColor: "#2A2A35", marginVertical: 12 },

  // Actions
  actionsRow: { flexDirection: "row", gap: 12 },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionShare: { backgroundColor: "#2A2A35" },
  actionSettle: { backgroundColor: "#93D94E" },
  actionText: { color: "#FFF", fontSize: 14, fontFamily: "UberMoveText-Medium" },
});
