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
          borderColor: theme.border,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
  },
});
