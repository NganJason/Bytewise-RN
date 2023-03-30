import { useState } from 'react';
import { Icon, useTheme } from '@rneui/themed';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { BaseText } from '../../Components';
import Collapsible from 'react-native-collapsible';

const AssetRow = ({ navigation, assetType }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  const getExpandedShadow = () => {
    if (expanded) {
      return {
        backgroundColor: '#fff',
        shadowColor: theme.colors.grey3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 0,
        elevation: 0,
        verflow: 'hidden',
      };
    }

    return {};
  };

  const getExpandedTextColor = () => {
    if (expanded) {
      return { color: theme.colors.primary };
    }

    return {};
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View style={{ ...styles.assetItem, ...getExpandedShadow() }}>
          <>
            <View style={styles.assetItemTitle}>
              <BaseText
                h2
                style={{
                  color: theme.colors.grey2,
                  ...getExpandedTextColor(),
                }}>
                {assetType}
              </BaseText>
              {expanded ? (
                <Icon
                  name="chevron-up"
                  type="entypo"
                  color={theme.colors.grey4}
                />
              ) : (
                <Icon
                  name="chevron-down"
                  type="entypo"
                  color={theme.colors.grey4}
                />
              )}
            </View>

            <View style={styles.assetItemInfo}>
              <BaseText h2 style={{ color: theme.colors.grey2 }}>
                $ 20,000
              </BaseText>
            </View>
          </>
        </View>
      </TouchableWithoutFeedback>

      <Collapsible collapsed={!expanded}>
        <View style={styles.assetItem}>
          <TouchableWithoutFeedback>
            <>
              <View style={styles.assetItemTitle}>
                <BaseText h2 style={{ color: theme.colors.grey2 }}>
                  Cash
                </BaseText>
                <Icon
                  name="chevron-right"
                  type="entypo"
                  color={theme.colors.grey4}
                />
              </View>

              <View style={styles.assetItemInfo}>
                <BaseText h2 style={{ color: theme.colors.grey2 }}>
                  $ 5,000
                </BaseText>
              </View>
            </>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.assetItem}>
          <TouchableWithoutFeedback>
            <>
              <View style={styles.assetItemTitle}>
                <BaseText h2 style={{ color: theme.colors.grey2 }}>
                  Investment
                </BaseText>
                <Icon
                  name="chevron-right"
                  type="entypo"
                  color={theme.colors.grey4}
                />
              </View>

              <View style={styles.assetItemInfo}>
                <BaseText h2 style={{ color: theme.colors.grey2 }}>
                  $ 15,000
                </BaseText>
              </View>
            </>
          </TouchableWithoutFeedback>
        </View>
      </Collapsible>
    </>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    assetItem: {
      paddingVertical: theme.spacing.xl,
      borderColor: theme.colors.grey,
      borderBottomWidth: 0.4,
    },
    assetItemTitle: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    assetItemInfo: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  });
};

export default AssetRow;
