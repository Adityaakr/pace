import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, BorderRadius, Spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');
const PADDING = 20;
const GAP = 16;
const LEFT_COL = Math.round((width - PADDING * 2 - GAP) * 0.34);

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DATES = [3, 4, 5, 6, 7, 8, 9];
const TODAY_INDEX = 3;

// Chart data
const HEART_BARS = [15, 39, 26, 42, 51, 28, 8, 14, 26, 36, 26, 42, 41, 44, 51, 34, 22, 30, 34, 36, 34, 22, 38, 24, 8];
const STREAK_BARS = [30, 25, 48, 17, 37, 19, 47, 42, 23, 38, 36, 47];
const WEEKLY_DISTANCE = [
  { day: 'Mon', km: 5.2, max: 8 },
  { day: 'Tue', km: 3.8, max: 8 },
  { day: 'Wed', km: 7.5, max: 8 },
  { day: 'Thu', km: 0, max: 8 },
  { day: 'Fri', km: 6.1, max: 8 },
  { day: 'Sat', km: 4.5, max: 8 },
  { day: 'Sun', km: 0, max: 8 },
];
const PACE_DATA = [
  { min: 5, value: 5.8 },
  { min: 10, value: 5.5 },
  { min: 15, value: 5.3 },
  { min: 20, value: 5.6 },
  { min: 25, value: 5.2 },
  { min: 30, value: 5.4 },
  { min: 35, value: 5.1 },
  { min: 40, value: 5.3 },
];

export default function ActivityScreen() {
  const [selectedDay, setSelectedDay] = useState(TODAY_INDEX);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>February 2026</Text>
          <TouchableOpacity style={styles.calendarBtn}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Week Calendar Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekStrip}
        >
          {WEEKDAYS.map((day, index) => {
            const isSelected = index === selectedDay;
            const hasActivity = [1, 2, 3, 5].includes(index);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayItem, isSelected && styles.dayItemSelected]}
                onPress={() => setSelectedDay(index)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                  {day}
                </Text>
                <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                  {DATES[index]}
                </Text>
                {hasActivity && !isSelected && <View style={styles.activityDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Today Report */}
        <Text style={styles.sectionTitle}>Today Report</Text>

        {/* ===== ROW 1: Active Calories + Training Time (left) | Running (right) ===== */}
        <View style={styles.masonryRow}>
          <View style={[styles.leftCol, { gap: GAP }]}>
            {/* Active Calories */}
            <View style={styles.caloriesCard}>
              <Ionicons name="flame-outline" size={16} color={Colors.grayMedium} />
              <Text style={styles.caloriesLabel}>Active calories</Text>
              <Text style={styles.caloriesValue}>645 Cal</Text>
            </View>
            {/* Training Time */}
            <View style={styles.trainingCard}>
              <Text style={styles.trainingLabel}>Training time</Text>
              <View style={styles.circularContainer}>
                <View style={styles.circularTrack}>
                  <View style={styles.circularFill} />
                </View>
                <Text style={styles.circularText}>80%</Text>
              </View>
            </View>
          </View>
          {/* Running map card */}
          <View style={styles.runningCard}>
            <View style={styles.runningHeader}>
              <View style={styles.runningIconBadge}>
                <Ionicons name="walk" size={16} color={Colors.primary} />
              </View>
              <Text style={styles.runningTitle}>Running</Text>
            </View>
            <View style={styles.mapContainer}>
              <View style={styles.mapBg}>
                <View style={[styles.mapGridH, { top: '25%' }]} />
                <View style={[styles.mapGridH, { top: '50%' }]} />
                <View style={[styles.mapGridH, { top: '75%' }]} />
                <View style={[styles.mapGridV, { left: '25%' }]} />
                <View style={[styles.mapGridV, { left: '50%' }]} />
                <View style={[styles.mapGridV, { left: '75%' }]} />
                <View style={styles.routeV1} />
                <View style={styles.routeH1} />
                <View style={styles.routeV2} />
                <View style={styles.routeH2} />
                <View style={styles.routeV3} />
              </View>
            </View>
          </View>
        </View>

        {/* ===== ROW 2: Heart Rate (left) | Steps + Keep it Up (right) ===== */}
        <View style={[styles.masonryRow, { marginTop: GAP }]}>
          <View style={styles.heartCard}>
            <View style={styles.heartHeader}>
              <View style={styles.heartIconBadge}>
                <Ionicons name="heart" size={14} color={Colors.red} />
              </View>
              <Text style={styles.heartTitle}>Heart Rate</Text>
            </View>
            <View style={styles.heartGraph}>
              <View style={styles.heartBarsContainer}>
                {HEART_BARS.map((h, i) => (
                  <View key={i} style={[styles.heartBar, { height: h * 0.8 }]} />
                ))}
              </View>
              <Text style={styles.heartBpm}>79 Bpm</Text>
            </View>
          </View>
          <View style={{ gap: GAP, flex: 1 }}>
            <View style={styles.stepsCard}>
              <View style={styles.stepsHeader}>
                <View style={styles.stepsIconBadge}>
                  <Ionicons name="footsteps" size={14} color={Colors.gold} />
                </View>
                <Text style={styles.stepsTitle}>Steps</Text>
              </View>
              <Text style={styles.stepsCount}>9,942 / 10,000</Text>
              <View style={styles.stepsBarTrack}>
                <View style={[styles.stepsBarFill, { width: '99%' }]} />
              </View>
            </View>
            {/* Keep it Up - icon instead of emoji */}
            <View style={styles.keepUpCard}>
              <Text style={styles.keepUpText}>Keep it Up! </Text>
              <Ionicons name="fitness" size={18} color={Colors.textPrimary} />
            </View>
          </View>
        </View>

        {/* ===== ROW 3: Streak (left) | $PACE Earned (right) ===== */}
        <View style={[styles.masonryRow, { marginTop: GAP }]}>
          <View style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <View style={styles.streakIconBadge}>
                <Ionicons name="flame" size={14} color="#3F2B57" />
              </View>
              <Text style={styles.streakTitle}>Streak</Text>
            </View>
            <View style={styles.streakBarsContainer}>
              {STREAK_BARS.map((h, i) => (
                <View key={i} style={styles.streakBarWrapper}>
                  <View style={[styles.streakBarBg, { height: 47 }]} />
                  <View style={[styles.streakBarFill, { height: h }]} />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.paceCard}>
            <View style={styles.paceHeader}>
              <View style={styles.paceIconBadge}>
                <Ionicons name="diamond" size={14} color={Colors.primary} />
              </View>
              <Text style={styles.paceTitle}>$PACE</Text>
            </View>
            <View style={styles.paceDisplay}>
              <View style={styles.paceWave} />
              <Text style={styles.paceAmount}>+24 today</Text>
            </View>
          </View>
        </View>

        {/* ===== WEEKLY DISTANCE CHART ===== */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Weekly Distance</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTotal}>27.1 km</Text>
            <View style={styles.chartBadge}>
              <Ionicons name="arrow-up" size={12} color={Colors.accent} />
              <Text style={styles.chartBadgeText}>+12% vs last week</Text>
            </View>
          </View>
          <View style={styles.barChart}>
            {WEEKLY_DISTANCE.map((d, i) => {
              const pct = d.km / d.max;
              const isToday = i === 2; // Wed
              return (
                <View key={i} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${pct * 100}%`,
                          backgroundColor: isToday ? Colors.accent : Colors.primary,
                          opacity: d.km === 0 ? 0.15 : 1,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, isToday && styles.barLabelActive]}>
                    {d.day}
                  </Text>
                  <Text style={styles.barValue}>{d.km > 0 ? `${d.km}` : '-'}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ===== PACE ANALYSIS ===== */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Pace Analysis</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTotal}>5:22 min/km</Text>
              <Text style={styles.chartSubtotal}>Avg pace today</Text>
            </View>
            <View style={styles.paceStats}>
              <View style={styles.paceStat}>
                <Ionicons name="arrow-down" size={10} color={Colors.accent} />
                <Text style={styles.paceStatLabel}>Best</Text>
                <Text style={styles.paceStatValue}>5:01</Text>
              </View>
              <View style={styles.paceStat}>
                <Ionicons name="arrow-up" size={10} color={Colors.gold} />
                <Text style={styles.paceStatLabel}>Worst</Text>
                <Text style={styles.paceStatValue}>5:48</Text>
              </View>
            </View>
          </View>
          {/* Line chart approximation */}
          <View style={styles.lineChart}>
            <View style={styles.lineChartGrid}>
              <View style={[styles.lineChartGridLine, { bottom: '20%' }]} />
              <View style={[styles.lineChartGridLine, { bottom: '40%' }]} />
              <View style={[styles.lineChartGridLine, { bottom: '60%' }]} />
              <View style={[styles.lineChartGridLine, { bottom: '80%' }]} />
            </View>
            <View style={styles.lineChartDots}>
              {PACE_DATA.map((p, i) => {
                const normalized = (6 - p.value) / 1; // 5.0-6.0 range
                return (
                  <View key={i} style={styles.lineChartDotCol}>
                    <View style={[styles.lineChartDot, { bottom: `${normalized * 80 + 10}%` }]}>
                      <View style={styles.lineChartDotInner} />
                    </View>
                  </View>
                );
              })}
            </View>
            {/* Connecting line visualization */}
            <View style={styles.lineChartLine} />
          </View>
          <View style={styles.lineChartLabels}>
            {PACE_DATA.map((p, i) => (
              <Text key={i} style={styles.lineChartLabel}>{p.min}m</Text>
            ))}
          </View>
        </View>

        {/* ===== ADDITIONAL STATS ROW ===== */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Performance</Text>
        <View style={styles.perfRow}>
          <View style={[styles.perfCard, { backgroundColor: '#EAECFF' }]}>
            <Ionicons name="speedometer-outline" size={20} color={Colors.purple} />
            <Text style={styles.perfValue}>5:22</Text>
            <Text style={styles.perfLabel}>Avg Pace</Text>
          </View>
          <View style={[styles.perfCard, { backgroundColor: '#FFF0F0' }]}>
            <Ionicons name="pulse-outline" size={20} color={Colors.red} />
            <Text style={styles.perfValue}>152</Text>
            <Text style={styles.perfLabel}>Avg BPM</Text>
          </View>
          <View style={[styles.perfCard, { backgroundColor: '#FFE8C6' }]}>
            <Ionicons name="trending-up-outline" size={20} color={Colors.gold} />
            <Text style={styles.perfValue}>85m</Text>
            <Text style={styles.perfLabel}>Elevation</Text>
          </View>
        </View>

        {/* ===== CALORIES BREAKDOWN ===== */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Calories Breakdown</Text>
        <View style={styles.chartCard}>
          <View style={styles.calBreakdownRow}>
            {/* Donut chart approximation */}
            <View style={styles.donutContainer}>
              <View style={styles.donutRing}>
                <View style={styles.donutSegment1} />
                <View style={styles.donutSegment2} />
                <View style={styles.donutCenter}>
                  <Text style={styles.donutValue}>645</Text>
                  <Text style={styles.donutUnit}>Cal</Text>
                </View>
              </View>
            </View>
            {/* Legend */}
            <View style={styles.calLegend}>
              <View style={styles.calLegendItem}>
                <View style={[styles.calLegendDot, { backgroundColor: Colors.accent }]} />
                <View>
                  <Text style={styles.calLegendLabel}>Running</Text>
                  <Text style={styles.calLegendValue}>420 Cal</Text>
                </View>
              </View>
              <View style={styles.calLegendItem}>
                <View style={[styles.calLegendDot, { backgroundColor: Colors.purple }]} />
                <View>
                  <Text style={styles.calLegendLabel}>Walking</Text>
                  <Text style={styles.calLegendValue}>145 Cal</Text>
                </View>
              </View>
              <View style={styles.calLegendItem}>
                <View style={[styles.calLegendDot, { backgroundColor: Colors.gold }]} />
                <View>
                  <Text style={styles.calLegendLabel}>Other</Text>
                  <Text style={styles.calLegendValue}>80 Cal</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ===== RECENT RUNS ===== */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Recent Runs</Text>
        <View style={styles.recentRunsContainer}>
          {[
            { date: 'Today', dist: '7.5 km', time: '40:12', pace: '5:22/km', icon: 'flash' as const },
            { date: 'Tuesday', dist: '3.8 km', time: '21:05', pace: '5:33/km', icon: 'walk' as const },
            { date: 'Monday', dist: '5.2 km', time: '28:30', pace: '5:29/km', icon: 'trending-up' as const },
          ].map((run, i) => (
            <TouchableOpacity key={i} style={styles.runItem} activeOpacity={0.7}>
              <View style={styles.runIconContainer}>
                <Ionicons name={run.icon} size={18} color={Colors.accent} />
              </View>
              <View style={styles.runInfo}>
                <Text style={styles.runDate}>{run.date}</Text>
                <Text style={styles.runDist}>{run.dist}</Text>
              </View>
              <View style={styles.runStats}>
                <Text style={styles.runTime}>{run.time}</Text>
                <Text style={styles.runPace}>{run.pace}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.grayMedium} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F6FA' },
  scrollContent: { paddingBottom: 100 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: PADDING, paddingTop: 12, paddingBottom: 16,
  },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 24, color: Colors.textPrimary },
  calendarBtn: { padding: 4 },

  // Week Strip
  weekStrip: { paddingHorizontal: PADDING, gap: 6 },
  dayItem: {
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.accent,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, minWidth: 45, gap: 2,
  },
  dayItemSelected: { backgroundColor: Colors.primary },
  dayLabel: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textPrimary, textAlign: 'center' },
  dayLabelSelected: { color: Colors.white },
  dayNumber: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textPrimary, textAlign: 'center' },
  dayNumberSelected: { color: Colors.white },
  activityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary, marginTop: 2 },

  sectionTitle: {
    fontFamily: Fonts.bold, fontSize: 18, lineHeight: 24, color: Colors.textPrimary,
    paddingHorizontal: PADDING, marginTop: 24, marginBottom: 16,
  },

  // Masonry
  masonryRow: { flexDirection: 'row', paddingHorizontal: PADDING, gap: GAP },
  leftCol: { width: LEFT_COL },

  // ROW 1
  caloriesCard: {
    backgroundColor: '#FAFBF9', borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(25,33,38,0.1)', padding: 12, height: 70, justifyContent: 'center', gap: 2,
  },
  caloriesLabel: { fontFamily: Fonts.regular, fontSize: 13, color: 'rgba(25,33,38,0.5)' },
  caloriesValue: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.textPrimary },

  trainingCard: { backgroundColor: '#EAECFF', borderRadius: 12, padding: 12, height: 132, alignItems: 'center' },
  trainingLabel: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textPrimary, alignSelf: 'flex-start' },
  circularContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circularTrack: {
    width: 74, height: 74, borderRadius: 37, borderWidth: 7,
    borderColor: '#D4D8F0', alignItems: 'center', justifyContent: 'center',
  },
  circularFill: {
    position: 'absolute', top: -7, left: -7, right: -7, bottom: -7, borderRadius: 37,
    borderWidth: 7, borderColor: Colors.purple, borderTopColor: 'transparent',
    borderRightColor: 'transparent', transform: [{ rotate: '-45deg' }],
  },
  circularText: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textPrimary },

  runningCard: { flex: 1, backgroundColor: Colors.primary, borderRadius: 15, padding: 12, height: 70 + GAP + 132 },
  runningHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  runningIconBadge: { width: 28, height: 28, borderRadius: 3, backgroundColor: '#FAFBF9', alignItems: 'center', justifyContent: 'center' },
  runningTitle: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 28, color: '#FAFBF9' },
  mapContainer: { flex: 1, borderRadius: 7, overflow: 'hidden' },
  mapBg: { flex: 1, backgroundColor: '#FAFBF9', borderRadius: 7, position: 'relative' },
  mapGridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
  mapGridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
  routeV1: { position: 'absolute', left: '15%', top: '40%', width: 2.5, height: '55%', backgroundColor: Colors.accent, borderRadius: 1 },
  routeH1: { position: 'absolute', left: '15%', top: '40%', width: '35%', height: 2.5, backgroundColor: Colors.accent, borderRadius: 1 },
  routeV2: { position: 'absolute', left: '50%', top: '20%', width: 2.5, height: '20%', backgroundColor: Colors.accent, borderRadius: 1 },
  routeH2: { position: 'absolute', left: '50%', top: '20%', width: '30%', height: 2.5, backgroundColor: Colors.accent, borderRadius: 1 },
  routeV3: { position: 'absolute', left: '80%', top: '20%', width: 2.5, height: '50%', backgroundColor: Colors.accent, borderRadius: 1 },

  // ROW 2
  heartCard: { flex: 1.5, backgroundColor: '#FFEBEB', borderRadius: 15, padding: 12, height: 167 },
  heartHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heartIconBadge: { width: 28, height: 28, borderRadius: 3, backgroundColor: '#F9B9B9', alignItems: 'center', justifyContent: 'center' },
  heartTitle: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 28, color: Colors.textPrimary },
  heartGraph: { flex: 1, backgroundColor: Colors.white, borderRadius: 7, marginTop: 8, padding: 8, paddingBottom: 4 },
  heartBarsContainer: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  heartBar: { width: 4, borderRadius: 7, backgroundColor: Colors.red },
  heartBpm: { fontFamily: Fonts.bold, fontSize: 10, color: '#191D1A', textAlign: 'right', marginTop: 4 },

  stepsCard: { backgroundColor: '#FFE8C6', borderRadius: 12, padding: 12, height: 100 },
  stepsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepsIconBadge: { width: 28, height: 28, borderRadius: 3, backgroundColor: '#F8D39D', alignItems: 'center', justifyContent: 'center' },
  stepsTitle: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 28, color: Colors.textPrimary },
  stepsCount: { fontFamily: Fonts.bold, fontSize: 13, color: Colors.textPrimary, marginTop: 8 },
  stepsBarTrack: { height: 12, backgroundColor: '#FFEDD1', borderRadius: 25, marginTop: 6 },
  stepsBarFill: { height: 12, backgroundColor: Colors.gold, borderRadius: 25 },

  keepUpCard: {
    backgroundColor: '#F6CFCF', borderRadius: 12, height: 51,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4,
  },
  keepUpText: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.textPrimary },

  // ROW 3
  streakCard: { flex: 1.15, backgroundColor: '#EFE2FF', borderRadius: 15, padding: 12, height: 128 },
  streakHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakIconBadge: { width: 28, height: 28, borderRadius: 3, backgroundColor: '#D6BBF8', alignItems: 'center', justifyContent: 'center' },
  streakTitle: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 28, color: Colors.textPrimary },
  streakBarsContainer: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 5, marginTop: 8 },
  streakBarWrapper: { flex: 1, position: 'relative', justifyContent: 'flex-end' },
  streakBarBg: { width: 8, borderRadius: 20, backgroundColor: '#F5EDFF', alignSelf: 'center' },
  streakBarFill: { width: 8, borderRadius: 20, backgroundColor: '#3F2B57', position: 'absolute', bottom: 0, alignSelf: 'center' },

  paceCard: { flex: 1, backgroundColor: '#D8E6EC', borderRadius: 23, padding: 12, height: 128 },
  paceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paceIconBadge: { width: 28, height: 28, borderRadius: 3, backgroundColor: '#AED1E0', alignItems: 'center', justifyContent: 'center' },
  paceTitle: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 28, color: Colors.textPrimary },
  paceDisplay: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 19, marginTop: 8,
    overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
  },
  paceWave: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
    backgroundColor: `${Colors.accent}30`, borderTopLeftRadius: 40, borderTopRightRadius: 20,
  },
  paceAmount: { fontFamily: Fonts.bold, fontSize: 13, color: Colors.textPrimary, zIndex: 1 },

  // ===== WEEKLY DISTANCE CHART =====
  chartCard: {
    marginHorizontal: PADDING, backgroundColor: Colors.white, borderRadius: 16, padding: 16,
  },
  chartHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  chartTotal: { fontFamily: Fonts.bold, fontSize: 22, color: Colors.textPrimary },
  chartSubtotal: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  chartBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: `${Colors.accent}20`, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  chartBadgeText: { fontFamily: Fonts.bold, fontSize: 11, color: Colors.accent },

  barChart: { flexDirection: 'row', gap: 8, height: 120, alignItems: 'flex-end' },
  barCol: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: { width: 20, height: 100, backgroundColor: '#F2F3F4', borderRadius: 10, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: 20, borderRadius: 10 },
  barLabel: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textSecondary },
  barLabelActive: { fontFamily: Fonts.bold, color: Colors.textPrimary },
  barValue: { fontFamily: Fonts.bold, fontSize: 10, color: Colors.textSecondary },

  // ===== PACE ANALYSIS =====
  paceStats: { flexDirection: 'row', gap: 12 },
  paceStat: { alignItems: 'center', gap: 2 },
  paceStatLabel: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSecondary },
  paceStatValue: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textPrimary },

  lineChart: { height: 80, position: 'relative', marginBottom: 8 },
  lineChartGrid: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  lineChartGridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#F0F0F0' },
  lineChartDots: { flexDirection: 'row', flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  lineChartDotCol: { flex: 1, position: 'relative' },
  lineChartDot: { position: 'absolute', alignSelf: 'center', width: 10, height: 10, borderRadius: 5, backgroundColor: `${Colors.accent}30`, alignItems: 'center', justifyContent: 'center' },
  lineChartDotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent },
  lineChartLine: {
    position: 'absolute', top: '35%', left: '5%', right: '5%', height: 2,
    backgroundColor: `${Colors.accent}40`, borderRadius: 1,
  },
  lineChartLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  lineChartLabel: { fontFamily: Fonts.regular, fontSize: 10, color: Colors.textSecondary, flex: 1, textAlign: 'center' },

  // ===== PERFORMANCE CARDS =====
  perfRow: { flexDirection: 'row', paddingHorizontal: PADDING, gap: 10 },
  perfCard: {
    flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 6,
  },
  perfValue: { fontFamily: Fonts.bold, fontSize: 20, color: Colors.textPrimary },
  perfLabel: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textSecondary },

  // ===== CALORIES BREAKDOWN =====
  calBreakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  donutContainer: { alignItems: 'center', justifyContent: 'center' },
  donutRing: {
    width: 100, height: 100, borderRadius: 50, borderWidth: 12,
    borderColor: Colors.accent, alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  donutSegment1: {
    position: 'absolute', top: -12, left: -12, right: -12, bottom: -12, borderRadius: 50,
    borderWidth: 12, borderColor: Colors.purple, borderTopColor: 'transparent',
    borderRightColor: 'transparent', transform: [{ rotate: '30deg' }],
  },
  donutSegment2: {
    position: 'absolute', top: -12, left: -12, right: -12, bottom: -12, borderRadius: 50,
    borderWidth: 12, borderColor: Colors.gold, borderTopColor: 'transparent',
    borderRightColor: 'transparent', borderBottomColor: 'transparent',
    transform: [{ rotate: '180deg' }],
  },
  donutCenter: { alignItems: 'center' },
  donutValue: { fontFamily: Fonts.bold, fontSize: 20, color: Colors.textPrimary },
  donutUnit: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textSecondary, marginTop: -2 },

  calLegend: { flex: 1, gap: 12 },
  calLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  calLegendDot: { width: 10, height: 10, borderRadius: 5 },
  calLegendLabel: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textSecondary },
  calLegendValue: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textPrimary },

  // ===== RECENT RUNS =====
  recentRunsContainer: { marginHorizontal: PADDING, backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden' },
  runItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: '#F2F3F4', gap: 12,
  },
  runIconContainer: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: `${Colors.accent}20`,
    alignItems: 'center', justifyContent: 'center',
  },
  runInfo: { flex: 1 },
  runDate: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.textSecondary },
  runDist: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.textPrimary },
  runStats: { alignItems: 'flex-end' },
  runTime: { fontFamily: Fonts.bold, fontSize: 14, color: Colors.textPrimary },
  runPace: { fontFamily: Fonts.regular, fontSize: 11, color: Colors.textSecondary },
});
