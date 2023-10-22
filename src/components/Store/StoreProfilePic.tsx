import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {COLORS, SPACING, widthResponsive} from '../../theme/theme';

const StoreProfilePic = () => {
  return (
    <View style={styles.ImageContainer}>
      <Image
        source={require('../../assets/app_images/avatar.png')}
        style={styles.Image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ImageContainer: {
    height: SPACING.space_36,
    width: SPACING.space_36,
    borderRadius: SPACING.space_15,
    borderWidth: 1,
    borderColor: COLORS.primaryLightGreyHex,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: widthResponsive(22),
  },
  Image: {
    height: SPACING.space_36,
    width: SPACING.space_36,
  },
});

export default StoreProfilePic;
