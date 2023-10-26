import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../../theme/theme';
import StoreProfilePic from './StoreProfilePic';
import GradientBGIcon from '../GradientBGIcon';
import CustomIcon from '../CustomIcon';

interface HeaderStoreProps {
  title?: string;
  navigation?: any;
  data?: any;
}

const HeaderStore: React.FC<HeaderStoreProps> = ({title, navigation, data}) => {
  const BackHandler = () => navigation.goBack();
  return (
    <View style={styles.HeaderContainer}>
      <TouchableOpacity onPress={BackHandler}>
        <CustomIcon
          name="left"
          color={COLORS.primaryLightGreyHex}
          size={FONTSIZE.size_16}
        />
      </TouchableOpacity>
      <View style={styles.StoreTextNmContainer}>
        <Text style={styles.StoreTextNm}>{data?.name}</Text>
      </View>
      <StoreProfilePic />
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    paddingHorizontal: SPACING.space_20,
    paddingTop: SPACING.space_20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  StoreTextNmContainer: {
    width: '70%',
  },
  StoreTextNm: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.secondaryBlackRGB,
  },
  LocationName: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.secondaryBlackRGBA,
    fontWeight: 'bold',
  },
  LocationSelected: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.secondaryBlackRGBA,
  },
});

export default HeaderStore;
