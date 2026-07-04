import { TextInput, type TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

export function ThemedTextInput({
  style,
  placeholderTextColor,
  ...props
}: TextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: theme.backgroundElement,
          color: theme.text,
        },
        style,
      ]}
      placeholderTextColor={placeholderTextColor ?? theme.textSecondary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: Spacing.three,
    borderRadius: 8,
    fontSize: 16,
  },
});