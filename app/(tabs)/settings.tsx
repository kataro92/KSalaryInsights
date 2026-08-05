import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { Button } from '@/src/components/common/Button';
import { ChipRow } from '@/src/components/common/ChipRow';
import { ChoiceChip } from '@/src/components/common/ChoiceChip';
import { ColorBlock } from '@/src/components/common/ColorBlock';
import { PageHero } from '@/src/components/common/PageHero';
import { ScreenShell } from '@/src/components/common/ScreenShell';
import { Section } from '@/src/components/common/Section';
import { NgaiMiuPlaceholder } from '@/src/components/mascot/NgaiMiuPlaceholder';
import { brand } from '@/src/copy/miu';
import { listRulesets } from '@/src/engine/rulesetLoader';
import {
  checkAndApplyRulesetUpdates,
  clearRemoteRulesetsAndOverlays,
} from '@/src/engine/rulesetUpdate';
import { usePreferences } from '@/src/hooks/usePreferences';
import { LOCALE_OPTIONS } from '@/src/i18n/types';
import { useI18n } from '@/src/i18n/useI18n';
import { requestOnboardingReplay } from '@/src/store/onboarding';
import type { RegionCode } from '@/src/store/preferences';
import { loadRemoteRulesetCache } from '@/src/store/remoteRulesets';
import { successHaptic } from '@/src/theme/haptics';
import { colors, radii, space, typography } from '@/src/theme/tokens';

const REGIONS: RegionCode[] = ['I', 'II', 'III', 'IV'];
const TAX_YEARS = [2025, 2026, 2027];

export const AUTHOR_NAME = 'Phạm Huy Đức';
export const AUTHOR_EMAIL = 'kataro92@gmail.com';

function formatCheckTime(iso: string | null, neverLabel: string): string {
  if (!iso) return neverLabel;
  try {
    return new Date(iso).toLocaleString('vi-VN');
  } catch {
    return iso;
  }
}

export default function SettingsScreen() {
  const {
    preferences,
    recoveredFromCorrupt,
    setDefaultRegion,
    setDefaultTaxYear,
    setLocale,
    resetToDefaults,
  } = usePreferences();
  const { t } = useI18n();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [rulesetBusy, setRulesetBusy] = useState(false);
  const [rulesetStatus, setRulesetStatus] = useState<string | null>(null);
  const [lastCheckAt, setLastCheckAt] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [rulesetCount, setRulesetCount] = useState(() => listRulesets().length);

  const refreshMeta = useCallback(async () => {
    const { cache } = await loadRemoteRulesetCache();
    setLastCheckAt(cache.lastCheckAt);
    setLastError(cache.lastError);
    setRulesetCount(listRulesets().length);
  }, []);

  useEffect(() => {
    void refreshMeta();
  }, [refreshMeta]);

  const onCheckRulesets = async () => {
    setRulesetBusy(true);
    setRulesetStatus(null);
    try {
      const result = await checkAndApplyRulesetUpdates();
      setRulesetStatus(result.message);
      setLastCheckAt(result.cache.lastCheckAt);
      setLastError(result.cache.lastError);
      setRulesetCount(listRulesets().length);
      if (result.ok) void successHaptic();
    } finally {
      setRulesetBusy(false);
    }
  };

  const onClearRemote = async () => {
    setRulesetBusy(true);
    try {
      await clearRemoteRulesetsAndOverlays();
      setRulesetStatus('Đã xóa cache ruleset từ xa — dùng bản kèm app.');
      setLastError(null);
      setRulesetCount(listRulesets().length);
      await refreshMeta();
    } finally {
      setRulesetBusy(false);
    }
  };

  const onSendFeedback = async () => {
    const subject = encodeURIComponent(`[KVSalaryTools] Feedback`);
    const body = encodeURIComponent(
      `\n\n---\nApp: ${brand.name}\nLocale: ${preferences.locale}\n`,
    );
    const url = `mailto:${AUTHOR_EMAIL}?subject=${subject}&body=${body}`;
    try {
      const can = await Linking.canOpenURL(url);
      if (!can) {
        Alert.alert(AUTHOR_EMAIL);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(AUTHOR_EMAIL);
    }
  };

  const onCopyEmail = async () => {
    try {
      await Clipboard.setStringAsync(AUTHOR_EMAIL);
      void successHaptic();
      Alert.alert(t('common.copied'), AUTHOR_EMAIL);
    } catch {
      Alert.alert(AUTHOR_EMAIL);
    }
  };

  return (
    <ScreenShell accessibilityLabel={t('settings.title')} decorated>
      <PageHero title={t('settings.title')} subtitle={t('settings.subtitle')} />

      {recoveredFromCorrupt ? (
        <ColorBlock tone="primarySoft">
          <Text style={styles.softWarn}>{t('settings.corruptPrefs')}</Text>
        </ColorBlock>
      ) : null}

      <Section title={t('settings.about')}>
        <View
          style={styles.about}
          accessibilityLabel={`${brand.name} · ${t('about.role')}`}
        >
          <NgaiMiuPlaceholder size={88} pose="bow" accessibilityLabel="Ngài Miu" />
          <View style={styles.aboutCopy}>
            <Text style={styles.aboutName}>Ngài Miu</Text>
            <Text style={styles.aboutRole}>{t('about.role')}</Text>
            <Text style={styles.aboutBody}>{t('about.body')}</Text>
          </View>
        </View>
      </Section>

      <Section title={t('settings.language')} subtitle={t('settings.languageHint')}>
        <View style={styles.langWrap}>
          {LOCALE_OPTIONS.map((opt) => (
            <ChoiceChip
              key={opt.code}
              label={opt.label}
              selected={preferences.locale === opt.code}
              onPress={() => void setLocale(opt.code)}
            />
          ))}
        </View>
      </Section>

      <Section title={t('settings.region')} subtitle={t('settings.regionHint')}>
        <ChipRow equal>
          {REGIONS.map((region) => (
            <ChoiceChip
              key={region}
              flex
              label={`Vùng ${region}`}
              selected={preferences.defaultRegion === region}
              onPress={() => void setDefaultRegion(region)}
            />
          ))}
        </ChipRow>
      </Section>

      <Section title={t('settings.taxYear')}>
        <ChipRow equal>
          {TAX_YEARS.map((year) => (
            <ChoiceChip
              key={year}
              flex
              label={String(year)}
              selected={preferences.defaultTaxYear === year}
              onPress={() => void setDefaultTaxYear(year)}
            />
          ))}
        </ChipRow>
      </Section>

      <Section title={t('settings.feedback')} subtitle={t('settings.feedbackHint')}>
        <ColorBlock tone="secondarySoft">
          <Text style={styles.feedbackAuthor}>
            {t('settings.author')}: {t('settings.authorName')}
          </Text>
          <Text style={styles.feedbackEmail}>{AUTHOR_EMAIL}</Text>
        </ColorBlock>
        <Button label={t('common.sendEmail')} onPress={() => void onSendFeedback()} />
        <Button
          label={t('common.copy')}
          variant="outline"
          onPress={() => void onCopyEmail()}
        />
      </Section>

      <Section title={t('settings.ruleset')} subtitle={t('settings.rulesetHint')}>
        <Text style={styles.metaLine}>
          {t('settings.rulesetMeta', {
            count: rulesetCount,
            when: formatCheckTime(lastCheckAt, '—'),
          })}
        </Text>
        {lastError ? (
          <ColorBlock tone="muted">
            <Text style={styles.softWarn}>{lastError}</Text>
          </ColorBlock>
        ) : null}
        {rulesetStatus ? (
          <Text style={styles.statusLine} accessibilityLiveRegion="polite">
            {rulesetStatus}
          </Text>
        ) : null}
        <Button
          label={rulesetBusy ? t('settings.checkingRuleset') : t('settings.checkRuleset')}
          onPress={() => void onCheckRulesets()}
          disabled={rulesetBusy}
        />
        <Button
          label={t('settings.clearRulesetCache')}
          variant="outline"
          onPress={() => void onClearRemote()}
          disabled={rulesetBusy}
        />
      </Section>

      <Section title={t('settings.privacy')}>
        <Button
          label={privacyOpen ? t('settings.hidePrivacy') : t('settings.showPrivacy')}
          variant="secondary"
          onPress={() => setPrivacyOpen((v) => !v)}
        />
        {privacyOpen ? (
          <ColorBlock tone="muted">
            <Text style={styles.privacyTitle}>{t('settings.privacy')}</Text>
            <Text style={styles.privacyBody}>{t('settings.privacyBody')}</Text>
            <Text style={[styles.privacyTitle, { marginTop: space[4] }]}>
              {t('settings.disclaimer')}
            </Text>
            <Text style={styles.privacyBody}>{t('settings.disclaimerBody')}</Text>
          </ColorBlock>
        ) : null}
      </Section>

      <Section title={t('settings.reset')}>
        <Button
          label={t('settings.resetDefaults')}
          variant="outline"
          onPress={() => void resetToDefaults()}
        />
        <Button
          label={t('settings.replayOnboarding')}
          variant="secondary"
          onPress={() => void requestOnboardingReplay()}
        />
      </Section>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  softWarn: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.foreground,
  },
  about: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[4],
    backgroundColor: colors.secondarySoft,
    padding: space[4],
    borderRadius: radii.lg,
  },
  aboutCopy: {
    flex: 1,
    gap: space[1],
  },
  aboutName: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: colors.foreground,
  },
  aboutRole: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.primary,
    marginBottom: space[1],
  },
  aboutBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.foregroundMuted,
  },
  langWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  feedbackAuthor: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.foreground,
    marginBottom: space[1],
  },
  feedbackEmail: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  metaLine: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.scale.caption.fontSize,
    color: colors.foregroundMuted,
    marginBottom: space[2],
  },
  statusLine: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.foreground,
    marginBottom: space[2],
  },
  privacyTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.foreground,
    marginBottom: space[2],
  },
  privacyBody: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.foreground,
    opacity: 0.85,
  },
});
