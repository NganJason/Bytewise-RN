import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import {
  BaseScreen3,
  BaseText,
  EmptyContent,
  BaseLoadableView,
} from '../../../Components';
import { EmptyContentConfig } from '../../../_shared/constant/constant';
import ROUTES from '../../../_shared/constant/routes';

const HoldingBreakdownScreen = ({}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const renderRows = () => {
    let rows = [];

    if (rows.length === 0) {
      return (
        <View style={styles.emptyContent}>
          <EmptyContent
            item={EmptyContentConfig.investment}
            route={ROUTES.investmentForm}
          />
        </View>
      );
    }

    return rows;
  };

  return (
    <BaseScreen3 headerProps={{ allowBack: true }}>
      <>
        <BaseText h3 style={styles.title}>
          History
        </BaseText>
        <BaseLoadableView scrollable={true}>{renderRows()}</BaseLoadableView>
      </>
    </BaseScreen3>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    title: {
      marginVertical: 20,
    },
  });

export default HoldingBreakdownScreen;
