import { StyleSheet, View } from 'react-native';
import { useTheme, Icon, FAB, Header } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { PacmanIndicator } from 'react-native-indicators';

import HideKeyboard from '../Screen/HideKeyboard';
import IconButton from '../Touch/IconButton';

const BaseScreen = ({
  children,
  fabProps = {
    show: false,
    placement: 'right',
    iconName: '',
    iconType: '',
    iconColor: '',
    color: '',
    onPress: function () {},
  },
  headerProps = {
    allowBack: false,
    leftComponent: null,
    centerComponent: null,
    rightComponent: null,
    leftComponentStyle: {},
    centerComponentStyle: {},
    rightComponentStyle: {},
  },
  isLoading = false,
  bodyStyle = {},
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const navigation = useNavigation();

  const isEmptyHeader = () =>
    headerProps.centerComponent === null && headerProps.rightComponent === null;

  return (
    <>
      <Header
        containerStyle={[
          styles.header,
          isEmptyHeader() ? styles.emptyHeader : styles.nonEmptyHeader,
        ]}
        leftComponent={
          <>
            {headerProps.allowBack && (
              <IconButton
                buttonSize="xs"
                type="clear"
                onPress={() => navigation.goBack()}
                iconName="chevron-left"
                iconType="entypo"
                color={theme.colors.color4}
              />
            )}
            {headerProps.leftComponent}
          </>
        }
        centerComponent={headerProps.centerComponent}
        rightComponent={headerProps.rightComponent}
        leftContainerStyle={{
          ...headerProps.leftComponentStyle,
          ...styles.leftComponentStyle,
        }}
        centerContainerStyle={{
          ...headerProps.centerComponentStyle,
          ...styles.centerComponentStyle,
        }}
        rightContainerStyle={{
          ...headerProps.rightComponentStyle,
          ...styles.rightComponentStyle,
        }}
      />
      <HideKeyboard>
        <View style={{ ...styles.body, ...bodyStyle }}>
          {isLoading ? (
            <PacmanIndicator size={70} color={theme.colors.primary} />
          ) : (
            <>
              {children}
              {fabProps.show && (
                <FAB
                  placement={fabProps.placement}
                  icon={
                    <Icon
                      name={fabProps.iconName}
                      color={fabProps.iconColor}
                      type={fabProps.iconType}
                    />
                  }
                  color={fabProps.color}
                  onPress={fabProps.onPress}
                />
              )}
            </>
          )}
        </View>
      </HideKeyboard>
    </>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    body: {
      paddingHorizontal: 22,
      height: '100%',
      flex: 1,
    },
    header: {
      backgroundColor: theme.colors.white,
      paddingHorizontal: 22,
      borderBottomWidth: 0,
      paddingVertical: 0,
    },
    emptyHeader: {
      paddingVertical: 0,
    },
    nonEmptyHeader: {
      paddingVertical: 18,
    },
    leftComponentStyle: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
    },
    centerComponentStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightComponentStyle: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'row',
    },
  });

export default BaseScreen;
