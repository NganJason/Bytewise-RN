import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';

import { BaseImage, BaseScreenV2, BaseText, BaseButton } from '../Components';
import { useDimension } from '../_shared/hooks';
import {
  savingsIntro,
  budgetIntro,
  expensesIntro,
  metricsIntro,
} from '../_shared/constant/asset';
import ROUTES from '../_shared/constant/routes';

const getImages = (styles = {}) => [
  {
    image: (
      <BaseImage
        width={'100%'}
        source={savingsIntro}
        containerStyle={styles.imgContainer}
        resizeMode="cover"
      />
    ),
    title: 'Investments & Savings',
    desc: 'Track your net worth',
  },
  {
    image: (
      <BaseImage
        width={'100%'}
        source={metricsIntro}
        containerStyle={styles.imgContainer}
        resizeMode="cover"
      />
    ),
    title: 'Financial Metrics',
    desc: 'Know your financial health',
  },
  {
    image: (
      <BaseImage
        width={'100%'}
        source={budgetIntro}
        containerStyle={styles.imgContainer}
        resizeMode="cover"
      />
    ),
    title: 'Budgeting',
    desc: 'Allocate your spending',
  },
  {
    image: (
      <BaseImage
        width={'100%'}
        source={expensesIntro}
        containerStyle={styles.imgContainer}
        resizeMode="cover"
      />
    ),
    title: 'Income & Expense',
    desc: 'Understand your cash flow',
  },
];

const IntroScreen = () => {
  const ref = useRef();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  const { screenWidth, screenHeight } = useDimension();

  const [activeIndex, setActiveIndex] = useState(0);

  const IMAGES = getImages(styles);

  return (
    <BaseScreenV2>
      <View style={styles.body}>
        <Carousel
          ref={ref}
          width={screenWidth}
          height={screenHeight * 0.6}
          style={styles.carousel}
          autoPlay
          autoPlayInterval={5000}
          data={IMAGES}
          onProgressChange={(_, absoluteProgress) => {
            let index = Math.round(absoluteProgress);
            if (index >= IMAGES.length) {
              index = 0;
            }
            setActiveIndex(index);
          }}
          renderItem={({ index, item }) => (
            <View key={index} style={styles.carouselItem}>
              {item.image}
              <BaseText h3 style={styles.text}>
                {item.title}
              </BaseText>
              <BaseText h5 style={[styles.text, styles.desc]}>
                {item.desc}
              </BaseText>
            </View>
          )}
        />
        <View style={styles.indicatorContainer}>
          <AnimatedDotsCarousel
            length={IMAGES.length}
            currentIndex={activeIndex}
            maxIndicators={IMAGES.length}
            interpolateOpacityAndColor={true}
            activeIndicatorConfig={styles.activeIndicator}
            inactiveIndicatorConfig={styles.inactiveIndicator}
            decreasingDots={[
              {
                config: { color: 'white', margin: 3, opacity: 0.5, size: 6 },
                quantity: 1,
              },
              {
                config: { color: 'white', margin: 3, opacity: 0.5, size: 4 },
                quantity: 1,
              },
            ]}
          />
        </View>
        <BaseButton
          title="Log In"
          width={screenWidth * 0.5}
          margin={{ bottom: 14 }}
          size="lg"
          onPress={() => navigation.navigate(ROUTES.login)}
        />
        <BaseButton
          title="Sign Up"
          width={screenWidth * 0.5}
          size="lg"
          type="outline"
          onPress={() => navigation.navigate(ROUTES.signup)}
        />
      </View>
    </BaseScreenV2>
  );
};

const getStyles = theme => {
  return StyleSheet.create({
    body: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    carousel: {
      justifyContent: 'center',
      width: '100%',
      marginBottom: 20,
    },
    carouselItem: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    indicatorContainer: {
      marginBottom: 26,
      height: 10,
    },
    activeIndicator: {
      color: theme.colors.color1,
      margin: 6,
      opacity: 1,
      size: 8,
    },
    inactiveIndicator: {
      color: theme.colors.black,
      margin: 6,
      opacity: 0.3,
      size: 8,
    },
    imgContainer: {
      flex: 1,
    },
    text: {
      textAlign: 'center',
    },
    desc: {
      marginTop: 4,
      color: theme.colors.color7,
    },
  });
};

export default IntroScreen;
