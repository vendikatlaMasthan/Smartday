// SmartDay Tab 3 — Sessions / Focus Player & Forest (Section F03 & F04 Spec)
// Ember: 12-tick analog clock ring, thick black elapsed arc, center time, laps (Lap Time | Total Time), frosted controls.
// Forest session lock: leaving early withers tree; completing grows tree in personal grove.
// Body pings queue: water, stretch, 20-20-20 eyes.

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSkin } from '../skins/SkinContext';
import { EmberGradientBackground } from '../skins/backgrounds/EmberGradientBackground';
import { TopoBackground } from '../skins/backgrounds/TopoBackground';
import { useSmartDay } from '../context/SmartDayContext';
import { Task } from '../types';

interface SessionsScreenProps {
  initialTask?: Task;
  onNavigateToPlan: () => void;
}

interface LapRecord {
  id: number;
  lapTime: string;
  totalTime: string;
}

export const SessionsScreen: React.FC<SessionsScreenProps> = ({
  initialTask,
  onNavigateToPlan,
}) => {
  const { currentSkin, skin } = useSkin();
  const insets = useSafeAreaInsets();
  const { endFocus, todayTasks } = useSmartDay();

  // Timer State
  const [isRunning, setIsRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(8622); // Seed: 02:23:42 matching screenshot
  const [targetDurationMinutes, setTargetDurationMinutes] = useState(150);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(initialTask || todayTasks[1]);
  const [soundscape, setSoundscape] = useState<'none' | 'rain' | 'brown-noise'>('brown-noise');

  // Forest & Body Pings State
  const [forestWithered, setForestWithered] = useState(false);
  const [treesGrown, setTreesGrown] = useState<string[]>(['🌲 Pine', '🌳 Oak', '🌴 Palm', '🍁 Maple', '🌲 Cedar']);
  const [queuedBodyPings, setQueuedBodyPings] = useState<string[]>(['💧 Drink Water', '🧘 Stretch Shoulders', '👀 20-20-20 Eyes']);
  const [showForestModal, setShowForestModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [qualityRating, setQualityRating] = useState<1 | 2 | 3 | 4 | 5>(5);

  // Laps matching screenshot 1 right phone exactly:
  // 02 01:12:19 02:00:01
  // 01 00:47:32 00:47:32
  const [laps, setLaps] = useState<LapRecord[]>([
    { id: 2, lapTime: '01:12:19', totalTime: '02:00:01' },
    { id: 1, lapTime: '00:47:32', totalTime: '00:47:32' },
  ]);

  // Live Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Add Lap
  const handleLap = () => {
    const lastLapSecs = laps.length > 0 ? 4339 : secondsElapsed;
    const currentLapSecs = Math.max(1, secondsElapsed - lastLapSecs);
    const newRecord: LapRecord = {
      id: laps.length + 1,
      lapTime: formatTime(currentLapSecs),
      totalTime: formatTime(secondsElapsed),
    };
    setLaps([newRecord, ...laps]);
  };

  // Handle Early Exit withering plant dialog (F04 Forest Lock)
  const handleEarlyStop = () => {
    if (isRunning) {
      Alert.alert(
        'Abandon Session?',
        'Leaving this focus session early will wither your growing tree. Are you sure?',
        [
          { text: 'Keep Focusing', style: 'cancel' },
          {
            text: 'Give Up & Wither',
            style: 'destructive',
            onPress: () => {
              setIsRunning(false);
              setForestWithered(true);
            },
          },
        ]
      );
    } else {
      setShowSummaryModal(true);
    }
  };

  const handleFinishComplete = () => {
    setIsRunning(false);
    setShowSummaryModal(true);
    // Grow a new tree in Grove
    setTreesGrown((prev) => ['🌲 Evergreen', ...prev]);
  };

  const handleSaveSession = () => {
    const actualMins = Math.max(1, Math.round(secondsElapsed / 60));
    endFocus(actualMins, qualityRating, 'Completed high-priority milestone.');
    setShowSummaryModal(false);
  };

  const renderPlayer = () => {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.topHeader}>
            <Text style={[styles.headerTitle, { color: skin.ink }]}>Session</Text>

            <View style={styles.topHeaderRight}>
              {/* Forest Grove Collection Button */}
              <TouchableOpacity
                onPress={() => setShowForestModal(true)}
                style={[styles.forestBtn, { backgroundColor: skin.surfaceSubtle }]}
              >
                <Text style={{ fontSize: 16 }}>🌲</Text>
                <Text style={[styles.forestCount, { color: skin.ink }]}>{treesGrown.length}</Text>
              </TouchableOpacity>

              {/* Close/Stop Button */}
              <TouchableOpacity
                onPress={handleEarlyStop}
                style={[styles.closeCircleBtn, { backgroundColor: skin.surfaceSubtle }]}
              >
                <Ionicons name="close" size={20} color={skin.ink} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ==============================================
              ANALOG 12-TICK CLOCK RING (Match Shot 1 Right Phone)
             ============================================== */}
          <View style={styles.analogClockWrapper}>
            {/* 12-Hour Numbers Tick Marks (12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11) */}
            <View style={styles.analogRingContainer}>
              <View style={[styles.analogTrackCircle, { borderColor: 'rgba(255, 255, 255, 0.4)' }]}>
                {/* Thick Black Elapsed Arc (matching shot 1) */}
                <View style={styles.blackElapsedArc} />

                {/* Hour Ticks Around Perimeter */}
                {['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].map((num, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const radius = 110;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <Text
                      key={num}
                      style={[
                        styles.tickNum,
                        {
                          transform: [{ translateX: x }, { translateY: y }],
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      ]}
                    >
                      {num}
                    </Text>
                  );
                })}

                {/* Inner Solid Orange/Gradient Disc */}
                <View style={styles.analogCenterDisc}>
                  {/* Center Big Digital Time */}
                  <Text style={styles.centerTimeText}>{formatTime(secondsElapsed)}</Text>
                </View>
              </View>
            </View>

            {/* Task Title (e.g. "First Screen Design") */}
            <Text style={styles.sessionTaskTitle}>
              {selectedTask?.title || 'First Screen Design'}
            </Text>
          </View>

          {/* Soundscapes Pill */}
          <View style={styles.soundscapeRow}>
            {[
              { key: 'none', label: 'Mute', icon: 'volume-mute-outline' },
              { key: 'rain', label: 'Rain', icon: 'rainy-outline' },
              { key: 'brown-noise', label: 'Brown Noise', icon: 'radio-outline' },
            ].map((s) => (
              <TouchableOpacity
                key={s.key}
                onPress={() => setSoundscape(s.key as any)}
                style={[
                  styles.soundChip,
                  {
                    backgroundColor: soundscape === s.key ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)',
                    borderRadius: 16,
                  },
                ]}
              >
                <Ionicons name={s.icon as any} size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ==============================================
              LAPS SECTION (Match Shot 1 Table)
              Lap Time  |  Total Time
             ============================================== */}
          <View style={styles.lapsCard}>
            <View style={styles.lapsHeaderRow}>
              <Text style={styles.lapsHeaderLabel}>Lap Time</Text>
              <Text style={styles.lapsHeaderLabel}>Total Time</Text>
            </View>

            {laps.map((lap) => (
              <View key={lap.id} style={styles.lapRow}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={styles.lapIndex}>{String(lap.id).padStart(2, '0')}</Text>
                  <Text style={styles.lapTimeValue}>{lap.lapTime}</Text>
                </View>

                <Text style={styles.totalTimeValue}>{lap.totalTime}</Text>
              </View>
            ))}
          </View>

          {/* ==============================================
              CONTROLS: Play / Pause, Stop, Lap
             ============================================== */}
          <View style={styles.controlsRow}>
            {/* Lap Button */}
            <TouchableOpacity
              onPress={handleLap}
              activeOpacity={0.8}
              style={[styles.frostedControlBtn, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            >
              <Ionicons name="flag-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Main Play / Pause Button (Circle with inner dot icon) */}
            <TouchableOpacity
              onPress={() => setIsRunning((prev) => !prev)}
              activeOpacity={0.85}
              style={[styles.frostedPlayBtn, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}
            >
              <Ionicons name={isRunning ? 'pause' : 'play'} size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Stop / Finish Button */}
            <TouchableOpacity
              onPress={handleFinishComplete}
              activeOpacity={0.8}
              style={[styles.frostedControlBtn, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            >
              <Ionicons name="checkmark-circle-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Body Pings (F16 queued pings) */}
          <View style={styles.bodyPingsCard}>
            <Text style={styles.bodyPingsTitle}>Body & Posture Rituals</Text>
            <Text style={styles.bodyPingsSub}>Queued to flush immediately on break:</Text>
            <View style={styles.pingsList}>
              {queuedBodyPings.map((ping, i) => (
                <View key={i} style={styles.pingTag}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>{ping}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  // Wrap in radiant background
  if (currentSkin === 'ember') {
    return (
      <EmberGradientBackground variant="timer">
        {renderPlayer()}
        {renderForestModal()}
        {renderSummaryModal()}
      </EmberGradientBackground>
    );
  }

  if (currentSkin === 'grove') {
    return (
      <TopoBackground>
        {renderPlayer()}
        {renderForestModal()}
        {renderSummaryModal()}
      </TopoBackground>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: skin.background }]}>
      {renderPlayer()}
      {renderForestModal()}
      {renderSummaryModal()}
    </View>
  );

  // Helper Modals
  function renderForestModal() {
    return (
      <Modal visible={showForestModal} transparent animationType="fade" onRequestClose={() => setShowForestModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: '#1C2028', borderRadius: 28 }]}>
            <Text style={styles.modalTitle}>Personal Grove (Forest)</Text>
            <Text style={styles.modalSub}>Each successful focus session plants a living tree in your productivity forest.</Text>

            <View style={styles.treesGrid}>
              {treesGrown.map((tree, i) => (
                <View key={i} style={styles.treeTile}>
                  <Text style={{ fontSize: 24, textAlign: 'center' }}>{tree.split(' ')[0]}</Text>
                  <Text style={styles.treeName}>{tree.split(' ')[1]}</Text>
                </View>
              ))}
            </View>

            {forestWithered && (
              <View style={styles.witheredNotice}>
                <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>🥀 1 Withered Branch</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>From an abandoned session</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setShowForestModal(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Close Grove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function renderSummaryModal() {
    return (
      <Modal visible={showSummaryModal} transparent animationType="slide" onRequestClose={() => setShowSummaryModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: '#1C2028', borderRadius: 28 }]}>
            <Text style={styles.modalTitle}>Session Complete!</Text>
            <Text style={styles.modalSub}>
              Logged {Math.max(1, Math.round(secondsElapsed / 60))} minutes for {selectedTask?.title || 'Deep Work'}.
            </Text>

            <Text style={[styles.modalSub, { marginTop: 16, color: '#FFFFFF', fontWeight: '700' }]}>
              Focus Quality Rating (1–5):
            </Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setQualityRating(star as any)}>
                  <Ionicons
                    name={star <= qualityRating ? 'star' : 'star-outline'}
                    size={30}
                    color={star <= qualityRating ? '#FBBF24' : '#6B7280'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleSaveSession} style={styles.modalCloseBtn}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Save Focus Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
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
    alignItems: 'center',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  topHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  forestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  forestCount: {
    fontWeight: '800',
    fontSize: 13,
  },
  closeCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Analog 12-Tick Clock Ring
  analogClockWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  analogRingContainer: {
    width: 270,
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  analogTrackCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  blackElapsedArc: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 14,
    borderColor: '#111827',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  tickNum: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '700',
    width: 20,
    textAlign: 'center',
  },
  analogCenterDisc: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTimeText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sessionTaskTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 18,
    textAlign: 'center',
  },
  soundscapeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
  },
  soundChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  // Laps Table (Matching screenshot 1 right phone)
  lapsCard: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 20,
    padding: 18,
    marginTop: 10,
  },
  lapsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lapsHeaderLabel: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  lapIndex: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 12,
    marginRight: 8,
    fontWeight: '700',
  },
  lapTimeValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  totalTimeValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  // Controls Row
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 24,
  },
  frostedControlBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  frostedPlayBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  bodyPingsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },
  bodyPingsTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bodyPingsSub: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 8,
  },
  pingsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pingTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  modalSub: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  treesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 18,
    justifyContent: 'center',
  },
  treeTile: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeName: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
  witheredNotice: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 18,
  },
  modalCloseBtn: {
    backgroundColor: '#F97316',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 8,
  },
});
