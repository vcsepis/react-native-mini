import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../../theme/theme';
import StoreProfilePic from './StoreProfilePic';

interface HeaderStoreProps {
  title?: string;
  navigation?: any;
}

const HeaderStore: React.FC<HeaderStoreProps> = ({title, navigation}) => {
  return (
    <View style={styles.HeaderContainer}>
      <TouchableOpacity
        style={styles.StoreTextNmContainer}
        onPress={() => navigation.push('Store')}>
        <Text style={styles.StoreTextNm}>
          Sasin - Mi Cay 7 Cap Do Han Quoc, Nguyen Van Qua
        </Text>
      </TouchableOpacity>
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
    width: '80%',
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
