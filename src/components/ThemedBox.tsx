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
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    padding: Spacing.three,
    borderRadius: 20,
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E9EF',
  },
});
