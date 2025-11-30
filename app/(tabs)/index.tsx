import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useApp } from '@/context/AppContext';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { lots, boats } = useApp();

  // Calculate today's stats
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysLots = lots.filter(lot => lot.timestamp >= today);

  const totalRevenue = todaysLots.reduce((sum, lot) => sum + lot.totalAmount, 0);
  const totalCommission = todaysLots.reduce((sum, lot) => sum + lot.commissionAmount, 0);
  const totalPayable = todaysLots.reduce((sum, lot) => sum + lot.payableAmount, 0);

  const formatDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#0e0923ff', '#050871ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</Text>
              <Text style={styles.appName}>AquaLedger</Text>
            </View>
            <View style={styles.dateContainer}>
              <FontAwesome name="calendar" size={12} color="rgba(255,255,255,0.9)" />
              <Text style={styles.date}>{formatDate()}</Text>
            </View>
          </View>
        </LinearGradient>








        {/* Today's Summary Cards */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardPrimary]}>
              <View style={styles.statCardHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <FontAwesome name="list-alt" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>Total Lots</Text>
              </View>
              <Text style={styles.statValue}>{todaysLots.length}</Text>
            </View>

            <View style={[styles.statCard, styles.statCardRevenue]}>
              <View style={styles.statCardHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <FontAwesome name="rupee" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>Revenue</Text>
              </View>
              <Text style={styles.statValue}>₹{totalRevenue.toLocaleString()}</Text>
            </View>

            <View style={[styles.statCard, styles.statCardCommission]}>
              <View style={styles.statCardHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <FontAwesome name="percent" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>Commission</Text>
              </View>
              <Text style={styles.statValue}>₹{totalCommission.toLocaleString()}</Text>
            </View>

            <View style={[styles.statCard, styles.statCardPayable]}>
              <View style={styles.statCardHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <FontAwesome name="check-circle" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.statLabel}>Payable</Text>
              </View>
              <Text style={styles.statValue}>₹{totalPayable.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/new-lot')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#000000ff', '#dce9f4ff']}
                style={styles.actionGradient}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome name="plus-circle" size={28} color={Colors.light.primary} />
                </View>
                <Text style={styles.actionText}>New Lot</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/boats')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#000000ff', '#dce9f4ff']}
                style={styles.actionGradient}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome name="ship" size={28} color={Colors.light.secondary} />
                </View>
                <Text style={styles.actionText}>Boats</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/daily')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#000000ff', '#dce9f4ff']}
                style={styles.actionGradient}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome name="bar-chart" size={28} color={Colors.light.success} />
                </View>
                <Text style={styles.actionText}>Daily</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/weekly')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#000000ff', '#dce9f4ff']}
                style={styles.actionGradient}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome name="calendar" size={28} color="#9C27B0" />
                </View>
                <Text style={styles.actionText}>Weekly</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {lots.length > 5 && (
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.activityList}>
            {lots.slice(0, 5).map((lot, index) => {
              const boat = boats.find(b => b.id === lot.boatId);
              return (
                <TouchableOpacity
                  key={lot.id}
                  style={[
                    styles.activityItem,
                    index === lots.slice(0, 5).length - 1 && styles.activityItemLast
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.activityIcon, { backgroundColor: '#E3F2FD' }]}>
                    <FontAwesome name="file-text-o" size={18} color={Colors.light.primary} />
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityTitle}>{boat?.name || 'Unknown Boat'}</Text>
                    <Text style={styles.activitySubtitle}>
                      {lot.species} • {lot.weight}kg
                    </Text>
                  </View>
                  <View style={styles.activityAmountContainer}>
                    <Text style={styles.activityAmount}>₹{lot.totalAmount.toLocaleString()}</Text>
                    <FontAwesome name="chevron-right" size={12} color="#999" style={styles.chevron} />
                  </View>
                </TouchableOpacity>
              );
            })}
            {lots.length === 0 && (
              <View style={styles.emptyState}>
                <FontAwesome name="inbox" size={48} color="#CCC" />
                <Text style={styles.emptyText}>No recent activity</Text>
                <Text style={styles.emptySubtext}>Start by creating a new lot</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f5f9cc',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    ...Typography.styles.bodyMedium,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    // fontFamily: 'UberMoveText-Medium', // Disabled until .ttf files are available
    fontWeight: '900',
  },
  appName: {
    ...Typography.styles.h1,
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  date: {
    ...Typography.styles.captionMedium,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 6,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    // fontFamily: 'UberMoveText-Medium', // Disabled until .ttf files are available
    fontWeight: '900',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    fontWeight: '900',
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    fontWeight: '900',
  },
  statCardPrimary: {
    backgroundColor: '#070232ff',
  },
  statCardRevenue: {
    backgroundColor: '#725b5bff',
  },
  statCardCommission: {
    backgroundColor: '#252320ff',
  },
  statCardPayable: {
    backgroundColor: '#060307ff',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statLabel: {
    ...Typography.styles.smallMedium,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  statValue: {
    ...Typography.styles.h2,
    color: '#FFFFFF',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    ...Typography.styles.bodySemibold,
    color: '#000000ff',
    fontWeight: '900',
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 20,

  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    ...Typography.styles.smallMedium,
    color: Colors.light.primary,
  },
  activityList: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    ...Typography.styles.bodySemibold,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  activitySubtitle: {
    ...Typography.styles.small,
    color: '#666',
  },
  activityAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityAmount: {
    ...Typography.styles.h4,
    color: Colors.light.primary,
    marginRight: 8,
  },
  chevron: {
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    ...Typography.styles.bodySemibold,
    color: '#999',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    ...Typography.styles.small,
    color: '#BBB',
  },
});
