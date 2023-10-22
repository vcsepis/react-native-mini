import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import ProfilePic from './ProfilePic';

interface HeaderBarProps {
  title?: string;
  navigation?: any;
}

const HeaderBar: React.FC<HeaderBarProps> = ({title, navigation}) => {
  return (
    <View style={styles.HeaderContainer}>
      {/* <GradientBGIcon
        name="menu"
        color={COLORS.primaryLightGreyHex}
        size={FONTSIZE.size_16}
      /> */}
      <View>
        <TouchableOpacity onPress={() => navigation.push('Store')}>
          <Text style={styles.LocationText}>
            Your location <Text style={styles.LocationSelected}>▾</Text>
          </Text>
        </TouchableOpacity>
        <Text style={styles.LocationName}>Yokohama, Japan</Text>
      </View>
      <Text style={styles.HeaderText}>{title}</Text>
      <ProfilePic />
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    padding: SPACING.space_30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.secondaryBlackRGBA,
  },
  LocationText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.secondaryBlackRGBA,
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

export default HeaderBar;
