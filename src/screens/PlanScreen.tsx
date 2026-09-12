// SmartDay Tab 2 — Plan / Calendar (Section 0.5, 0.6, 0.7, 0.8 Spec)
// Ember: Red-orange gradient, circular day cells (event orange ring, selected solid black), Start 08:02 / Finish 10:39.
// Halo: White calendar card, face-avatars on busy days, green dots, black time pills.
// Grove: Olive week chips with badges.
// Shared: Day timeline (focus blocks + meetings), time-to-leave chip, Eisenhower matrix toggle.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSkin } from '../skins/SkinContext';
import { EmberGradientBackground } from '../skins/backgrounds/EmberGradientBackground';
import { TopoBackground } from '../skins/backgrounds/TopoBackground';
import { useSmartDay } from '../context/SmartDayContext';
import { TaskStatusRow } from '../components/ui/TaskStatusRow';
import { Task } from '../types';

interface PlanScreenProps {
  onOpenAddTask: () => void;
  onOpenStartFocus: (task?: Task) => void;
  onNavigateToYou: () => void;
}

export const PlanScreen: React.FC<PlanScreenProps> = ({
  onOpenAddTask,
  onOpenStartFocus,
  onNavigateToYou,
}) => {
  const { currentSkin, skin } = useSkin();
  const insets = useSafeAreaInsets();
  const { tasks, sessions, toggleTask, deleteTask, rescheduleTask, convertTaskToHabit } = useSmartDay();

  const [selectedDay, setSelectedDay] = useState(16); // Jan 16 (Tuesday)
  const [viewMode, setViewMode] = useState<'timeline' | 'matrix'>('timeline');

  // Days in January calendar view
  // Selected = 16 (Tuesday)
  const calendarDays = [
    { num: 1, event: false }, { num: 2, event: false }, { num: 3, event: false }, { num: 4, event: false }, { num: 5, event: false }, { num: 6, event: false },
    { num: 7, event: true },  { num: 8, event: true },  { num: 9, event: true },  { num: 10, event: true }, { num: 11, event: false }, { num: 12, event: false }, { num: 13, event: true },
    { num: 14, event: true }, { num: 15, event: true }, { num: 16, event: true }, { num: 17, event: true }, { num: 18, event: false }, { num: 19, event: false }, { num: 20, event: false },
    { num: 21, event: false }, { num: 22, event: true }, { num: 23, event: true }, { num: 24, event: false }, { num: 25, event: false }, { num: 26, event: false }, { num: 27, event: false },
    { num: 28, event: false }, { num: 29, event: false }, { num: 30, event: false },
  ];

  // Render Plan Content
  const renderPlanContent = () => {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Text style={[styles.screenTitle, { color: skin.ink }]}>Calendar</Text>

            <View style={styles.topBarRight}>
              {/* Matrix Toggle */}
              <TouchableOpacity
                onPress={() => setViewMode((prev) => (prev === 'timeline' ? 'matrix' : 'timeline'))}
                style={[styles.matrixBtn, { backgroundColor: skin.surfaceSubtle }]}
              >
                <Ionicons name={viewMode === 'matrix' ? 'calendar-outline' : 'grid-outline'} size={18} color={skin.ink} />
              </TouchableOpacity>

              <TouchableOpacity onPress={onOpenAddTask} style={[styles.matrixBtn, { backgroundColor: skin.surfaceSubtle }]}>
                <Ionicons name="add" size={22} color={skin.ink} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ==============================================
              EMBER CALENDAR GRID (Exact to Shot 1 Left Phone)
             ============================================== */}
          {currentSkin === 'ember' && (
            <View style={styles.emberCalendarWrapper}>
              {/* Month Header */}
              <View style={styles.monthHeaderRow}>
                <Ionicons name="chevron-back" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.monthTitleText}>January</Text>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
              </View>

              {/* Weekday Letters: S M T W T F S */}
              <View style={styles.weekdayRow}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((letter, i) => (
                  <Text key={i} style={styles.weekdayLetter}>
                    {letter}
                  </Text>
                ))}
              </View>

              {/* Day Cells Grid */}
              <View style={styles.emberDaysGrid}>
                {calendarDays.map((day) => {
                  const isSelected = day.num === selectedDay;
                  return (
                    <TouchableOpacity
                      key={day.num}
                      onPress={() => setSelectedDay(day.num)}
                      activeOpacity={0.8}
                      style={[
                        styles.emberDayCell,
                        // Event days have orange ring
                        day.event && !isSelected && styles.emberEventRing,
                        // Selected / today has SOLID BLACK circle + white text
                        isSelected && styles.emberSelectedBlack,
                      ]}
                    >
                      <Text
                        style={[
                          styles.emberDayText,
                          isSelected && styles.emberSelectedText,
                          day.event && !isSelected && styles.emberEventText,
                        ]}
                      >
                        {day.num}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Meeting Cards with Start/Finish Large Type & Avatars (Shot 1) */}
              <View style={styles.emberMeetingsContainer}>
                {/* Meeting 1: Meeting with the team (Start 08:02 Finish 10:39) */}
                <View style={styles.emberMeetingCard}>
                  <View style={styles.meetingCardTop}>
                    <Text style={styles.meetingCardTitle}>Meeting with the team</Text>
                    {/* Overlapping Avatars */}
                    <View style={styles.avatarRow}>
                      <View style={[styles.miniAvatar, { backgroundColor: '#3B82F6', zIndex: 3 }]}>
                        <Text style={styles.avatarLetter}>A</Text>
                      </View>
                      <View style={[styles.miniAvatar, { backgroundColor: '#10B981', marginLeft: -8, zIndex: 2 }]}>
                        <Text style={styles.avatarLetter}>T</Text>
                      </View>
                      <View style={[styles.miniAvatar, { backgroundColor: '#8B5CF6', marginLeft: -8, zIndex: 1 }]}>
                        <Text style={styles.avatarLetter}>M</Text>
                      </View>
                    </View>
                  </View>

                  {/* Start / Finish Times */}
                  <View style={styles.timeBlockRow}>
                    <View>
                      <Text style={styles.timeBlockLabel}>Start</Text>
                      <Text style={styles.timeBlockValue}>08:02</Text>
                    </View>
                    <View>
                      <Text style={styles.timeBlockLabel}>Finish</Text>
                      <Text style={styles.timeBlockValue}>10:39</Text>
                    </View>
                  </View>
                </View>

                {/* Meeting 2: First Screen Design */}
                <View style={[styles.emberMeetingCard, { marginTop: 12 }]}>
                  <View style={styles.meetingCardTop}>
                    <Text style={styles.meetingCardTitle}>First Screen Design</Text>
                    <View style={styles.avatarRow}>
                      <View style={[styles.miniAvatar, { backgroundColor: '#EC4899', zIndex: 2 }]}>
                        <Text style={styles.avatarLetter}>M</Text>
                      </View>
                      <View style={[styles.miniAvatar, { backgroundColor: '#6366F1', marginLeft: -8, zIndex: 1 }]}>
                        <Text style={styles.avatarLetter}>D</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.timeBlockRow}>
                    <View>
                      <Text style={styles.timeBlockLabel}>Start</Text>
                      <Text style={styles.timeBlockValue}>11:00</Text>
                    </View>
                    <View>
                      <Text style={styles.timeBlockLabel}>Finish</Text>
                      <Text style={styles.timeBlockValue}>13:30</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* ==============================================
              HALO CALENDAR (Exact to Shot 2 Right Phone)
             ============================================== */}
          {currentSkin === 'halo' && (
            <View style={[styles.haloCard, { backgroundColor: skin.surface, borderRadius: skin.cardRadius }]}>
              <View style={styles.haloMonthRow}>
                <Text style={styles.haloMonthText}>May 2026</Text>
                <Text style={styles.haloThisMonthText}>This Month</Text>
              </View>

              {/* Weekday Row */}
              <View style={styles.haloWeekRow}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, idx) => (
                  <Text key={idx} style={styles.haloWeekLetter}>{l}</Text>
                ))}
              </View>

              {/* Days Grid with Face-Avatars on Busy Days */}
              <View style={styles.haloDaysGrid}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => {
                  const isBlackCircle = num === 16;
                  const hasAvatar = num === 2 || num === 15 || num === 18 || num === 22 || num === 31;
                  return (
                    <View
                      key={num}
                      style={[
                        styles.haloDayCell,
                        isBlackCircle && styles.haloBlackCircle,
                      ]}
                    >
                      {hasAvatar ? (
                        <View style={styles.haloAvatarDay}>
                          <Text style={{ fontSize: 10 }}>👤</Text>
                        </View>
                      ) : (
                        <Text style={[styles.haloDayText, isBlackCircle && { color: '#FFFFFF' }]}>
                          {num}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Event Rows with Logo Tile + Title + Black Time Pill (Shot 2) */}
              <Text style={styles.haloTodayHeading}>Today · 7 Tasks</Text>
              {[
                { title: 'Zoom Call', sub: 'API Integration', time: '4:30 PM', icon: 'videocam', bg: '#EFF6FF', color: '#2563EB' },
                { title: 'Google Meet', sub: 'Navbar Design', time: '8:30 AM', icon: 'videocam', bg: '#ECFDF5', color: '#059669' },
                { title: 'Microsoft Teams', sub: 'Sprint Review', time: '5:20 PM', icon: 'chatbubbles', bg: '#F5F3FF', color: '#7C3AED' },
              ].map((ev, idx) => (
                <View key={idx} style={styles.haloEventRow}>
                  <View style={[styles.haloLogoBox, { backgroundColor: ev.bg }]}>
                    <Ionicons name={ev.icon as any} size={18} color={ev.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.haloEventTitle}>{ev.title}</Text>
                    <Text style={styles.haloEventSub}>{ev.sub}</Text>
                  </View>
                  <View style={styles.haloBlackTimePill}>
                    <Text style={styles.haloPillText}>{ev.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ==============================================
              EISENHOWER MATRIX VIEW TOGGLE (F20 Spec)
             ============================================== */}
          {viewMode === 'matrix' && (
            <View style={styles.matrixContainer}>
              <Text style={[styles.matrixHeading, { color: skin.ink }]}>Eisenhower Decision Matrix</Text>
              <View style={styles.matrixGrid}>
                <View style={[styles.matrixQuadrant, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444' }]}>
                  <Text style={[styles.quadrantTitle, { color: '#EF4444' }]}>Do First (Urgent & Important)</Text>
                  {tasks.filter((t) => t.priority === 'High').map((t) => (
                    <Text key={t.id} numberOfLines={1} style={[styles.matrixTaskText, { color: skin.ink }]}>• {t.title}</Text>
                  ))}
                </View>

                <View style={[styles.matrixQuadrant, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B' }]}>
                  <Text style={[styles.quadrantTitle, { color: '#F59E0B' }]}>Schedule (Not Urgent, Important)</Text>
                  {tasks.filter((t) => t.priority === 'Med').map((t) => (
                    <Text key={t.id} numberOfLines={1} style={[styles.matrixTaskText, { color: skin.ink }]}>• {t.title}</Text>
                  ))}
                </View>

                <View style={[styles.matrixQuadrant, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6' }]}>
                  <Text style={[styles.quadrantTitle, { color: '#3B82F6' }]}>Delegate (Urgent, Not Important)</Text>
                  <Text style={{ color: skin.inkMuted, fontSize: 11 }}>No pending delegations</Text>
                </View>

                <View style={[styles.matrixQuadrant, { backgroundColor: 'rgba(107, 114, 128, 0.15)', borderColor: '#6B7280' }]}>
                  <Text style={[styles.quadrantTitle, { color: '#9CA3AF' }]}>Don't Do (Eliminate)</Text>
                  <Text style={{ color: skin.inkMuted, fontSize: 11 }}>Inbox zero-ish</Text>
                </View>
              </View>
            </View>
          )}

          {/* Time to Leave Chip (F02) */}
          <View style={[styles.leaveChip, { backgroundColor: skin.surfaceSubtle }]}>
            <Ionicons name="car-outline" size={16} color={skin.primary} style={{ marginRight: 8 }} />
            <Text style={{ color: skin.ink, fontSize: 13, fontWeight: '700' }}>Leave in 12 min</Text>
            <Text style={{ color: skin.inkMuted, fontSize: 12, marginLeft: 6 }}>for Meeting with the team</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  if (currentSkin === 'ember') {
    return <EmberGradientBackground variant="calendar">{renderPlanContent()}</EmberGradientBackground>;
  }

  if (currentSkin === 'grove') {
    return <TopoBackground>{renderPlanContent()}</TopoBackground>;
  }

  return (
    <View style={[styles.container, { backgroundColor: skin.background }]}>
      {renderPlanContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matrixBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Ember Calendar Grid
  emberCalendarWrapper: {
    marginBottom: 20,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  monthTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  weekdayLetter: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
    fontWeight: '700',
    width: 38,
    textAlign: 'center',
  },
  emberDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 6,
  },
  emberDayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emberEventRing: {
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  emberSelectedBlack: {
    backgroundColor: '#111827',
  },
  emberDayText: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 13,
    fontWeight: '600',
  },
  emberEventText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emberSelectedText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  // Ember Meeting Card (Shot 1)
  emberMeetingsContainer: {
    marginTop: 24,
  },
  emberMeetingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  meetingCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  meetingCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  avatarRow: {
    flexDirection: 'row',
  },
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  timeBlockRow: {
    flexDirection: 'row',
    gap: 40,
  },
  timeBlockLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timeBlockValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  // Halo Calendar
  haloCard: {
    padding: 20,
    marginBottom: 20,
  },
  haloMonthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  haloMonthText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  haloThisMonthText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  haloWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  haloWeekLetter: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
    width: 36,
    textAlign: 'center',
  },
  haloDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 6,
  },
  haloDayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloBlackCircle: {
    backgroundColor: '#111827',
  },
  haloAvatarDay: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloDayText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  haloTodayHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  haloEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  haloLogoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  haloEventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  haloEventSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  haloBlackTimePill: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  haloPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  // Matrix View
  matrixContainer: {
    marginVertical: 16,
  },
  matrixHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  matrixQuadrant: {
    width: '48%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 110,
  },
  quadrantTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  matrixTaskText: {
    fontSize: 12,
    marginVertical: 2,
  },
  leaveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 16,
  },
});
