import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radii, space } from '@/src/theme/tokens';

type Tone = 'default' | 'primarySoft' | 'secondarySoft' | 'muted';

type Props = ViewProps & {
  tone?: Tone;
};

const toneBg: Record<Tone, string> = {
  default: colors.white,
  primarySoft: colors.primarySoft,
  secondarySoft: colors.secondarySoft,
  muted: colors.muted,
};

export function ColorBlock({ tone = 'default', style, ...rest }: Props) {
  return <View style={[styles.block, { backgroundColor: toneBg[tone] }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  block: {
    borderRadius: radii.lg,
    padding: space[6],
  },
});
