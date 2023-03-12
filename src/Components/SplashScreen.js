import Lottie from 'lottie-react-native';

import ScreenTemplate from './ScreenTemplate';

const SplashScreen = () => {
  return (
    <ScreenTemplate>
      <Lottie source={require('../../assets/splash.json')} autoPlay loop />
    </ScreenTemplate>
  );
};

export default SplashScreen;
