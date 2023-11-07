import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import { AggrSummary2, BaseScreen2 } from '../../Components';
import { useDimension } from '../../_shared/hooks';

const InsightsScreen = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  return (
    <BaseScreen2
      headerProps={{
        // component: renderHeader(),
        allowDrawer: true,
        allowHideInfo: true,
      }}
      enablePadding={false}>
      <AggrSummary2 />
    </BaseScreen2>
  );
};

const getStyles = (_, screenWidth, screenHeight) => StyleSheet.create({});

export default InsightsScreen;
