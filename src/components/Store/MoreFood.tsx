import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../../theme/theme';

interface MoreFoodsProps {
  title?: string;
  navigation?: any;
}

const MoreFoods: React.FC<MoreFoodsProps> = ({}) => {
  return (
    <View style={styles.ShipContainer}>
      <View style={styles.HeaderShipContainer}>
        <View
          style={{
            padding: widthResponsive(10),
            borderRadius: SPACING.space_15,
            borderWidth: 1,
            borderColor: '#DADADA',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <View style={{justifyContent: 'space-between'}}>
              <Text style={styles.TextGoodFoodMemo}>
                Do you need anything else?
              </Text>
              <Text style={styles.TextDistance}>
                Choose additional dishes if you want
              </Text>
            </View>
          </View>

          <TouchableOpacity>
            <View
              style={{
                padding: widthResponsive(10),
                borderRadius: SPACING.space_15,
                borderColor: '#1C5915',
                borderWidth: widthResponsive(1),
              }}>
              <Text style={styles.TextChangeLocation}>Choose dish</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ShipContainer: {
    paddingVertical: SPACING.space_20,
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
    color: '#22521D',
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
    fontWeight: '700',
  },
});

export default MoreFoods;
