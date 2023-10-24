import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../../theme/theme';
import CustomIcon from '../CustomIcon';

interface LocationInfoProps {
  title?: string;
  navigation?: any;
}

const LocationInfo: React.FC<LocationInfoProps> = ({title, navigation}) => {
  return (
    <View style={styles.HeaderContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{paddingVertical: widthResponsive(20)}}>
        <View style={{paddingHorizontal: widthResponsive(20)}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                paddingBottom: 4,
              }}>
              <CustomIcon
                name={'star'}
                color={COLORS.primaryOrangeHex}
                size={FONTSIZE.size_16}
              />
              <Text style={styles.TextGoodFoodMemo}>4.3</Text>
            </View>
            <Text style={styles.TextNmMemo}>See reviews</Text>
          </View>
        </View>

        <View
          style={{
            borderRightColor: '#6D6D6D',
            borderRightWidth: 1,
            opacity: 0.2,
          }}
        />

        <View style={{paddingHorizontal: widthResponsive(20)}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                paddingBottom: 4,
              }}>
              <CustomIcon
                name={'location'}
                color={'#A80017'}
                size={FONTSIZE.size_16}
              />
              <Text style={styles.TextGoodFoodMemo}>2.67 km</Text>
            </View>
            <Text style={styles.TextNmMemo}>Distance</Text>
          </View>
        </View>

        <View
          style={{
            borderRightColor: '#6D6D6D',
            borderRightWidth: 1,
            opacity: 0.2,
          }}
        />

        <View style={{paddingHorizontal: widthResponsive(20)}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                paddingBottom: 4,
              }}>
              <Text style={styles.TextGoodFoodMemo}>$$$$</Text>
            </View>
            <Text style={styles.TextNmMemo}>40k - 100k</Text>
          </View>
        </View>

        <View
          style={{
            borderRightColor: '#6D6D6D',
            borderRightWidth: 1,
            opacity: 0.2,
          }}
        />

        <View style={{paddingHorizontal: widthResponsive(20)}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                paddingBottom: 4,
              }}>
              <CustomIcon
                name={''}
                color={COLORS.primaryOrangeHex}
                size={FONTSIZE.size_16}
              />
              <Text style={styles.TextGoodFoodMemo}>80+ rating</Text>
            </View>
            <Text style={styles.TextNmMemo}>Wonderfully fresh</Text>
          </View>
        </View>

        <View
          style={{
            borderRightColor: '#6D6D6D',
            borderRightWidth: 1,
            opacity: 0.2,
          }}
        />

        <View style={{paddingHorizontal: widthResponsive(20)}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                paddingBottom: 4,
              }}>
              <CustomIcon
                name={'like'}
                color={'#A80017'}
                size={FONTSIZE.size_16}
              />
              <Text style={styles.TextGoodFoodMemo}>80+ rating</Text>
            </View>
            <Text style={styles.TextNmMemo}>Seasoning is impeccable</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    paddingHorizontal: SPACING.space_10,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    alignContent: 'center',
  },
  TextGoodFoodMemo: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryBlackHex,
    fontWeight: '600',
  },
  TextNmMemo: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryLightGreyHex,
  },
});

export default LocationInfo;
