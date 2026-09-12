// SmartDay Tab 4 — Metrics & Trends (Section 0.6, Phase 2 F08–F09, Phase 6 F31–F33 Spec)
// Pixel-faithful to Screenshot 2 (Skin B Halo):
// - Giant 2,683 Task Performance Metrics card with capsule "Time tracking 956h 23m" + 43% delta
// - Key Performances rows with delta chips (Public Messages Sent 342, Emails Exchanged 465)
// - "Over Time" 85% stacked area chart with pink/peach/lime gradient bars
// - "Top Streaks" podium of 3 avatars + ranked list with gold stars
// - Time range switcher: Last 3 days | Last Week | Last Month (and D | W | M | 6M | Y)
// - Highlights Feed (F09) with "Why this showed up" expander
// - Expenses & Budget tracker (F31–F33) with sample OCR scanner & CSV export
// - Project progress bars (X12)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSkin } from '../skins/SkinContext';
import { useSmartDay } from '../context/SmartDayContext';
import { SkinSwitcherDots } from '../skins/SkinSwitcherDots';
import { TopoBackground } from '../skins/backgrounds/TopoBackground';
import { EmberGradientBackground } from '../skins/backgrounds/EmberGradientBackground';
import { CategoryDetailModal } from '../components/ui/CategoryDetailModal';

type MetricSubTab = 'trends' | 'highlights' | 'expenses' | 'directory';

interface MetricsScreenProps {
  onOpenSearch?: () => void;
  onOpenStartFocus?: () => void;
  onNavigateToPlan?: () => void;
}

export const MetricsScreen: React.FC<MetricsScreenProps> = ({
  onOpenSearch,
  onOpenStartFocus,
  onNavigateToPlan,
}) => {
  const insets = useSafeAreaInsets();
  const { skin } = useSkin();
  const {
    sessions,
    tasks,
    habits,
    notes,
    highlights,
    todayFocusMinutes,
    rings,
  } = useSmartDay();

  const [activeSubTab, setActiveSubTab] = useState<MetricSubTab>('trends');
  const [period, setPeriod] = useState<'3d' | 'week' | 'month'>('3d');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [expandedHighlightId, setExpandedHighlightId] = useState<string | null>(null);

  // Sample Expenses Data (F31–F33)
  const [expenses, setExpenses] = useState([
    { id: 'e1', title: 'Blue Bottle Coffee (Work Deep Session)', amount: 6.75, date: 'Today, 9:15 AM', category: 'Focus Food' },
    { id: 'e2', title: 'Figma Pro Subscription', amount: 15.00, date: 'Yesterday', category: 'Tools' },
    { id: 'e3', title: 'Ergonomic Wrist Rest', amount: 28.50, date: 'Sep 10', category: 'Hardware' },
    { id: 'e4', title: 'Book: Deep Work by Cal Newport', amount: 18.20, date: 'Sep 08', category: 'Learning' },
  ]);
  const weeklyBudget = 150.0;
  const currentWeeklySpend = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Sample OCR receipts (F32)
  const sampleReceipts = [
    { merchant: 'Blue Bottle Cafe', total: '$6.75', date: 'Sep 12, 2026', items: '1x Cold Brew Oat Latte' },
    { merchant: 'Apple Store Regent St', total: '$149.00', date: 'Sep 09, 2026', items: 'Magic Trackpad 2' },
    { merchant: 'Kinokuniya Books', total: '$34.20', date: 'Sep 05, 2026', items: '2x Design Architecture' },
  ];

  const handleSimulateOCR = (index: number) => {
    const rec = sampleReceipts[index];
    const newExp = {
      id: 'e_' + Date.now(),
      title: `${rec.merchant} (${rec.items})`,
      amount: parseFloat(rec.total.replace('$', '')),
      date: 'Just now (Scanned)',
      category: 'Receipt OCR',
    };
    setExpenses([newExp, ...expenses]);
    Alert.alert('Receipt Scanned & Processed', `Extracted merchant: ${rec.merchant}\nTotal: ${rec.total}\nAdded to your weekly expenses!`);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Date,Merchant/Title,Category,Amount\n';
    const csvRows = expenses.map(e => `"${e.date}","${e.title}","${e.category}","${e.amount.toFixed(2)}"`).join('\n');
    Alert.alert('CSV Export Ready', `SmartDay_Expenses_Q3.csv:\n\n${csvHeader}${csvRows.slice(0, 180)}...\n\n(Saved to your device for tax & budget reports)`);
  };

  // Podium Users / Personas (Screenshot 2)
  const podiumStreaks = [
    { rank: 2, name: 'Alina Hubner', role: 'Recruiter', rating: '4.9', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face', streak: '35d' },
    { rank: 1, name: 'Mia (You)', role: 'Product Designer', rating: '5.0', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face', streak: '35d' },
    { rank: 3, name: 'Yana Crout', role: 'Recruiter', rating: '4.9', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face', streak: '24d' },
  ];

  const rankedList = [
    { id: 'r1', name: 'Alina Hubner', role: 'Recruiter', rating: '4.9', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face' },
    { id: 'r2', name: 'Yana Crout', role: 'Recruiter', rating: '4.9', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face' },
    { id: 'r3', name: 'Thom Haye', role: 'UI Designer', rating: '4.8', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: skin.colors.background }]}>
      {skin.id === 'grove' && <TopoBackground />}
      {skin.id === 'ember' && <EmberGradientBackground variant="home" />}

      <SafeAreaView style={styles.safeArea}>
        {/* Header with Title and Persistent Palette Switcher */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: skin.colors.textPrimary }]}>
              {skin.id === 'halo' ? 'Metrics' : 'Trends & Metrics'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: skin.colors.textSecondary }]}>
              {period === '3d' ? 'Last 3 days overview' : period === 'week' ? 'Past 7 days performance' : 'Monthly aggregate'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={onOpenSearch}
              style={[
                styles.iconBtn,
                {
                  backgroundColor: skin.colors.surfaceSecondary,
                  borderColor: skin.colors.border,
                },
              ]}
              accessibilityLabel="Search records"
            >
              <Ionicons name="search-outline" size={18} color={skin.colors.textPrimary} />
            </TouchableOpacity>
            <SkinSwitcherDots />
          </View>
        </View>

        {/* Sub-tab navigation pill */}
        <View style={styles.subTabRow}>
          {[
            { key: 'trends', label: 'Overview' },
            { key: 'highlights', label: `Highlights (${highlights.length})` },
            { key: 'expenses', label: 'Expenses' },
            { key: 'directory', label: 'Directory' },
          ].map((tab) => {
            const active = activeSubTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveSubTab(tab.key as MetricSubTab)}
                style={[
                  styles.subTabPill,
                  active && {
                    backgroundColor: skin.id === 'halo' ? '#111827' : skin.colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.subTabLabel,
                    {
                      color: active
                        ? '#FFFFFF'
                        : skin.colors.textSecondary,
                      fontWeight: active ? '700' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* ======================= SUBTAB 1: TRENDS & OVERVIEW ======================= */}
          {activeSubTab === 'trends' && (
            <>
              {/* Period Chips: Last 3 days | Last Week | Last Month (Screenshot 2 Match) */}
              <View style={styles.periodRow}>
                {[
                  { key: '3d', label: 'Last 3 days' },
                  { key: 'week', label: 'Last Week' },
                  { key: 'month', label: 'Last Month' },
                ].map((item) => {
                  const isSel = period === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => setPeriod(item.key as any)}
                      style={[
                        styles.periodChip,
                        {
                          backgroundColor: isSel
                            ? skin.id === 'halo'
                              ? '#111827'
                              : skin.colors.primary
                            : skin.colors.surface,
                          borderColor: isSel ? 'transparent' : skin.colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.periodText,
                          {
                            color: isSel ? '#FFFFFF' : skin.colors.textSecondary,
                            fontWeight: isSel ? '700' : '500',
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* CARD 1: GIANT 2,683 METRICS CARD (Screenshot 2 Match) */}
              <View
                style={[
                  styles.heroMetricCard,
                  {
                    backgroundColor: skin.colors.surface,
                    borderRadius: skin.borderRadius.card,
                    borderColor: skin.colors.border,
                  },
                ]}
              >
                <View style={styles.heroCardHeader}>
                  <Text style={[styles.heroCardLabel, { color: skin.colors.textSecondary }]}>
                    Task Performance Metrics
                  </Text>
                  <View style={[styles.deltaBadge, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="arrow-up-outline" size={12} color="#16A34A" />
                    <Text style={styles.deltaBadgeText}>43%</Text>
                  </View>
                </View>

                {/* Big Number */}
                <Text style={[styles.giantNumber, { color: skin.colors.textPrimary }]}>
                  2,683
                </Text>

                {/* Capsule Time tracking 956h 23m + Rainbow Gradient Bar */}
                <View style={styles.capsuleContainer}>
                  <View style={styles.capsuleGradientBar}>
                    <View style={[styles.gradientSeg, { backgroundColor: '#F472B6', flex: 1.2 }]} />
                    <View style={[styles.gradientSeg, { backgroundColor: '#FBBF24', flex: 1.5 }]} />
                    <View style={[styles.gradientSeg, { backgroundColor: '#A3E635', flex: 1.8 }]} />
                    <View style={[styles.gradientSeg, { backgroundColor: '#22C55E', flex: 1.0 }]} />
                  </View>
                  <View style={styles.capsuleLabelRow}>
                    <Text style={[styles.capsuleText, { color: skin.colors.textPrimary }]}>
                      Time tracking 956h 23m
                    </Text>
                    <Text style={[styles.capsuleSub, { color: skin.colors.textSecondary }]}>
                      956h 23m
                    </Text>
                  </View>
                </View>
              </View>

              {/* SECTION: KEY PERFORMANCES (Screenshot 2 Match) */}
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: skin.colors.textPrimary }]}>
                  Key Performances
                </Text>
                <Text style={[styles.sectionBadge, { color: skin.colors.textSecondary }]}>
                  Live sync
                </Text>
              </View>

              {/* Card 2: Public Messages Sent 342 (-46%) */}
              <View
                style={[
                  styles.metricRowCard,
                  {
                    backgroundColor: skin.colors.surface,
                    borderRadius: skin.borderRadius.card,
                    borderColor: skin.colors.border,
                  },
                ]}
              >
                <View style={styles.metricRowTop}>
                  <View>
                    <Text style={[styles.rowTitle, { color: skin.colors.textSecondary }]}>
                      Public Messages Sent
                    </Text>
                    <View style={styles.rowValRow}>
                      <Text style={[styles.rowBigVal, { color: skin.colors.textPrimary }]}>
                        342
                      </Text>
                      <View style={[styles.pillNegative, { backgroundColor: '#FEE2E2' }]}>
                        <Text style={styles.pillNegativeText}>-46%</Text>
                      </View>
                    </View>
                    <Text style={[styles.rowDiffText, { color: skin.colors.textSecondary }]}>
                      -7 Messages
                    </Text>
                  </View>

                  {/* Slack Icon */}
                  <View style={[styles.vendorIcon, { backgroundColor: '#F3E8FF' }]}>
                    <Ionicons name="chatbubbles" size={20} color="#9333EA" />
                  </View>
                </View>

                {/* Progress bar with percentage */}
                <View style={styles.rowProgressWrap}>
                  <View style={[styles.rowProgressBarBg, { backgroundColor: skin.colors.surfaceSecondary }]}>
                    <View style={[styles.rowProgressBarFill, { width: '31%', backgroundColor: '#F87171' }]} />
                  </View>
                  <Text style={[styles.progressPercent, { color: skin.colors.textSecondary }]}>31%</Text>
                </View>
              </View>

              {/* Card 3: Emails Exchanged 465 (+12%) */}
              <View
                style={[
                  styles.metricRowCard,
                  {
                    backgroundColor: skin.colors.surface,
                    borderRadius: skin.borderRadius.card,
                    borderColor: skin.colors.border,
                  },
                ]}
              >
                <View style={styles.metricRowTop}>
                  <View>
                    <Text style={[styles.rowTitle, { color: skin.colors.textSecondary }]}>
                      Emails Exchanged
                    </Text>
                    <View style={styles.rowValRow}>
                      <Text style={[styles.rowBigVal, { color: skin.colors.textPrimary }]}>
                        465
                      </Text>
                      <View style={[styles.pillPositive, { backgroundColor: '#DCFCE7' }]}>
                        <Text style={styles.pillPositiveText}>+12%</Text>
                      </View>
                    </View>
                    <Text style={[styles.rowDiffText, { color: skin.colors.textSecondary }]}>
                      +56 Emails
                    </Text>
                  </View>

                  {/* Mail Icon */}
                  <View style={[styles.vendorIcon, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="mail" size={20} color="#EF4444" />
                  </View>
                </View>

                <View style={styles.rowProgressWrap}>
                  <View style={[styles.rowProgressBarBg, { backgroundColor: skin.colors.surfaceSecondary }]}>
                    <View style={[styles.rowProgressBarFill, { width: '68%', backgroundColor: '#22C55E' }]} />
                  </View>
                  <Text style={[styles.progressPercent, { color: skin.colors.textSecondary }]}>68%</Text>
                </View>
              </View>

              {/* CARD 4: "OVER TIME" 85% STACKED AREA CHART (Screenshot 2 Match) */}
              <View
                style={[
                  styles.chartCard,
                  {
                    backgroundColor: skin.colors.surface,
                    borderRadius: skin.borderRadius.card,
                    borderColor: skin.colors.border,
                  },
                ]}
              >
                <View style={styles.chartHeader}>
                  <Text style={[styles.chartTitle, { color: skin.colors.textPrimary }]}>
                    Over Time
                  </Text>
                  <Text style={styles.chartBigStat}>85%</Text>
                </View>

                {/* Legend Chips */}
                <View style={styles.chartLegendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#F87171' }]} />
                    <Text style={[styles.legendLabel, { color: skin.colors.textSecondary }]}>&lt;500</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FBBF24' }]} />
                    <Text style={[styles.legendLabel, { color: skin.colors.textSecondary }]}>+1k</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#84CC16' }]} />
                    <Text style={[styles.legendLabel, { color: skin.colors.textSecondary }]}>+2k</Text>
                  </View>
                </View>

                {/* Stylized Wavy Stacked Area Chart Simulation */}
                <View style={styles.waveChartContainer}>
                  {[
                    { day: 'Wed', h1: 40, h2: 70, h3: 110, color1: '#FECDD3', color2: '#FEF08A', color3: '#BBF7D0' },
                    { day: 'Thu', h1: 65, h2: 95, h3: 140, color1: '#FDA4AF', color2: '#FDE047', color3: '#86EFAC' },
                    { day: 'Fri', h1: 85, h2: 125, h3: 170, color1: '#FB7185', color2: '#FACC15', color3: '#4ADE80' },
                  ].map((bar, i) => (
                    <View key={i} style={styles.waveColumn}>
                      <View style={[styles.barLayer, { height: bar.h3, backgroundColor: bar.color3, borderTopLeftRadius: 16, borderTopRightRadius: 16 }]}>
                        <View style={[styles.barLayer, { height: bar.h2, backgroundColor: bar.color2 }]}>
                          <View style={[styles.barLayer, { height: bar.h1, backgroundColor: bar.color1 }]} />
                        </View>
                      </View>
                      <Text style={[styles.waveDayLabel, { color: skin.colors.textSecondary }]}>{bar.day}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* CARD 5: "TOP STREAKS" PODIUM (Screenshot 2 Match) */}
              <View
                style={[
                  styles.podiumCard,
                  {
                    backgroundColor: skin.colors.surface,
                    borderRadius: skin.borderRadius.card,
                    borderColor: skin.colors.border,
                  },
                ]}
              >
                <View style={styles.podiumHeader}>
                  <Text style={[styles.podiumTitle, { color: skin.colors.textPrimary }]}>
                    Top Streaks &amp; Habits
                  </Text>
                  <View style={[styles.podiumBadge, { backgroundColor: skin.colors.surfaceSecondary }]}>
                    <Text style={[styles.podiumBadgeText, { color: skin.colors.textSecondary }]}>
                      Leaderboard
                    </Text>
                  </View>
                </View>

                {/* 3 Avatars Podium */}
                <View style={styles.podiumRow}>
                  {podiumStreaks.map((p) => {
                    const isFirst = p.rank === 1;
                    return (
                      <View
                        key={p.name}
                        style={[
                          styles.podiumCol,
                          isFirst && { transform: [{ translateY: -10 }] },
                        ]}
                      >
                        <View style={styles.avatarWrap}>
                          <Image source={{ uri: p.avatar }} style={styles.podiumAvatar} />
                          <View
                            style={[
                              styles.rankBadge,
                              {
                                backgroundColor:
                                  p.rank === 1 ? '#EAB308' : p.rank === 2 ? '#94A3B8' : '#D97706',
                              },
                            ]}
                          >
                            <Text style={styles.rankBadgeText}>{p.rank}</Text>
                          </View>
                        </View>
                        <View style={styles.starRow}>
                          <Ionicons name="star" size={12} color="#EAB308" />
                          <Text style={styles.ratingText}>{p.rating}</Text>
                        </View>
                        <Text style={[styles.podiumName, { color: skin.colors.textPrimary }]} numberOfLines={1}>
                          {p.name}
                        </Text>
                        <Text style={[styles.podiumRole, { color: skin.colors.textSecondary }]}>
                          {p.streak}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Ranked list rows with gold stars */}
                <View style={styles.rankedListContainer}>
                  {rankedList.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.rankedListItem,
                        { borderTopColor: skin.colors.border, borderTopWidth: 1 },
                      ]}
                    >
                      <Image source={{ uri: item.avatar }} style={styles.rankedListAvatar} />
                      <View style={styles.rankedListInfo}>
                        <Text style={[styles.rankedListName, { color: skin.colors.textPrimary }]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.rankedListRole, { color: skin.colors.textSecondary }]}>
                          {item.role}
                        </Text>
                      </View>
                      <View style={styles.rankedStarWrap}>
                        <Ionicons name="star" size={13} color="#EAB308" />
                        <Text style={styles.rankedStarVal}>{item.rating}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* PROJECT PROGRESS BARS (X12) */}
              <View
                style={[
                  styles.progressCard,
                  {
                    backgroundColor: skin.colors.surface,
                    borderRadius: skin.borderRadius.card,
                    borderColor: skin.colors.border,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: skin.colors.textPrimary, marginBottom: 12 }]}>
                  Project Velocity (X12)
                </Text>
                {[
                  { name: 'SmartDay Mobile OS', completed: 18, total: 22, color: skin.colors.primary },
                  { name: 'Design System & Skins', completed: 12, total: 12, color: skin.colors.green },
                  { name: 'University Thesis', completed: 6, total: 14, color: skin.colors.purple },
                ].map((proj, idx) => {
                  const pct = Math.round((proj.completed / proj.total) * 100);
                  return (
                    <View key={idx} style={styles.projItem}>
                      <View style={styles.projMeta}>
                        <Text style={[styles.projName, { color: skin.colors.textPrimary }]}>{proj.name}</Text>
                        <Text style={[styles.projPct, { color: skin.colors.textSecondary }]}>{pct}% ({proj.completed}/{proj.total})</Text>
                      </View>
                      <View style={[styles.projBarBg, { backgroundColor: skin.colors.surfaceSecondary }]}>
                        <View style={[styles.projBarFill, { width: `${pct}%`, backgroundColor: proj.color }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* ======================= SUBTAB 2: HIGHLIGHTS FEED (F09) ======================= */}
          {activeSubTab === 'highlights' && (
            <View style={styles.highlightsContainer}>
              <View style={[styles.highlightBanner, { backgroundColor: skin.colors.surfaceSecondary }]}>
                <Ionicons name="sparkles" size={18} color={skin.colors.gold} style={{ marginRight: 8 }} />
                <Text style={[styles.highlightBannerText, { color: skin.colors.textPrimary }]}>
                  Real insights computed from your continuous 21 days of history.
                </Text>
              </View>

              {highlights.map((item) => {
                const isExpanded = expandedHighlightId === item.id;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.highlightCard,
                      {
                        backgroundColor: skin.colors.surface,
                        borderRadius: skin.borderRadius.card,
                        borderColor: skin.colors.border,
                      },
                    ]}
                  >
                    <View style={styles.hlHeader}>
                      <View style={[styles.hlBadge, { backgroundColor: skin.colors.primarySurface }]}>
                        <Text style={[styles.hlBadgeText, { color: skin.colors.primary }]}>
                          {item.type.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={[styles.hlDate, { color: skin.colors.textSecondary }]}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>

                    <Text style={[styles.hlTitle, { color: skin.colors.textPrimary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.hlDesc, { color: skin.colors.textSecondary }]}>
                      {item.body}
                    </Text>

                    {/* Expander: "Why this showed up" (F09 spec) */}
                    <TouchableOpacity
                      onPress={() => setExpandedHighlightId(isExpanded ? null : item.id)}
                      style={styles.whyButton}
                    >
                      <Text style={[styles.whyButtonText, { color: skin.colors.primary }]}>
                        {isExpanded ? 'Hide calculation details' : 'Why this showed up?'}
                      </Text>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color={skin.colors.primary}
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>

                    {isExpanded && (
                      <View
                        style={[
                          styles.calculationBox,
                          {
                            backgroundColor: skin.colors.surfaceSecondary,
                            borderColor: skin.colors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.calcText, { color: skin.colors.textSecondary }]}>
                          {item.whyExplanation || 'Generated automatically by evaluating 5+ logged focus sessions and consecutive daily streaks against standard deviation windows.'}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* ======================= SUBTAB 3: EXPENSES & BUDGET (F31–F33) ======================= */}
          {activeSubTab === 'expenses' && (
            <View style={styles.expensesContainer}>
              {/* Budget Overview Card */}
              <View
                style={[
                  styles.budgetCard,
                  {
                    backgroundColor: skin.colors.surface,
                    borderRadius: skin.borderRadius.card,
                    borderColor: skin.colors.border,
                  },
                ]}
              >
                <Text style={[styles.budgetLabel, { color: skin.colors.textSecondary }]}>
                  Weekly Work Spend vs Budget (F33)
                </Text>
                <View style={styles.budgetRow}>
                  <Text style={[styles.budgetTotal, { color: skin.colors.textPrimary }]}>
                    ${currentWeeklySpend.toFixed(2)}
                  </Text>
                  <Text style={[styles.budgetCap, { color: skin.colors.textSecondary }]}>
                    of ${weeklyBudget.toFixed(2)} limit
                  </Text>
                </View>

                {/* Progress bar */}
                <View style={[styles.budgetBarBg, { backgroundColor: skin.colors.surfaceSecondary }]}>
                  <View
                    style={[
                      styles.budgetBarFill,
                      {
                        width: `${Math.min(100, (currentWeeklySpend / weeklyBudget) * 100)}%`,
                        backgroundColor:
                          currentWeeklySpend > weeklyBudget ? '#EF4444' : skin.colors.primary,
                      },
                    ]}
                  />
                </View>

                <View style={styles.expenseActionsRow}>
                  <TouchableOpacity
                    onPress={handleExportCSV}
                    style={[styles.actionChip, { backgroundColor: skin.colors.surfaceSecondary }]}
                  >
                    <Ionicons name="download-outline" size={14} color={skin.colors.textPrimary} style={{ marginRight: 6 }} />
                    <Text style={[styles.actionChipText, { color: skin.colors.textPrimary }]}>Export CSV</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSimulateOCR(0)}
                    style={[styles.actionChip, { backgroundColor: skin.colors.primary }]}
                  >
                    <Ionicons name="camera-outline" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={[styles.actionChipText, { color: '#FFFFFF' }]}>Scan Receipt OCR</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sample Receipts Quick Selector (F32) */}
              <View style={styles.receiptSampleSection}>
                <Text style={[styles.sectionTitle, { color: skin.colors.textPrimary, marginBottom: 8 }]}>
                  Sample Receipts (Demo OCR)
                </Text>
                {sampleReceipts.map((rec, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleSimulateOCR(i)}
                    style={[
                      styles.sampleReceiptItem,
                      {
                        backgroundColor: skin.colors.surface,
                        borderRadius: skin.borderRadius.card,
                        borderColor: skin.colors.border,
                      },
                    ]}
                  >
                    <Ionicons name="receipt-outline" size={20} color={skin.colors.primary} style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.receiptMerchant, { color: skin.colors.textPrimary }]}>{rec.merchant}</Text>
                      <Text style={[styles.receiptItems, { color: skin.colors.textSecondary }]}>{rec.items} · {rec.date}</Text>
                    </View>
                    <Text style={[styles.receiptTotal, { color: skin.colors.textPrimary }]}>{rec.total}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Expenses List */}
              <View style={styles.expensesList}>
                <Text style={[styles.sectionTitle, { color: skin.colors.textPrimary, marginVertical: 10 }]}>
                  Logged Transactions
                </Text>
                {expenses.map((exp) => (
                  <View
                    key={exp.id}
                    style={[
                      styles.expenseItem,
                      {
                        backgroundColor: skin.colors.surface,
                        borderRadius: skin.borderRadius.card,
                        borderColor: skin.colors.border,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.expTitle, { color: skin.colors.textPrimary }]}>{exp.title}</Text>
                      <Text style={[styles.expMeta, { color: skin.colors.textSecondary }]}>{exp.category} · {exp.date}</Text>
                    </View>
                    <Text style={[styles.expAmount, { color: skin.colors.textPrimary }]}>
                      -${exp.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ======================= SUBTAB 4: DIRECTORY ======================= */}
          {activeSubTab === 'directory' && (
            <View style={styles.directoryContainer}>
              <Text style={[styles.sectionTitle, { color: skin.colors.textPrimary, marginBottom: 12 }]}>
                Productivity Catalog
              </Text>
              {[
                { key: 'focus', title: 'Focus Sessions', stat: `${todayFocusMinutes}m recorded today`, icon: 'timer-outline', color: skin.colors.primary },
                { key: 'tasks', title: 'Task Velocity', stat: `${rings.tasksCompleted} of ${rings.tasksPlanned} closed`, icon: 'checkbox-outline', color: skin.colors.purple },
                { key: 'habits', title: 'Habit Consistency', stat: '35-day active streak', icon: 'flame-outline', color: skin.colors.gold },
                { key: 'notes', title: 'Second Brain Notes', stat: `${notes.length} knowledge entries`, icon: 'document-text-outline', color: skin.colors.green },
                { key: 'quality', title: 'Energy & Focus Quality', stat: '4.8 / 5.0 avg score', icon: 'pulse-outline', color: skin.colors.primary },
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => setSelectedCategory(cat.key)}
                  style={[
                    styles.directoryCard,
                    {
                      backgroundColor: skin.colors.surface,
                      borderRadius: skin.borderRadius.card,
                      borderColor: skin.colors.border,
                    },
                  ]}
                >
                  <View style={[styles.dirIcon, { backgroundColor: cat.color + '20' }]}>
                    <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.dirTitle, { color: skin.colors.textPrimary }]}>{cat.title}</Text>
                    <Text style={[styles.dirStat, { color: skin.colors.textSecondary }]}>{cat.stat}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={skin.colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Category Detail Modal */}
        {selectedCategory && (
          <CategoryDetailModal
            visible={!!selectedCategory}
            categoryKey={selectedCategory}
            onClose={() => setSelectedCategory(null)}
          />
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  subTabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  subTabPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  subTabLabel: {
    fontSize: 13,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  periodChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  periodText: {
    fontSize: 13,
  },
  heroMetricCard: {
    padding: 24,
    borderWidth: 1,
  },
  heroCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroCardLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 2,
  },
  deltaBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  giantNumber: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1.5,
    marginVertical: 12,
  },
  capsuleContainer: {
    marginTop: 4,
  },
  capsuleGradientBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gradientSeg: {
    height: '100%',
  },
  capsuleLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capsuleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  capsuleSub: {
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionBadge: {
    fontSize: 12,
  },
  metricRowCard: {
    padding: 18,
    borderWidth: 1,
  },
  metricRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  rowValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  rowBigVal: {
    fontSize: 28,
    fontWeight: '800',
  },
  pillNegative: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pillNegativeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  pillPositive: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pillPositiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  rowDiffText: {
    fontSize: 12,
    marginTop: 2,
  },
  vendorIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowProgressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 10,
  },
  rowProgressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  rowProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '600',
  },
  chartCard: {
    padding: 20,
    borderWidth: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  chartBigStat: {
    fontSize: 18,
    fontWeight: '800',
    color: '#16A34A',
  },
  chartLegendRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
  },
  waveChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
    paddingTop: 10,
  },
  waveColumn: {
    alignItems: 'center',
    width: 70,
  },
  barLayer: {
    width: '100%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  waveDayLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  podiumCard: {
    padding: 20,
    borderWidth: 1,
  },
  podiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  podiumTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  podiumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  podiumBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingVertical: 12,
  },
  podiumCol: {
    alignItems: 'center',
    width: 90,
  },
  avatarWrap: {
    position: 'relative',
  },
  podiumAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EAB308',
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  podiumRole: {
    fontSize: 11,
  },
  rankedListContainer: {
    marginTop: 12,
  },
  rankedListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rankedListAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  rankedListInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rankedListName: {
    fontSize: 14,
    fontWeight: '600',
  },
  rankedListRole: {
    fontSize: 12,
  },
  rankedStarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankedStarVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EAB308',
  },
  progressCard: {
    padding: 20,
    borderWidth: 1,
  },
  projItem: {
    marginBottom: 12,
  },
  projMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  projName: {
    fontSize: 13,
    fontWeight: '600',
  },
  projPct: {
    fontSize: 12,
  },
  projBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  projBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  highlightsContainer: {
    gap: 12,
  },
  highlightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  highlightBannerText: {
    fontSize: 12,
    flex: 1,
  },
  highlightCard: {
    padding: 18,
    borderWidth: 1,
  },
  hlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hlBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  hlBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  hlDate: {
    fontSize: 11,
  },
  hlTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  hlDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  whyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  whyButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  calculationBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  calcText: {
    fontSize: 11,
    lineHeight: 16,
  },
  expensesContainer: {
    gap: 16,
  },
  budgetCard: {
    padding: 20,
    borderWidth: 1,
  },
  budgetLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginVertical: 8,
  },
  budgetTotal: {
    fontSize: 32,
    fontWeight: '800',
  },
  budgetCap: {
    fontSize: 14,
  },
  budgetBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  budgetBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  expenseActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  receiptSampleSection: {
    marginTop: 4,
  },
  sampleReceiptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  receiptMerchant: {
    fontSize: 14,
    fontWeight: '600',
  },
  receiptItems: {
    fontSize: 12,
    marginTop: 2,
  },
  receiptTotal: {
    fontSize: 15,
    fontWeight: '700',
  },
  expensesList: {
    gap: 8,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
  },
  expTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  expMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  expAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  directoryContainer: {
    gap: 10,
  },
  directoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
  },
  dirIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dirTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  dirStat: {
    fontSize: 12,
    marginTop: 2,
  },
});
