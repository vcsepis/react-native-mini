import React, {useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from 'react-native';
import {useStore} from '../store/store';
// import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PaymentFooter from '../components/PaymentFooter';
import CartItem from '../components/CartItem';
import GradientBGIcon from '../components/GradientBGIcon';
import ShipStore from '../components/Store/ShipStore';
import CupponStore from '../components/Store/Cuppon';
import CustomIcon from '../components/CustomIcon';
import MoreFoods from '../components/Store/MoreFood';

const CartScreen = ({navigation, _route}: any) => {
  const CartList = useStore((state: any) => state.CartList);
  const CartPrice = useStore((state: any) => state.CartPrice);
  const incrementCartItemQuantity = useStore(
    (state: any) => state.incrementCartItemQuantity,
  );
  const decrementCartItemQuantity = useStore(
    (state: any) => state.decrementCartItemQuantity,
  );
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  // const tabBarHeight = useBottomTabBarHeight();

  const [viewHeight, setViewHeight] = useState(0);

  const onLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setViewHeight(height + widthResponsive(10));
  };

  const buttonPressHandler = () => {
    navigation.push('Payment', {amount: CartPrice});
  };

  const incrementCartItemQuantityHandler = (id: string, size: string) => {
    incrementCartItemQuantity(id, size);
    calculateCartPrice();
  };

  const decrementCartItemQuantityHandler = (id: string, size: string) => {
    decrementCartItemQuantity(id, size);
    calculateCartPrice();
  };

  const BackHandler = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.ImageHeaderBarContainerWithBack}>
        <TouchableOpacity onPress={BackHandler}>
          <CustomIcon
            name="left"
            color={COLORS.primaryLightGreyHex}
            size={FONTSIZE.size_16}
          />
        </TouchableOpacity>

        <Text style={styles.StoreTextNm} numberOfLines={1}>
          Sasin - Mi Cay 7 Cap Do Han Quoc, Nguyen Van Qua
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          ...styles.ScrollViewFlex,
          paddingBottom: viewHeight,
        }}>
        <View
          style={[
            styles.ScrollViewInnerView,
            // {marginBottom: tabBarHeight}
          ]}>
          <View style={styles.ItemContainer}>
            {/* Ship Info */}
            <ShipStore />

            {/* Location */}
            <View
              style={{
                paddingHorizontal: SPACING.space_24,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <View style={{gap: 6}}>
                <Text style={styles.TextLocationNmMemo}>Location delivery</Text>
                <Text style={styles.TextGoodFoodMemo}>Ho Chi minh</Text>
              </View>

              <TouchableOpacity>
                <View
                  style={{
                    padding: widthResponsive(10),
                    borderRadius: SPACING.space_15,
                    borderColor: '#1C5915',
                    borderWidth: widthResponsive(1),
                  }}>
                  <Text style={styles.TextChangeLocation}>
                    Change location delivery
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Note Ship */}
            <View
              style={{
                padding: widthResponsive(10),
                backgroundColor: '#D8FFD7',
                borderRadius: SPACING.space_15,
                marginHorizontal: widthResponsive(20),
                marginVertical: widthResponsive(20),
                borderWidth: 1,
                borderColor: '#D8FFD7',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomIcon
                name={'location'}
                color={'#A80017'}
                size={FONTSIZE.size_16}
              />
              <Text style={styles.TextMemo}>
                Adding location information will help drivers find their way
                more easily.
              </Text>
            </View>

            {CartList.length == 0 ? (
              <EmptyListAnimation title={'Cart is Empty'} />
            ) : (
              <View style={styles.ListItemContainer}>
                {CartList.map((data: any) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', {
                        index: data.index,
                        id: data.id,
                        type: data.type,
                      });
                    }}
                    key={data.id}>
                    <CartItem
                      id={data.id}
                      name={data.name}
                      imagelink_square={data.imagelink_square}
                      special_ingredient={data.special_ingredient}
                      roasted={data.roasted}
                      prices={data.prices}
                      type={data.type}
                      incrementCartItemQuantityHandler={
                        incrementCartItemQuantityHandler
                      }
                      decrementCartItemQuantityHandler={
                        decrementCartItemQuantityHandler
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* More Foods */}
            <MoreFoods />
          </View>

          {/* {CartList.length != 0 ? (
            <PaymentFooter
              buttonPressHandler={buttonPressHandler}
              buttonTitle="Pay"
              price={{price: CartPrice, currency: '$'}}
            />
          ) : (
            <></>
          )} */}
        </View>
      </ScrollView>

      {CartList.length != 0 ? (
        <TouchableOpacity onPress={buttonPressHandler}>
          <View
            onLayout={onLayout}
            style={{
              backgroundColor: COLORS.primaryWhiteHex,
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
            }}>
            <View style={styles.CartDisplay}>
              <View style={styles.CartContentCount}>
                <Text style={styles.TextCountCartFood}>
                  {CartList?.length} dish
                </Text>
                <Text style={styles.TextCountCartFood} numberOfLines={1}>
                  Sasin - Mi Cay 7 Cap Do Han Quoc, Nguyen Van Qua
                </Text>
              </View>

              <Text style={styles.TextTotalPriceCartFood}>{CartPrice} $</Text>
              <CustomIcon
                name={'cart'}
                color={'#008810'}
                size={FONTSIZE.size_24}
              />
            </View>

            <View style={styles.CartPaymentDisplay}>
              <Text style={styles.TextTotalPaymentCartFood}>Thanh toan</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryWhiteHex,
    position: 'relative',
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ItemContainer: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_20,
  },
  ImageHeaderBarContainerWithBack: {
    paddingHorizontal: SPACING.space_20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    width: '90%',
    paddingBottom: widthResponsive(10),
  },
  StoreTextNm: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.secondaryBlackRGB,
  },
  TextMemo: {
    fontFamily: FONTFAMILY.poppins_light,
    fontSize: FONTSIZE.size_10,
    color: COLORS.primaryBlackHex,
    marginLeft: widthResponsive(6),
    fontWeight: '500',
  },
  TextGoodFoodMemo: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex,
    fontWeight: '600',
  },
  TextLocationNmMemo: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryBlackHex,
  },
  TextChangeLocation: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: '#195B00',
    fontWeight: '700',
  },
  TextCountCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryBlackHex,
    fontWeight: '600',
  },
  TextTotalPriceCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex,
    fontWeight: '600',
    textAlign: 'right',
    marginRight: widthResponsive(4),
  },
  CartDisplay: {
    justifyContent: 'space-between',
    marginHorizontal: widthResponsive(20),
    borderRadius: widthResponsive(15),
    padding: widthResponsive(8),
    paddingHorizontal: widthResponsive(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  CartContentCount: {
    gap: widthResponsive(2),
    width: '70%',
  },
  CartPaymentDisplay: {
    backgroundColor: '#008810',
    marginHorizontal: widthResponsive(20),
    borderRadius: widthResponsive(15),
    padding: widthResponsive(8),
    paddingHorizontal: widthResponsive(10),
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
    marginRight: widthResponsive(4),
    textAlign: 'center',
  },
});

export default CartScreen;
