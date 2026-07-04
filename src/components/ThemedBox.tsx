import { View, type ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export function ThemedBox({
  style,
  ...props
}: ViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.box,
        { backgroundColor: theme.backgroundElement },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    padding: Spacing.three,
    borderRadius: 8,
    gap: 4,
  },
});