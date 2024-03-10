import React, {useRef} from 'react';
import {TouchableOpacity, StyleSheet, Animated, View} from 'react-native';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import IconCheck from '../assets/icon/ic_check.svg';
import {Text} from 'react-native';

const Checkbox = ({
  onPress,
  isChecked,
  checkboxStyle,
  disabled,
  price,
}: any) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    const toValue = isChecked ? 0 : 30;
    Animated.timing(animatedWidth, {
      toValue: toValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.View}>
      {price && <Text style={styles.TextCommon}>${price}</Text>}

      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          startAnimation();
          onPress();
        }}
        style={[
          styles.checkbox,
          isChecked && styles.checkboxSelected,
          checkboxStyle,
          disabled && styles.checkboxDisabled,
        ]}>
        {isChecked && (
          <IconCheck width={widthResponsive(6)} height={widthResponsive(6)} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderColor: COLORS.primaryWhiteHex,
    borderWidth: widthResponsive(0.5),
    borderRadius: 5,
    height: widthResponsive(8),
    width: widthResponsive(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_medium,
    marginRight: SPACING.space_10,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_14,
  },
  View: {flexDirection: 'row', alignItems: 'center'},
  checkboxSelected: {
    borderColor: '#008810',
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 10,
  },
  checkboxDisabled: {
    backgroundColor: '#ddd',
  },
});

export default Checkbox;
