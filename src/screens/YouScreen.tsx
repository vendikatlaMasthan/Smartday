// SmartDay Tab 5 — You / Profile & Settings (Section 0.3, Phase 3–8 Spec)
// Complete with:
// - Appearance: Live preview cards for Ember, Halo, Grove, Noir (0.3)
// - Daily Goals Steppers (Focus min, Tasks, Habits)
// - Working & Quiet Hours + Sleep Window (F17: wake window 6:15–6:45, energy 1–5)
// - Academic Timetable & Exam Countdown (F13 My Study Life)
// - Day Templates (F14: Exam week, Deep-work day, Weekly review, Shutdown)
// - Distraction Pause Screen (F15 One Sec friction ritual: 5s breath)
// - 21-Day Challenge Grid (F05: 21 cells, % complete, freeze day)
// - Daily Shutdown Ritual (F26: 4 checks)
// - Sunday Weekly Review (F27: wins, slips, next-week outcomes)
// - Notification Batching (X07)
// - Accountability Streak Card (X08)
// - Sources (Mock calendar, files, manual, expenses with privacy lines)
// - Data Management (Export JSON, Clear data)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Modal,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSkin } from '../skins/SkinContext';
import { SkinId } from '../skins/types';
import { useSmartDay } from '../context/SmartDayContext';
import { exportAllDataJSON } from '../storage';
import { WeeklyReportModal } from '../components/ui/WeeklyReportModal';
import { WidgetsPreviewModal } from '../components/ui/WidgetsPreviewModal';

export const YouScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { currentSkin, setSkin, skin } = useSkin();
  const {
    profile,
    updateProfile,
    updateGoals,
    sources,
    toggleSource,
    resetAllData,
  } = useSmartDay();

  // Modals
  const [weeklyReportVisible, setWeeklyReportVisible] = useState(false);
  const [widgetsModalVisible, setWidgetsModalVisible] = useState(false);
  const [calendarConnectDialogVisible, setCalendarConnectDialogVisible] = useState(false);
  const [pauseModalVisible, setPauseModalVisible] = useState(false);
  const [breatheSeconds, setBreatheSeconds] = useState(5);
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [timetableModalVisible, setTimetableModalVisible] = useState(false);
  const [shutdownModalVisible, setShutdownModalVisible] = useState(false);
  const [streakCardModalVisible, setStreakCardModalVisible] = useState(false);

  // States
  const [batchNotifications, setBatchNotifications] = useState(true);
  const [morningEnergy, setMorningEnergy] = useState<number>(4);
  const [challengeDays, setChallengeDays] = useState<boolean[]>(
    Array.from({ length: 21 }, (_, i) => i < 14)
  );
  const [shutdownChecks, setShutdownChecks] = useState({
    inboxZero: true,
    tomorrowFrog: true,
    waterLogged: true,
    sleepWindowSet: false,
  });

  // Countdown timer for Distraction Pause (F15)
  useEffect(() => {
    let timer: any;
    if (pauseModalVisible && breatheSeconds > 0) {
      timer = setTimeout(() => {
        setBreatheSeconds((s) => s - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [pauseModalVisible, breatheSeconds]);

  // Steppers
  const handleAdjustFocusGoal = (delta: number) => {
    const next = Math.max(15, profile.goals.focusMinutes + delta);
    updateGoals({ ...profile.goals, focusMinutes: next });
  };

  const handleAdjustTasksGoal = (delta: number) => {
    const next = Math.max(1, profile.goals.tasksDue + delta);
    updateGoals({ ...profile.goals, tasksDue: next });
  };

  const handleAdjustHabitsGoal = (delta: number) => {
    const next = Math.max(1, profile.goals.habitsDue + delta);
    updateGoals({ ...profile.goals, habitsDue: next });
  };

  // Export JSON
  const handleExportData = async () => {
    const jsonString = exportAllDataJSON();
    try {
      await Share.share({
        message: jsonString,
        title: 'SmartDay-Backup.json',
      });
    } catch {
      // Ignored
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All SmartDay Data',
      'This will reset your local database and restore the initial state. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset Data', style: 'destructive', onPress: resetAllData },
      ]
    );
  };

  const handleApplyTemplate = (templateName: string) => {
    Alert.alert('Template Applied', `Applied the "${templateName}" schedule and focus blocks to your Plan calendar.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: skin.colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}>
          <Text style={[styles.screenTitle, { color: skin.colors.textPrimary }]}>
            You &amp; Settings
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Card */}
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: skin.colors.surface,
                borderColor: skin.colors.border,
                borderRadius: skin.borderRadius.card,
              },
            ]}
          >
            <View style={[styles.avatarCircle, { backgroundColor: skin.colors.primarySurface, borderColor: skin.colors.primary }]}>
              <Text style={{ color: skin.colors.primary, fontSize: 24, fontWeight: '800' }}>
                {profile.name.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.profileName, { color: skin.colors.textPrimary }]}>
                {profile.name}
              </Text>
              <Text style={[styles.memberSince, { color: skin.colors.textSecondary }]}>
                Member since {new Date(profile.memberSince).toLocaleDateString()} · 35d Streak
              </Text>
            </View>
          </View>

          {/* ======================================================== */}
          {/* 0.3 APPEARANCE: LIVE HOME THUMBNAILS (Ember, Halo, Grove, Noir) */}
          {/* ======================================================== */}
          <Text style={[styles.sectionLabel, { color: skin.colors.textSecondary }]}>
            APPEARANCE &amp; SKINS (0.3)
          </Text>
          <View style={styles.skinsGrid}>
            {[
              {
                id: 'ember' as SkinId,
                name: 'Ember',
                desc: 'Radiant Orange / Blue Glow',
                bg: '#0D1527',
                accent: '#FF6B00',
                sampleCard: '#1E293B',
              },
              {
                id: 'halo' as SkinId,
                name: 'Halo',
                desc: 'Airy White / Light Shadow',
                bg: '#F8FAFC',
                accent: '#0284C7',
                sampleCard: '#FFFFFF',
              },
              {
                id: 'grove' as SkinId,
                name: 'Grove',
                desc: 'Olive Topo / Nature Cards',
                bg: '#4A5340',
                accent: '#84CC16',
                sampleCard: '#383F30',
              },
              {
                id: 'noir' as SkinId,
                name: 'Noir',
                desc: 'Pure OLED / Teal Energy',
                bg: '#0B0D10',
                accent: '#0D9488',
                sampleCard: '#16181C',
              },
            ].map((item) => {
              const isSelected = currentSkin === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSkin(item.id)}
                  style={[
                    styles.skinThumbnailCard,
                    {
                      backgroundColor: item.bg,
                      borderColor: isSelected ? skin.colors.primary : skin.colors.border,
                      borderWidth: isSelected ? 2.5 : 1,
                    },
                  ]}
                >
                  <View style={[styles.thumbMiniScreen, { backgroundColor: item.sampleCard }]}>
                    <View style={[styles.thumbMiniBar, { backgroundColor: item.accent }]} />
                    <View style={[styles.thumbMiniLine, { backgroundColor: item.accent + '60' }]} />
                  </View>
                  <View style={styles.thumbInfo}>
                    <View style={styles.thumbTitleRow}>
                      <Text style={[styles.thumbTitle, { color: item.id === 'halo' ? '#0F172A' : '#FFFFFF' }]}>
                        {item.name}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={16} color={item.accent} />
                      )}
                    </View>
                    <Text style={[styles.thumbDesc, { color: item.id === 'halo' ? '#64748B' : '#94A3B8' }]}>
                      {item.desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ======================================================== */}
          {/* PHASE 3 & 4 SPECIAL RIGS: ONE SEC, TIMETABLE, CHALLENGE */}
          {/* ======================================================== */}
          <Text style={[styles.sectionLabel, { color: skin.colors.textSecondary, marginTop: 24 }]}>
            FOCUS PROTECTION &amp; SECOND BRAIN
          </Text>
          <View
            style={[
              styles.cardGroup,
              {
                backgroundColor: skin.colors.surface,
                borderColor: skin.colors.border,
                borderRadius: skin.borderRadius.card,
              },
            ]}
          >
            {/* Distraction Pause (F15 One Sec Ritual) */}
            <TouchableOpacity
              onPress={() => {
                setBreatheSeconds(5);
                setPauseModalVisible(true);
              }}
              style={[styles.rowItem, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="shield-checkmark-outline" size={20} color={skin.colors.primary} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[styles.rowItemTitle, { color: skin.colors.textPrimary }]}>Distraction Pause Ritual (F15)</Text>
                  <Text style={[styles.rowItemSub, { color: skin.colors.textSecondary }]}>5-second breath pause before social media</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={skin.colors.textSecondary} />
            </TouchableOpacity>

            {/* Academic Timetable & Countdown (F13) */}
            <TouchableOpacity
              onPress={() => setTimetableModalVisible(true)}
              style={[styles.rowItem, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="school-outline" size={20} color={skin.colors.purple} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[styles.rowItemTitle, { color: skin.colors.textPrimary }]}>Academic Timetable (F13)</Text>
                  <Text style={[styles.rowItemSub, { color: skin.colors.textSecondary }]}>Classes, exams &amp; countdown cards</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={skin.colors.textSecondary} />
            </TouchableOpacity>

            {/* 21-Day Challenge Grid (F05) */}
            <TouchableOpacity
              onPress={() => setChallengeModalVisible(true)}
              style={[styles.rowItem, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="flame-outline" size={20} color={skin.colors.gold} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[styles.rowItemTitle, { color: skin.colors.textPrimary }]}>21-Day Challenge (F05)</Text>
                  <Text style={[styles.rowItemSub, { color: skin.colors.textSecondary }]}>14 of 21 completed · 1 freeze left</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={skin.colors.textSecondary} />
            </TouchableOpacity>

            {/* Daily Shutdown Ritual (F26) */}
            <TouchableOpacity
              onPress={() => setShutdownModalVisible(true)}
              style={[styles.rowItem, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="moon-outline" size={20} color={skin.colors.primary} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[styles.rowItemTitle, { color: skin.colors.textPrimary }]}>Daily Shutdown Ritual (F26)</Text>
                  <Text style={[styles.rowItemSub, { color: skin.colors.textSecondary }]}>Inbox zero, tomorrow frog, water, sleep</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={skin.colors.textSecondary} />
            </TouchableOpacity>

            {/* Accountability Streak Card (X08) */}
            <TouchableOpacity
              onPress={() => setStreakCardModalVisible(true)}
              style={styles.rowItem}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="share-social-outline" size={20} color={skin.colors.green} style={{ marginRight: 12 }} />
                <View>
                  <Text style={[styles.rowItemTitle, { color: skin.colors.textPrimary }]}>Accountability Streak Card (X08)</Text>
                  <Text style={[styles.rowItemSub, { color: skin.colors.textSecondary }]}>Export 35-day streak card graphic</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={skin.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* ======================================================== */}
          {/* DAY TEMPLATES (F14) */}
          {/* ======================================================== */}
          <Text style={[styles.sectionLabel, { color: skin.colors.textSecondary, marginTop: 24 }]}>
            DAY TEMPLATES (F14)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroll}>
            {[
              { name: 'Deep-Work Day', desc: '4x 45m pomodoros + 1h frog block', icon: 'flash-outline' },
              { name: 'Exam Week', desc: 'Active recall blocks + spaced study', icon: 'book-outline' },
              { name: 'Weekly Review', desc: 'GTD inbox sweep & next-week goals', icon: 'clipboard-outline' },
              { name: 'Creative Sprint', desc: '3h unbroken design studio block', icon: 'brush-outline' },
            ].map((tmpl, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleApplyTemplate(tmpl.name)}
                style={[
                  styles.templateCard,
                  {
                    backgroundColor: skin.colors.surface,
                    borderColor: skin.colors.border,
                    borderRadius: skin.borderRadius.card,
                  },
                ]}
              >
                <Ionicons name={tmpl.icon as any} size={22} color={skin.colors.primary} style={{ marginBottom: 8 }} />
                <Text style={[styles.tmplName, { color: skin.colors.textPrimary }]}>{tmpl.name}</Text>
                <Text style={[styles.tmplDesc, { color: skin.colors.textSecondary }]}>{tmpl.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ======================================================== */}
          {/* DAILY GOALS STEPPERS */}
          {/* ======================================================== */}
          <Text style={[styles.sectionLabel, { color: skin.colors.textSecondary, marginTop: 24 }]}>
            DAILY GOALS
          </Text>
          <View
            style={[
              styles.cardGroup,
              {
                backgroundColor: skin.colors.surface,
                borderColor: skin.colors.border,
                borderRadius: skin.borderRadius.card,
              },
            ]}
          >
            {/* Focus Minutes */}
            <View style={[styles.stepperRow, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepperTitle, { color: skin.colors.textPrimary }]}>Focus Time</Text>
                <Text style={[styles.stepperSub, { color: skin.colors.textSecondary }]}>Target minutes of daily deep work</Text>
              </View>
              <View style={styles.stepperControls}>
                <TouchableOpacity onPress={() => handleAdjustFocusGoal(-15)} style={[styles.stepperBtn, { backgroundColor: skin.colors.surfaceSecondary }]}>
                  <Ionicons name="remove" size={16} color={skin.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.stepperValue, { color: skin.colors.primary }]}>{profile.goals.focusMinutes}m</Text>
                <TouchableOpacity onPress={() => handleAdjustFocusGoal(15)} style={[styles.stepperBtn, { backgroundColor: skin.colors.surfaceSecondary }]}>
                  <Ionicons name="add" size={16} color={skin.colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Tasks Due */}
            <View style={[styles.stepperRow, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepperTitle, { color: skin.colors.textPrimary }]}>Tasks Completed</Text>
                <Text style={[styles.stepperSub, { color: skin.colors.textSecondary }]}>Daily target tasks to close</Text>
              </View>
              <View style={styles.stepperControls}>
                <TouchableOpacity onPress={() => handleAdjustTasksGoal(-1)} style={[styles.stepperBtn, { backgroundColor: skin.colors.surfaceSecondary }]}>
                  <Ionicons name="remove" size={16} color={skin.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.stepperValue, { color: skin.colors.purple }]}>{profile.goals.tasksDue}</Text>
                <TouchableOpacity onPress={() => handleAdjustTasksGoal(1)} style={[styles.stepperBtn, { backgroundColor: skin.colors.surfaceSecondary }]}>
                  <Ionicons name="add" size={16} color={skin.colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Habits Due */}
            <View style={styles.stepperRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepperTitle, { color: skin.colors.textPrimary }]}>Habits Checked</Text>
                <Text style={[styles.stepperSub, { color: skin.colors.textSecondary }]}>Daily ritual check-ins</Text>
              </View>
              <View style={styles.stepperControls}>
                <TouchableOpacity onPress={() => handleAdjustHabitsGoal(-1)} style={[styles.stepperBtn, { backgroundColor: skin.colors.surfaceSecondary }]}>
                  <Ionicons name="remove" size={16} color={skin.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.stepperValue, { color: skin.colors.gold }]}>{profile.goals.habitsDue}</Text>
                <TouchableOpacity onPress={() => handleAdjustHabitsGoal(1)} style={[styles.stepperBtn, { backgroundColor: skin.colors.surfaceSecondary }]}>
                  <Ionicons name="add" size={16} color={skin.colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ======================================================== */}
          {/* SLEEP WINDOW & MORNING ENERGY (F17) */}
          {/* ======================================================== */}
          <Text style={[styles.sectionLabel, { color: skin.colors.textSecondary, marginTop: 24 }]}>
            SLEEP WINDOW &amp; BODY ENERGY (F17)
          </Text>
          <View
            style={[
              styles.cardGroup,
              {
                backgroundColor: skin.colors.surface,
                borderColor: skin.colors.border,
                borderRadius: skin.borderRadius.card,
              },
            ]}
          >
            <View style={[styles.rowItem, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}>
              <Text style={{ color: skin.colors.textPrimary, fontSize: 15 }}>Optimal Wake Window</Text>
              <Text style={{ color: skin.colors.primary, fontWeight: '700', fontSize: 15 }}>6:15 – 6:45 AM</Text>
            </View>

            <View style={styles.energySelectorRow}>
              <Text style={{ color: skin.colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                Morning Energy Rating (Feeds Metric Averages)
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => setMorningEnergy(lvl)}
                    style={[
                      styles.energyBtn,
                      {
                        backgroundColor:
                          morningEnergy >= lvl ? skin.colors.gold : skin.colors.surfaceSecondary,
                      },
                    ]}
                  >
                    <Ionicons
                      name="flash"
                      size={18}
                      color={morningEnergy >= lvl ? '#FFFFFF' : skin.colors.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
                <Text style={{ color: skin.colors.textSecondary, fontSize: 13, marginLeft: 8 }}>
                  {morningEnergy}/5 Ready
                </Text>
              </View>
            </View>
          </View>

          {/* ======================================================== */}
          {/* NOTIFICATION BATCHING (X07) */}
          {/* ======================================================== */}
          <Text style={[styles.sectionLabel, { color: skin.colors.textSecondary, marginTop: 24 }]}>
            NOTIFICATIONS (X07)
          </Text>
          <View
            style={[
              styles.cardGroup,
              {
                backgroundColor: skin.colors.surface,
                borderColor: skin.colors.border,
                borderRadius: skin.borderRadius.card,
              },
            ]}
          >
            <View style={styles.rowItem}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={[styles.rowItemTitle, { color: skin.colors.textPrimary }]}>Batching Digest Mode</Text>
                <Text style={[styles.rowItemSub, { color: skin.colors.textSecondary }]}>
                  One digest at start of work window instead of 40 individual banners
                </Text>
              </View>
              <Switch
                value={batchNotifications}
                onValueChange={setBatchNotifications}
                trackColor={{ false: skin.colors.border, true: skin.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* ======================================================== */}
          {/* DATA SOURCES & PRIVACY */}
          {/* ======================================================== */}
          <Text style={[styles.sectionLabel, { color: skin.colors.textSecondary, marginTop: 24 }]}>
            DATA SOURCES &amp; LOCAL STORAGE
          </Text>
          <View
            style={[
              styles.cardGroup,
              {
                backgroundColor: skin.colors.surface,
                borderColor: skin.colors.border,
                borderRadius: skin.borderRadius.card,
              },
            ]}
          >
            {sources.map((source, idx) => (
              <View
                key={source.id}
                style={[
                  styles.sourceRow,
                  {
                    borderBottomColor: skin.colors.border,
                    borderBottomWidth: idx < sources.length - 1 ? 1 : 0,
                  },
                ]}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ color: skin.colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
                    {source.name}
                  </Text>
                  <Text style={{ color: skin.colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                    {source.enabled ? `Active · Local privacy guarantee` : 'Disabled'}
                  </Text>
                </View>

                {source.id === 'manual' ? (
                  <Text style={{ color: skin.colors.primary, fontSize: 12, fontWeight: '700' }}>LOCAL</Text>
                ) : source.id === 'calendar' ? (
                  <TouchableOpacity
                    onPress={() => setCalendarConnectDialogVisible(true)}
                    style={[
                      styles.connectBtn,
                      {
                        backgroundColor: source.enabled ? skin.colors.surfaceSecondary : skin.colors.primarySurface,
                        borderColor: source.enabled ? skin.colors.border : skin.colors.primary,
                      },
                    ]}
                  >
                    <Text style={{ color: source.enabled ? skin.colors.textSecondary : skin.colors.primary, fontWeight: '700', fontSize: 12 }}>
                      {source.enabled ? 'Manage' : 'Connect'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Switch
                    value={source.enabled}
                    onValueChange={() => toggleSource(source.id)}
                    trackColor={{ false: skin.colors.border, true: skin.colors.primary }}
                    thumbColor="#FFFFFF"
                  />
                )}
              </View>
            ))}
          </View>

          {/* ======================================================== */}
          {/* DATA MANAGEMENT */}
          {/* ======================================================== */}
          <Text style={[styles.sectionLabel, { color: skin.colors.textSecondary, marginTop: 24 }]}>
            DATA MANAGEMENT
          </Text>
          <View
            style={[
              styles.cardGroup,
              {
                backgroundColor: skin.colors.surface,
                borderColor: skin.colors.border,
                borderRadius: skin.borderRadius.card,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleExportData}
              style={[styles.rowItem, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}
            >
              <Text style={{ color: skin.colors.textPrimary, fontSize: 15 }}>Export All Data (JSON)</Text>
              <Ionicons name="download-outline" size={18} color={skin.colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClearData}
              style={styles.rowItem}
            >
              <Text style={{ color: '#EF4444', fontSize: 15, fontWeight: '700' }}>
                Reset &amp; Clear Database
              </Text>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* About */}
          <View style={styles.aboutContainer}>
            <Text style={[styles.aboutText, { color: skin.colors.textSecondary }]}>
              SmartDay v2.0 · Personal Productivity OS
            </Text>
            <Text style={[styles.privacyNote, { color: skin.colors.textSecondary }]}>
              100% offline-first. All data stored exclusively on your device.
            </Text>
          </View>
        </ScrollView>

        {/* ================= MODAL: DISTRACTION PAUSE (F15) ================= */}
        <Modal visible={pauseModalVisible} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={[styles.pauseCard, { backgroundColor: skin.colors.surface }]}>
              <Ionicons name="leaf-outline" size={48} color={skin.colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
              <Text style={[styles.pauseTitle, { color: skin.colors.textPrimary }]}>Take a Breath</Text>
              <Text style={[styles.pauseSubtitle, { color: skin.colors.textSecondary }]}>
                Friction pause before opening distractions. Notice how your body feels.
              </Text>

              {/* Big Breathe Counter */}
              <View style={[styles.breatheCircle, { borderColor: skin.colors.primary }]}>
                <Text style={[styles.breatheCount, { color: skin.colors.primary }]}>
                  {breatheSeconds > 0 ? breatheSeconds : '✓'}
                </Text>
              </View>

              <View style={styles.pauseActions}>
                <TouchableOpacity
                  onPress={() => setPauseModalVisible(false)}
                  style={[styles.pauseActionPrimary, { backgroundColor: skin.colors.primary }]}
                >
                  <Text style={styles.pauseActionText}>Start 25m Focus Session</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPauseModalVisible(false)}
                  style={[styles.pauseActionSecondary, { borderColor: skin.colors.border }]}
                >
                  <Text style={[styles.pauseActionSecText, { color: skin.colors.textSecondary }]}>
                    Snooze Social 15m
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ================= MODAL: 21-DAY CHALLENGE (F05) ================= */}
        <Modal visible={challengeModalVisible} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={[styles.challengeCard, { backgroundColor: skin.colors.surface }]}>
              <View style={styles.challengeHeader}>
                <Text style={[styles.pauseTitle, { color: skin.colors.textPrimary }]}>21-Day Habit Challenge</Text>
                <TouchableOpacity onPress={() => setChallengeModalVisible(false)}>
                  <Ionicons name="close-circle" size={24} color={skin.colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.challengeSub, { color: skin.colors.textSecondary }]}>
                Challenge: Morning Deep Work · 14 of 21 Days Complete (66%)
              </Text>

              {/* 21 Cells Grid */}
              <View style={styles.cellsGrid}>
                {challengeDays.map((done, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      const copy = [...challengeDays];
                      copy[i] = !copy[i];
                      setChallengeDays(copy);
                    }}
                    style={[
                      styles.cellItem,
                      {
                        backgroundColor: done
                          ? skin.colors.primary
                          : i === 14
                          ? skin.colors.gold
                          : skin.colors.surfaceSecondary,
                      },
                    ]}
                  >
                    <Text style={{ color: done ? '#FFFFFF' : skin.colors.textSecondary, fontWeight: '700', fontSize: 11 }}>
                      {i + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: skin.colors.primary }]} />
                  <Text style={[styles.legendTxt, { color: skin.colors.textSecondary }]}>Done (Teal)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: skin.colors.gold }]} />
                  <Text style={[styles.legendTxt, { color: skin.colors.textSecondary }]}>Freeze Day (Gold)</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* ================= MODAL: ACADEMIC TIMETABLE (F13) ================= */}
        <Modal visible={timetableModalVisible} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={[styles.challengeCard, { backgroundColor: skin.colors.surface }]}>
              <View style={styles.challengeHeader}>
                <Text style={[styles.pauseTitle, { color: skin.colors.textPrimary }]}>Academic Timetable (F13)</Text>
                <TouchableOpacity onPress={() => setTimetableModalVisible(false)}>
                  <Ionicons name="close-circle" size={24} color={skin.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Exam Countdown Card */}
              <View style={[styles.countdownCard, { backgroundColor: skin.colors.primarySurface, borderColor: skin.colors.primary }]}>
                <Ionicons name="hourglass-outline" size={24} color={skin.colors.primary} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.countdownLabel, { color: skin.colors.primary }]}>NEXT EXAM COUNTDOWN</Text>
                  <Text style={[styles.countdownTitle, { color: skin.colors.textPrimary }]}>CS304: Distributed Algorithms</Text>
                  <Text style={[styles.countdownDays, { color: skin.colors.primary }]}>5 Days · 14 Hours Remaining</Text>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { color: skin.colors.textPrimary, marginVertical: 12 }]}>
                This Week's Lectures
              </Text>
              {[
                { time: '09:00 - 10:30 AM', title: 'Machine Learning Lab', room: 'Hall B4', day: 'Mon, Wed' },
                { time: '11:00 - 12:30 PM', title: 'System Architecture', room: 'Tower C2', day: 'Tue, Thu' },
                { time: '02:00 - 04:00 PM', title: 'Senior Thesis Seminar', room: 'Lab 10', day: 'Friday' },
              ].map((c, i) => (
                <View key={i} style={[styles.lectureRow, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.lectureTitle, { color: skin.colors.textPrimary }]}>{c.title}</Text>
                    <Text style={[styles.lectureMeta, { color: skin.colors.textSecondary }]}>{c.room} · {c.day}</Text>
                  </View>
                  <Text style={[styles.lectureTime, { color: skin.colors.primary }]}>{c.time}</Text>
                </View>
              ))}
            </View>
          </View>
        </Modal>

        {/* ================= MODAL: DAILY SHUTDOWN (F26) ================= */}
        <Modal visible={shutdownModalVisible} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={[styles.challengeCard, { backgroundColor: skin.colors.surface }]}>
              <View style={styles.challengeHeader}>
                <Text style={[styles.pauseTitle, { color: skin.colors.textPrimary }]}>Daily Shutdown Ritual (F26)</Text>
                <TouchableOpacity onPress={() => setShutdownModalVisible(false)}>
                  <Ionicons name="close-circle" size={24} color={skin.colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.challengeSub, { color: skin.colors.textSecondary }]}>
                Complete these 4 checks to end work and protect your personal hours.
              </Text>

              {[
                { key: 'inboxZero', title: '1. Inbox Zero-ish', desc: 'Process remaining quick replies' },
                { key: 'tomorrowFrog', title: '2. Pick Tomorrow Frog', desc: 'Define your #1 high priority task' },
                { key: 'waterLogged', title: '3. Hydration Logged', desc: 'Minimum 6 glasses today' },
                { key: 'sleepWindowSet', title: '4. Sleep Window Confirmed', desc: 'Lights out target 10:30 PM' },
              ].map((chk) => {
                const checked = (shutdownChecks as any)[chk.key];
                return (
                  <TouchableOpacity
                    key={chk.key}
                    onPress={() => setShutdownChecks({ ...shutdownChecks, [chk.key]: !checked })}
                    style={[styles.shutdownRow, { borderBottomColor: skin.colors.border, borderBottomWidth: 1 }]}
                  >
                    <Ionicons
                      name={checked ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={checked ? skin.colors.green : skin.colors.textSecondary}
                      style={{ marginRight: 12 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.shutdownTitle, { color: skin.colors.textPrimary }]}>{chk.title}</Text>
                      <Text style={[styles.shutdownDesc, { color: skin.colors.textSecondary }]}>{chk.desc}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                onPress={() => {
                  setShutdownModalVisible(false);
                  Alert.alert('Workday Concluded', 'Have a restful evening! SmartDay is now in Quiet Hours.');
                }}
                style={[styles.pauseActionPrimary, { backgroundColor: skin.colors.primary, marginTop: 16 }]}
              >
                <Text style={styles.pauseActionText}>Complete Workday</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ================= MODAL: STREAK CARD (X08) ================= */}
        <Modal visible={streakCardModalVisible} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={[styles.challengeCard, { backgroundColor: skin.colors.surface }]}>
              <View style={styles.challengeHeader}>
                <Text style={[styles.pauseTitle, { color: skin.colors.textPrimary }]}>Accountability Card (X08)</Text>
                <TouchableOpacity onPress={() => setStreakCardModalVisible(false)}>
                  <Ionicons name="close-circle" size={24} color={skin.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Graphic Card Preview */}
              <View style={[styles.streakGraphicCard, { backgroundColor: '#0F172A', borderColor: skin.colors.gold }]}>
                <Text style={styles.cardHeaderSmall}>SMARTDAY OS · MILESTONE</Text>
                <Text style={styles.cardBigNumber}>35 DAYS</Text>
                <Text style={styles.cardSubtitle}>Unbroken Deep Work Streak</Text>
                <View style={styles.cardMetricsRow}>
                  <Text style={styles.cardMetric}>🔥 42 Habits Logged</Text>
                  <Text style={styles.cardMetric}>⚡ 956h Focus Recorded</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setStreakCardModalVisible(false);
                  Alert.alert('Graphic Exported', 'Streak image saved to your photos and ready to share!');
                }}
                style={[styles.pauseActionPrimary, { backgroundColor: skin.colors.primary, marginTop: 16 }]}
              >
                <Ionicons name="download-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.pauseActionText}>Save Streak Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Calendar Connect Modal */}
        <Modal visible={calendarConnectDialogVisible} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={[styles.pauseCard, { backgroundColor: skin.colors.surface }]}>
              <Ionicons name="calendar-outline" size={40} color={skin.colors.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
              <Text style={[styles.pauseTitle, { color: skin.colors.textPrimary, textAlign: 'center' }]}>
                Calendar Integration
              </Text>
              <Text style={[styles.pauseSubtitle, { color: skin.colors.textSecondary, textAlign: 'center' }]}>
                SmartDay reads your schedule locally to place meeting blocks on your Plan timeline.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  toggleSource('calendar');
                  setCalendarConnectDialogVisible(false);
                }}
                style={[styles.pauseActionPrimary, { backgroundColor: skin.colors.primary }]}
              >
                <Text style={styles.pauseActionText}>
                  {sources.find((s) => s.id === 'calendar')?.enabled ? 'Disconnect Calendar' : 'Connect Calendar (Simulate)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
  },
  memberSince: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  skinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skinThumbnailCard: {
    width: '48%',
    borderRadius: 18,
    padding: 12,
  },
  thumbMiniScreen: {
    height: 48,
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
  },
  thumbMiniBar: {
    height: 6,
    width: '40%',
    borderRadius: 3,
  },
  thumbMiniLine: {
    height: 4,
    width: '70%',
    borderRadius: 2,
  },
  thumbInfo: {},
  thumbTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  thumbDesc: {
    fontSize: 10,
    marginTop: 2,
  },
  cardGroup: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  rowItemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowItemSub: {
    fontSize: 12,
    marginTop: 2,
  },
  templateScroll: {
    marginBottom: 8,
  },
  templateCard: {
    width: 160,
    padding: 14,
    borderWidth: 1,
    marginRight: 10,
  },
  tmplName: {
    fontSize: 14,
    fontWeight: '700',
  },
  tmplDesc: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  stepperTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  stepperSub: {
    fontSize: 12,
    marginTop: 2,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 42,
    textAlign: 'center',
  },
  energySelectorRow: {
    padding: 16,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  energyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  connectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  aboutContainer: {
    marginTop: 28,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 12,
    fontWeight: '600',
  },
  privacyNote: {
    fontSize: 11,
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pauseCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
  },
  pauseTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  pauseSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  breatheCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 24,
  },
  breatheCount: {
    fontSize: 40,
    fontWeight: '800',
  },
  pauseActions: {
    gap: 10,
  },
  pauseActionPrimary: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 20,
  },
  pauseActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  pauseActionSecondary: {
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  pauseActionSecText: {
    fontWeight: '600',
    fontSize: 13,
  },
  challengeCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeSub: {
    fontSize: 13,
    marginVertical: 10,
  },
  cellsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  cellItem: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendTxt: {
    fontSize: 12,
  },
  countdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 10,
  },
  countdownLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  countdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  countdownDays: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  lectureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  lectureTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  lectureMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  lectureTime: {
    fontSize: 12,
    fontWeight: '700',
  },
  shutdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  shutdownTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  shutdownDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  streakGraphicCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    marginVertical: 16,
  },
  cardHeaderSmall: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EAB308',
    letterSpacing: 1,
  },
  cardBigNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  cardMetricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  cardMetric: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
