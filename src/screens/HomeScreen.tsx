// SmartDay Multi-Skin Home Screen (Section 0.5, 0.6, 0.7, 0.8 Spec)
// Adapts presentation dynamically across Ember, Halo, Grove, and Noir.
// Seed user: Mia (35d streak, today 2h 30m, 3 tasks, 8:00 AM meeting).

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSkin } from '../skins/SkinContext';
import { SkinSwitcherDots } from '../skins/SkinSwitcherDots';
import { EmberGradientBackground } from '../skins/backgrounds/EmberGradientBackground';
import { TopoBackground } from '../skins/backgrounds/TopoBackground';
import { useSmartDay } from '../context/SmartDayContext';
import { QuickActionsGrid } from '../components/ui/QuickActionsGrid';
import { DailyRings } from '../components/ui/DailyRings';
import { TrendStrip } from '../components/ui/TrendStrip';
import { HighlightCard } from '../components/ui/HighlightCard';
import { HabitStreakRow } from '../components/ui/HabitStreakRow';
import { TaskStatusRow } from '../components/ui/TaskStatusRow';
import { Task } from '../types';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  onNavigateToPlan: () => void;
  onNavigateToSessions: (task?: Task) => void;
  onNavigateToMetrics: () => void;
  onNavigateToYou: () => void;
  onOpenSearch: () => void;
  onOpenAddTask: () => void;
  onOpenLogHabit: () => void;
  onOpenQuickNote: () => void;
  onOpenFileConverter: () => void;
  onOpenWeeklyReport: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToPlan,
  onNavigateToSessions,
  onNavigateToMetrics,
  onNavigateToYou,
  onOpenSearch,
  onOpenAddTask,
  onOpenLogHabit,
  onOpenQuickNote,
  onOpenFileConverter,
  onOpenWeeklyReport,
}) => {
  const { currentSkin, skin } = useSkin();
  const insets = useSafeAreaInsets();
  const {
    profile,
    rings,
    todayTasks,
    habits,
    highlights,
    toggleTask,
    deleteTask,
    rescheduleTask,
    convertTaskToHabit,
    toggleHabitToday,
    skipHabitToday,
  } = useSmartDay();

  // Highlight of the day
  const highlightOfDay = highlights[0];

  // Render Inner Content
  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 110,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ==============================================
            1. TOP BAR: Date / Bell / 4 Skin Switcher Dots
           ============================================== */}
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.topDateText, { color: skin.inkMuted }]}>
              {currentSkin === 'ember' ? 'Tue, Jan 16' : 'TODAY, JAN 16'}
            </Text>
          </View>

          <View style={styles.topBarRight}>
            {/* 4 Palette Dots Switcher (Persistent) */}
            <SkinSwitcherDots />

            {/* Search Icon */}
            <TouchableOpacity onPress={onOpenSearch} style={[styles.circleActionBtn, { backgroundColor: skin.surfaceSubtle }]}>
              <Ionicons name="search" size={17} color={skin.ink} />
            </TouchableOpacity>

            {/* Bell in translucent circle (Ember style) */}
            <TouchableOpacity onPress={onNavigateToYou} style={[styles.circleActionBtn, { backgroundColor: skin.surfaceSubtle }]}>
              <Ionicons name="notifications-outline" size={18} color={skin.ink} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ==============================================
            2. HERO GREETING (Exact to Shot 1 Center Phone)
           ============================================== */}
        {currentSkin === 'ember' && (
          <View style={styles.emberHeroWrapper}>
            <Text style={styles.emberGreetingHeading}>
              Good morning, <Text style={styles.boldText}>Mia!</Text>
            </Text>
            <Text style={styles.emberGreetingBody}>
              You have <Text style={styles.boldUnderline}>3 tasks</Text> planned for today, including{' '}
              <Text style={styles.boldUnderline}>1 meeting</Text> at 8 am. Ready to begin? 🚀
            </Text>

            {/* Meta Row */}
            <View style={styles.emberMetaRow}>
              <Text style={styles.emberMetaText}>
                Today: <Text style={styles.whiteText}>2h 30m</Text> · Streak:{' '}
                <Text style={styles.whiteText}>35 days</Text>
              </Text>
            </View>
          </View>
        )}

        {/* HALO HERO (Shot 2 Style) */}
        {currentSkin === 'halo' && (
          <View style={[styles.haloHeroCard, { backgroundColor: skin.surface, borderRadius: skin.cardRadius }]}>
            <View style={styles.haloTopRow}>
              <View>
                <Text style={styles.haloHeroSub}>Overview</Text>
                <Text style={styles.haloHeroGreeting}>Good morning, Mia</Text>
              </View>
              <View style={styles.haloAvatarGroup}>
                <View style={[styles.avatarCircle, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={{ color: '#991B1B', fontWeight: 'bold' }}>M</Text>
                </View>
              </View>
            </View>
            <Text style={styles.haloHeroSummary}>
              3 tasks planned · 1 meeting at 8:00 AM · 35 days streak
            </Text>
          </View>
        )}

        {/* GROVE HERO (Shot 3 Style) */}
        {currentSkin === 'grove' && (
          <View style={styles.groveHeroWrapper}>
            {/* Weather Row: 23° · 70% chance of rain + avatar */}
            <View style={styles.groveWeatherRow}>
              <View style={styles.groveWeatherLeft}>
                <Ionicons name="thunderstorm-outline" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.groveTemp}>23°</Text>
                <Text style={styles.groveRainChance}>70% chance of rain</Text>
              </View>

              <TouchableOpacity onPress={onNavigateToYou} style={styles.groveAvatar}>
                <Ionicons name="person-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Week Chips: Selected WHITE rounded square, others dark translucent, count badges */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groveWeekScroll}>
              {[
                { day: 'Sun', date: 23, count: 2, selected: false },
                { day: 'Mon', date: 24, count: 4, selected: false },
                { day: 'Tue', date: 25, count: 3, selected: true }, // Today selected
                { day: 'Wed', date: 26, count: 5, selected: false },
                { day: 'Thu', date: 27, count: 3, selected: false },
              ].map((item) => (
                <View
                  key={item.date}
                  style={[
                    styles.groveWeekChip,
                    item.selected
                      ? styles.groveWeekChipSelected
                      : styles.groveWeekChipUnselected,
                  ]}
                >
                  {item.count > 0 && (
                    <View style={[styles.groveCountBadge, item.selected && { backgroundColor: '#111827' }]}>
                      <Text style={[styles.groveBadgeText, item.selected && { color: '#FFFFFF' }]}>
                        {item.count}
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.groveChipDate, item.selected && { color: '#111827' }]}>
                    {item.date}
                  </Text>
                  <Text style={[styles.groveChipDay, item.selected && { color: '#4B5563' }]}>
                    {item.day}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* NOIR HERO (Apple Health Style) */}
        {currentSkin === 'noir' && (
          <View style={[styles.noirHeroCard, { backgroundColor: skin.surface, borderRadius: skin.cardRadius }]}>
            <View style={styles.noirHeroHeader}>
              <View>
                <Text style={styles.noirTitle}>Daily Telemetry</Text>
                <Text style={styles.noirSub}>Summary & Rings</Text>
              </View>
              <Text style={{ color: skin.primary, fontWeight: '700' }}>{rings.streakDays}d Streak</Text>
            </View>
            <DailyRings rings={rings} size={180} />
          </View>
        )}

        {/* ==============================================
            3. SESSIONS CARD (Exact to Shot 1 Center Phone)
           ============================================== */}
        {currentSkin === 'ember' && (
          <View style={styles.emberSessionsSection}>
            <Text style={styles.emberSectionHeader}>Sessions</Text>

            {/* Session 1: Meeting with the team — 02:37:06 */}
            <View style={styles.emberBlackSessionCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.emberSessionTitle}>Meeting with the team</Text>
                <Text style={styles.emberSessionBigNumber}>02:37:06</Text>
              </View>
              <TouchableOpacity
                onPress={() => onNavigateToSessions(todayTasks[0])}
                activeOpacity={0.8}
                style={styles.emberPlayCircle}
              >
                <Ionicons name="play" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Session 2: First Screen Design — 02:23:42 */}
            <View style={[styles.emberBlackSessionCard, { marginTop: 12 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.emberSessionTitle}>First Screen Design</Text>
                <Text style={styles.emberSessionBigNumber}>02:23:42</Text>
              </View>
              <TouchableOpacity
                onPress={() => onNavigateToSessions(todayTasks[1])}
                activeOpacity={0.8}
                style={styles.emberPlayCircle}
              >
                <Ionicons name="play" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* GROVE: DAY TASKS (HORIZONTAL SNAP CARDS ~72% WIDTH, PEEK NEXT) */}
        {currentSkin === 'grove' && (
          <View style={styles.groveSection}>
            <View style={styles.groveSectionHeader}>
              <Text style={styles.groveSectionTitle}>Day tasks</Text>
              <TouchableOpacity onPress={onOpenAddTask} style={styles.groveAddBtn}>
                <Text style={styles.groveAddText}>Add task</Text>
              </TouchableOpacity>
            </View>

            {/* Horizontal Snap Cards */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width * 0.68 + 12}
              decelerationRate="fast"
              style={styles.groveSnapScroll}
            >
              {[
                { time: '8 - 10 AM', title: 'Check fruit\nfor insect', priority: 'Urgent', pColor: '#EA580C' },
                { time: '11 AM - 12 PM', title: 'Irrigate\nvegatable field', priority: 'Medium', pColor: '#EAB308' },
                { time: '12 - 13 PM', title: 'Irrigate\nberries', priority: 'Normal', pColor: '#4A5543' },
              ].map((card, idx) => (
                <View key={idx} style={[styles.groveTaskSnapCard, { width: width * 0.65 }]}>
                  <Text style={styles.groveTaskTime}>{card.time}</Text>
                  <Text style={styles.groveTaskTitle}>{card.title}</Text>
                  <View style={[styles.grovePriorityPill, { backgroundColor: card.pColor }]}>
                    <Text style={styles.grovePriorityText}>{card.priority}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Routines / Inventory 2-up Tiles */}
            <Text style={[styles.groveSectionTitle, { marginTop: 24, marginBottom: 12 }]}>
              Routines & Inventory
            </Text>
            <View style={styles.groveInventoryGrid}>
              <View style={styles.groveInventoryTile}>
                <Ionicons name="water-outline" size={22} color="#FFFFFF" style={{ marginBottom: 8 }} />
                <Text style={styles.groveTileTitle}>Regularly changing the engine oil</Text>
                <Text style={styles.groveTileSub}>John Deere 6M</Text>
              </View>
              <View style={styles.groveInventoryTile}>
                <Ionicons name="build-outline" size={22} color="#FFFFFF" style={{ marginBottom: 8 }} />
                <Text style={styles.groveTileTitle}>Tire inspection and replacement</Text>
                <Text style={styles.groveTileSub}>John Deere T560</Text>
              </View>
            </View>
          </View>
        )}

        {/* ==============================================
            4. QUICK ACTIONS GRID (6 Distinct Cards, 3x2)
           ============================================== */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: skin.ink }]}>Quick Actions</Text>
          <QuickActionsGrid
            onStartFocus={() => onNavigateToSessions()}
            onAddTask={onOpenAddTask}
            onLogHabit={onOpenLogHabit}
            onQuickNote={onOpenQuickNote}
            onConvertFile={onOpenFileConverter}
            onWeeklyReport={onOpenWeeklyReport}
          />
        </View>

        {/* ==============================================
            5. TODAY'S TOP TASKS
           ============================================== */}
        {currentSkin !== 'grove' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: skin.ink }]}>Today's Top Focus</Text>
              <TouchableOpacity onPress={onNavigateToPlan}>
                <Text style={{ color: skin.primary, fontWeight: '600', fontSize: 13 }}>See all</Text>
              </TouchableOpacity>
            </View>
            {todayTasks.slice(0, 3).map((task) => (
              <TaskStatusRow
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onReschedule={(id) => rescheduleTask(id, '14:00')}
                onConvertToHabit={convertTaskToHabit}
              />
            ))}
          </View>
        )}

        {/* ==============================================
            6. HABIT STREAKS WITH LEGEND
           ============================================== */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={[styles.sectionTitle, { color: skin.ink }]}>Habit Streaks</Text>
              <Text style={[styles.legendText, { color: skin.inkMuted }]}>
                Teal completed · Purple today · Empty missed · Gold freeze
              </Text>
            </View>
            <TouchableOpacity onPress={onOpenLogHabit}>
              <Ionicons name="add-circle" size={24} color={skin.primary} />
            </TouchableOpacity>
          </View>

          {habits.slice(0, 3).map((h) => (
            <HabitStreakRow
              key={h.id}
              habit={h}
              onToggleToday={toggleHabitToday}
              onSkipToday={skipHabitToday}
            />
          ))}
        </View>

        {/* ==============================================
            7. TREND STRIP (4 Mini Snap Cards)
           ============================================== */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: skin.ink }]}>Weekly Trends</Text>
          <TrendStrip onPressCard={onNavigateToMetrics} />
        </View>

        {/* ==============================================
            8. HIGHLIGHT OF THE DAY
           ============================================== */}
        {highlightOfDay && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: skin.ink }]}>Highlight of the Day</Text>
            <HighlightCard
              highlight={highlightOfDay}
              onActionPress={(target) => {
                if (target === 'focus') onNavigateToSessions();
                else if (target === 'plan') onNavigateToPlan();
                else onNavigateToMetrics();
              }}
            />
          </View>
        )}
      </ScrollView>
    );
  };

  // Wrap in appropriate full-bleed skin background
  if (currentSkin === 'ember') {
    return <EmberGradientBackground variant="home">{renderContent()}</EmberGradientBackground>;
  }

  if (currentSkin === 'grove') {
    return <TopoBackground>{renderContent()}</TopoBackground>;
  }

  return (
    <View style={[styles.container, { backgroundColor: skin.background }]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  topDateText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circleActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Ember Hero
  emberHeroWrapper: {
    paddingVertical: 12,
    marginBottom: 20,
  },
  emberGreetingHeading: {
    color: '#FFFFFF',
    fontSize: 32,
    letterSpacing: -1,
    lineHeight: 38,
  },
  emberGreetingBody: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 19,
    lineHeight: 28,
    marginTop: 8,
    letterSpacing: -0.3,
  },
  boldText: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  boldUnderline: {
    fontWeight: '800',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  emberMetaRow: {
    marginTop: 16,
  },
  emberMetaText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  whiteText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // Ember Sessions Black Cards
  emberSessionsSection: {
    marginBottom: 24,
  },
  emberSectionHeader: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  emberBlackSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F121C',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  emberSessionTitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  emberSessionBigNumber: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  emberPlayCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  // Halo Hero
  haloHeroCard: {
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  haloTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  haloHeroSub: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  haloHeroGreeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  haloAvatarGroup: {
    flexDirection: 'row',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloHeroSummary: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 12,
  },
  // Grove Hero & Tasks
  groveHeroWrapper: {
    marginBottom: 20,
  },
  groveWeatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  groveWeatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groveTemp: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginRight: 10,
  },
  groveRainChance: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  groveAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groveWeekScroll: {
    flexDirection: 'row',
  },
  groveWeekChip: {
    width: 60,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    position: 'relative',
  },
  groveWeekChipSelected: {
    backgroundColor: '#FFFFFF',
  },
  groveWeekChipUnselected: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  groveCountBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groveBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  groveChipDate: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  groveChipDay: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 2,
  },
  groveSection: {
    marginBottom: 24,
  },
  groveSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  groveSectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  groveAddBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  groveAddText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 12,
  },
  groveSnapScroll: {
    flexDirection: 'row',
  },
  groveTaskSnapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginRight: 12,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  groveTaskTime: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
  },
  groveTaskTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
    marginVertical: 8,
  },
  grovePriorityPill: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  grovePriorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  groveInventoryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  groveInventoryTile: {
    flex: 1,
    backgroundColor: '#272E22',
    borderRadius: 20,
    padding: 16,
  },
  groveTileTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 18,
  },
  groveTileSub: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    marginTop: 4,
  },
  // Noir Hero
  noirHeroCard: {
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#272B33',
  },
  noirHeroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  noirTitle: {
    color: '#F5F7FA',
    fontSize: 18,
    fontWeight: '700',
  },
  noirSub: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  legendText: {
    fontSize: 10,
    marginTop: 2,
  },
});
