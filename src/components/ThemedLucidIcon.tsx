import { Lucide } from '@react-native-vector-icons/lucide';
import { useTheme } from '@/hooks/use-theme';

type ThemedLucideIconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: any;
};

export function ThemedLucideIcon({
  name,
  size = 24,
  color,
  style,
}: ThemedLucideIconProps) {
  const theme = useTheme();

  return (
    <Lucide
      name={name}
      size={size}
      color={color ?? theme.textSecondary}
      style={style}
    />
  );
}