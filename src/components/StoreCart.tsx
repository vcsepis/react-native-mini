import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import CustomIcon from './CustomIcon';
import {useStore} from '../store/store';
import LottieView from 'lottie-react-native';

interface StoreCartProps {}

const StoreCart: React.FC<StoreCartProps> = ({}) => {
  const StoreCart = useStore((state: any) => state.StoreCart);
  const onIsShowProduct = useStore((state: any) => state.onIsShowProduct);
  const addProductCurrent = useStore((state: any) => state.addProductCurrent);

  const handlePressProduct = (product: any) => {
    addProductCurrent(product);
    onIsShowProduct(true);
  };

  const onSubmit = () => {};

  return (
    <View style={styles.Root}>
      <View style={styles.Header}>
        <Text style={styles.TextTitle}>Current Printer</Text>
        <Text style={styles.TextTotalPriceCartFood}>
          items {`(${StoreCart?.length})`}
        </Text>
      </View>

      {StoreCart?.length ? (
        <ScrollView style={styles.CartContainer}>
          {StoreCart?.map((item: any) => (
            <TouchableOpacity
              onPress={() => handlePressProduct(item)}
              style={{
                backgroundColor: '#ddd',
                borderRadius: SPACING.space_15,
                padding: SPACING.space_10,
                width: '100%',
                marginBottom: SPACING.space_10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={require('../assets/app_images/discout.png')}
                  style={styles.ItemImage}
                />
                <View
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    width: '60%',
                  }}>
                  <Text style={styles.TextNameProduct} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.DescriptionContainer}>
                    <Text style={styles.TextDescription}>
                      {item.description || 'Do descrption'}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingTop: SPACING.space_20,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      marginLeft: SPACING.space_10,
                    }}>
                    <View>
                      <Text style={styles.TextCommon}>Price</Text>
                      <Text style={styles.TextPrice}>123 $</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.ContainerInputSpiner}>
                  <TouchableOpacity
                    style={styles.InputSpinerAction}
                    onPress={() => {}}>
                    <CustomIcon
                      name="minus"
                      color={COLORS.primaryLightGreyHex}
                      size={FONTSIZE.size_10}
                    />
                  </TouchableOpacity>
                  <View style={styles.CartItemQuantityContainer}>
                    <Text style={styles.CartItemQuantityText}>{1}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.InputSpinerAction}
                    onPress={() => {}}>
                    <CustomIcon
                      name="add"
                      color={COLORS.primaryLightGreyHex}
                      size={FONTSIZE.size_10}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity style={styles.ContainerAnimationPrettie}>
          <LottieView
            style={styles.AnimationPrettie}
            source={require('../lottie/empty.json')}
            autoPlay
            loop
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
        }}
        onPress={onSubmit}>
        <View
          style={{
            backgroundColor: COLORS.primaryWhiteHex,
          }}>
          <View style={styles.CartDisplayData}>
            <View style={styles.CartContentCount}>
              <Text style={styles.TextCountCartFood} numberOfLines={1}>
                Tax
              </Text>
            </View>

            <Text style={styles.TextTotalPriceCartFood}>0 $</Text>
          </View>
          <View style={styles.CartDisplay}>
            <View style={styles.CartContentCount}>
              <Text style={styles.TextCountCartFood} numberOfLines={1}>
                Price
              </Text>
            </View>

            <Text style={styles.TextTotalPriceCartFood}>{100} $</Text>
            <CustomIcon
              name={'cart'}
              color={'#008810'}
              size={FONTSIZE.size_24}
            />
          </View>

          <View style={styles.CartPaymentDisplay}>
            <Text style={styles.TextTotalPaymentCartFood}>Pay Now</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  Root: {
    flex: 1,
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_16,
  },
  TextNameProduct: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_16,
    fontWeight: '500',
  },
  DescriptionContainer: {
    padding: SPACING.space_10,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
  },
  TextDescription: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_16,
  },
  TextTitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_18,
  },
  AnimationPrettie: {
    height: 300,
    width: 'auto',
    borderRadius: BORDERRADIUS.radius_20,
  },
  ContainerAnimationPrettie: {
    justifyContent: 'center',
    paddingTop: SPACING.space_30 * 6,
  },
  CartContainer: {
    paddingVertical: SPACING.space_20,
    paddingBottom: widthResponsive(40),
  },
  CartDisplay: {
    justifyContent: 'space-between',
    borderRadius: widthResponsive(15),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.space_4,
  },
  CartDisplayData: {
    justifyContent: 'space-between',
    borderRadius: widthResponsive(15),
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.space_8,
  },
  CartContentCount: {
    gap: widthResponsive(2),
    width: '70%',
  },
  CartPaymentDisplay: {
    backgroundColor: '#008810',
    borderRadius: widthResponsive(4),
    padding: widthResponsive(4),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  TextTotalPaymentCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
    fontWeight: '600',
    textAlign: 'center',
  },
  TextCountCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryBlackHex,
    fontWeight: '600',
  },
  TextTotalPriceCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryGreenRGB,
    fontWeight: '600',
    textAlign: 'right',
    marginRight: widthResponsive(4),
  },
  Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TextPrice: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_20,
    fontWeight: '600',
  },
  ContainerInputSpiner: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  InputSpinerAction: {
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_10,
  },
  CartItemQuantityContainer: {
    backgroundColor: COLORS.primaryWhiteHex,
    width: 40,
    borderRadius: BORDERRADIUS.radius_10,
    alignItems: 'center',
    paddingVertical: SPACING.space_8,
    marginHorizontal: SPACING.space_8,
  },
  CartItemQuantityText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
  },
  ItemImage: {
    height: widthResponsive(26),
    width: widthResponsive(26),
    borderRadius: BORDERRADIUS.radius_15,
  },
});

export default StoreCart;
