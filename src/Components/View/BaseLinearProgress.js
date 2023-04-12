import { useTheme, LinearProgress } from '@rneui/themed';

const BaseLinearProgress = ({ value = 0 }) => {
  const { theme } = useTheme();

  return (
    <LinearProgress
      trackColor={theme.colors.color2}
      color={theme.colors.color1}
      value={value}
    />
  );
};

export default BaseLinearProgress;
