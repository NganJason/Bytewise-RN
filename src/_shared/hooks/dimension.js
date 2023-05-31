import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const useDimension = () => {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get('window').height,
  );

  useEffect(() => {
    const updateScreenDimensions = ({ window }) => {
      setScreenWidth(window.width);
      setScreenHeight(window.height);
    };

    Dimensions.addEventListener('change', updateScreenDimensions);
  }, []);

  return { screenWidth, screenHeight };
};

export default useDimension;
