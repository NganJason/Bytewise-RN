import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import {
  AggrSummary2,
  AmountText,
  BaseScreen2,
  BaseCard,
  BaseText,
  IconButton,
  BaseHorizontalScrollView,
  BaseLoadableView,
} from '../../Components';
import {
  ACCOUNT_TYPES,
  EQUITY_TYPES,
  ACCOUNT_TYPE_BANK_ACCOUNT,
  EQUITY_TYPE_ASSET,
  EQUITY_TYPE_DEBT,
} from '../../_shared/apis/enum';
import { useDimension } from '../../_shared/hooks';
import { Amount } from '../../_shared/object';
import { capitalize, DEFAULT_CURRENCY } from '../../_shared/util';

const accounts = [
  {
    name: 'DBS',
    type: ACCOUNT_TYPE_BANK_ACCOUNT,
    value: 20000,
  },
  {
    name: 'DBS',
    type: ACCOUNT_TYPE_BANK_ACCOUNT,
    value: 20000,
  },
  {
    name: 'DBS',
    type: ACCOUNT_TYPE_BANK_ACCOUNT,
    value: 20000,
  },
];
const InsightsScreen = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);
  const navigation = useNavigation();

  return (
    <BaseScreen2
      headerProps={{
        allowDrawer: true,
        allowHideInfo: true,
      }}
      enablePadding={true}>
      <BaseLoadableView scrollable>
        <AggrSummary2
          items={[
            { val: 12333, title: 'Asset' },
            { val: 120000, title: 'Net Worth' },
            { val: 1234, title: 'Debt' },
          ]}
        />
        <MetricsContent />
        <EquityContent type={EQUITY_TYPE_ASSET} />
        <EquityContent type={EQUITY_TYPE_DEBT} />
      </BaseLoadableView>
    </BaseScreen2>
  );
};

const MetricsContent = () => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);

  return (
    <View style={styles.contentContainer}>
      <BaseText h4 margin={{ vertical: 10 }} color={theme.colors.color7}>
        Metrics
      </BaseText>

      <View style={[styles.contentBody, styles.metricContentBody]}>
        <MetricInfo name="Debt ratio" val="10%" />
        <MetricInfo name="Investment ratio" val="10%" />
        <MetricInfo name="Emergency fund ratio" val="10%" />
      </View>
    </View>
  );
};

const MetricInfo = ({ name = '', val = '' }) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);

  return (
    <View style={styles.metricInfo}>
      <BaseText h2>{val}</BaseText>
      <View style={{ width: 80 }}>
        <BaseText text6 center color={theme.colors.color8}>
          {name}
        </BaseText>
      </View>
    </View>
  );
};

const EquityContent = ({ type = EQUITY_TYPE_ASSET }) => {
  const { theme } = useTheme();
  const { screenWidth, screenHeight } = useDimension();
  const styles = getStyles(theme, screenWidth, screenHeight);

  return (
    <View style={styles.contentContainer}>
      <BaseText h4 margin={{ vertical: 10 }} color={theme.colors.color7}>
        Your {capitalize(EQUITY_TYPES[type])}
      </BaseText>

      <View style={styles.contentBody}>
        <View style={styles.btnContainer}>
          <IconButton
            iconType="entypo"
            iconName="plus"
            iconSize={20}
            color={theme.colors.color8}
          />
        </View>

        <BaseHorizontalScrollView>
          {accounts.map((d, idx) => (
            <View style={styles.card} key={idx}>
              <EquityCard name={d.name} type={d.type} value={d.value} />
            </View>
          ))}
        </BaseHorizontalScrollView>
      </View>
    </View>
  );
};

const EquityCard = ({
  name = '',
  type = ACCOUNT_TYPE_BANK_ACCOUNT,
  value = 0,
  currency = DEFAULT_CURRENCY,
}) => {
  const { theme } = useTheme();
  const { screenWidth } = useDimension();

  return (
    <BaseCard width={screenWidth / 3.2}>
      <BaseText text1 numberOfLines={1}>
        {name}
      </BaseText>
      <BaseText
        text5
        color={theme.colors.color8}
        margin={{ top: 4 }}
        numberOfLines={1}>
        {ACCOUNT_TYPES[type]}
      </BaseText>
      <AmountText
        text4
        margin={{ top: 8 }}
        color={theme.colors.color7}
        amount={new Amount(value, currency)}
      />
    </BaseCard>
  );
};

const getStyles = (theme, screenWidth, screenHeight) =>
  StyleSheet.create({
    contentContainer: {
      marginTop: 14,
    },
    contentBody: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    btnContainer: {
      paddingVertical: 10,
      paddingHorizontal: 4,
      marginRight: 14,
      borderWidth: 1.5,
      borderRadius: 6,
      borderColor: theme.colors.color7,
      borderStyle: 'dotted',
    },
    card: {
      marginRight: 20,
    },
    metricContentBody: {
      justifyContent: 'space-between',
      // marginTop: 20,
    },
    metricInfo: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '100%',
    },
  });

export default InsightsScreen;
