import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';

interface PopUpAnimationProps {
  style: any;
  source: any;
  navigation?: any;
}

const PopUpAnimation: React.FC<PopUpAnimationProps> = ({
  style,
  source,
  navigation,
}) => {
  return (
    <TouchableOpacity
      style={styles.LottieAnimationContainer}
      onPress={navigation}>
      <LottieView style={style} source={source} autoPlay loop={false} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  LottieAnimationContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: COLORS.secondaryBlackRGBA,
    justifyContent: 'center',
  },
});

export default PopUpAnimation;
