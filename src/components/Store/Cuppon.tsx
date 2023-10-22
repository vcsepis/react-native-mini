import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../../theme/theme';
import CustomIcon from '../CustomIcon';

interface CupponStoreProps {
  title?: string;
  navigation?: any;
}

const CupponStore: React.FC<CupponStoreProps> = ({}) => {
  return (
    <View style={styles.ShipContainer}>
      <View style={styles.HeaderShipContainer}>
        <View
          style={{
            padding: widthResponsive(8),
            borderTopLeftRadius: SPACING.space_15,
            borderTopRightRadius: SPACING.space_15,
            borderWidth: 1,
            borderColor: '#DADADA',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.ImageContainer}>
              <Image
                source={require('../../assets/app_images/discout.png')}
                style={styles.Image}
              />
            </View>
            <Text style={styles.TextGoodFoodMemo}>Ban co 2 uu dai</Text>
          </View>

          <TouchableOpacity
            style={[
              {
                transform: [{rotate: '180deg'}],
              },
            ]}>
            <CustomIcon
              name={'left'}
              color={'#A80017'}
              size={FONTSIZE.size_16}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: widthResponsive(8),
            backgroundColor: '#F5F5F5',
            borderBottomLeftRadius: SPACING.space_15,
            borderBottomRightRadius: SPACING.space_15,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: '#DADADA',
          }}>
          <Text style={styles.TextDiscout}>Giam gia den 30% mon an</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ShipContainer: {
    paddingBottom: SPACING.space_20,
    paddingHorizontal: SPACING.space_20,
  },
  HeaderShipContainer: {
    justifyContent: 'center',
    borderRadius: SPACING.space_15,
    alignContent: 'center',
  },
  TextGoodFoodMemo: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryBlackHex,
    fontWeight: '600',
  },
  TextMemo: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: '#5B845B',
    fontWeight: '600',
  },
  TextDiscout: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryLightGreyHex,
    paddingLeft: SPACING.space_10,
    fontWeight: '600',
  },
  ImageContainer: {
    height: SPACING.space_36,
    width: SPACING.space_36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: widthResponsive(22),
    marginRight: widthResponsive(4),
  },
  Image: {
    height: widthResponsive(40),
    width: widthResponsive(40),
  },
  TextDistance: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryLightGreyHex,
  },
  TextChangeLocation: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: '#195B00',
    fontWeight: '600',
  },
});

export default CupponStore;
