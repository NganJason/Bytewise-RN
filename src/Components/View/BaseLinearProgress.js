import { useTheme, LinearProgress } from '@rneui/themed';

const BaseLinearProgress = ({ value = 0, style = {} }) => {
  const { theme } = useTheme();

  return (
    <LinearProgress
      style={style}
      trackColor={theme.colors.color2}
      color={theme.colors.color1}
      value={value}
    />
  );
};

export default BaseLinearProgress;
