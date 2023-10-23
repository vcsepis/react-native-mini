import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import GradientBGIcon from '../components/GradientBGIcon';
import PaymentMethod from '../components/PaymentMethod';
import PaymentFooter from '../components/PaymentFooter';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import {useStore} from '../store/store';
import PopUpAnimation from '../components/PopUpAnimation';
import MoreFoods from '../components/Store/MoreFood';
import ShipStore from '../components/Store/ShipStore';

const PaymentList = [
  {
    name: 'Credit Card',
    icon: 'icon',
    isIcon: true,
  },
  {
    name: 'Wallet',
    icon: 'icon',
    isIcon: true,
  },
  {
    name: Platform.OS ? 'Apple Pay' : 'Google Pay',
    icon: Platform.OS
      ? require('../assets/app_images/applepay.png')
      : require('../assets/app_images/gpay.png'),
    isIcon: false,
  },
  {
    name: 'Amazon Pay',
    icon: require('../assets/app_images/amazonpay.png'),
    isIcon: false,
  },
];

const PaymentScreen = ({navigation, route}: any) => {
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  const addToOrderHistoryListFromCart = useStore(
    (state: any) => state.addToOrderHistoryListFromCart,
  );

  const [paymentMode, setPaymentMode] = useState('Credit Card');
  const [showAnimation, setShowAnimation] = useState(false);

  const buttonPressHandler = () => {
    setShowAnimation(true);
    addToOrderHistoryListFromCart();
    calculateCartPrice();
    setTimeout(() => {
      setShowAnimation(false);
      navigation.navigate('History');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      {showAnimation ? (
        <PopUpAnimation
          style={styles.LottieAnimation}
          source={require('../lottie/successful.json')}
        />
      ) : (
        <></>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View style={styles.HeaderContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}>
            <CustomIcon
              name="left"
              color={COLORS.primaryLightGreyHex}
              size={FONTSIZE.size_16}
            />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Payments</Text>
          <View style={styles.EmptyView} />
        </View>

        {/* Ship Info */}
        <ShipStore />

        {/* Location */}
        <View
          style={{
            paddingHorizontal: SPACING.space_20,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View style={{gap: 6}}>
            <Text style={styles.TextLocationNmMemo}>Dia diem giao hang</Text>
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
              <Text style={styles.TextChangeLocation}>Thay doi dia diem</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Cuppons */}
        {/* <CupponStore /> */}

        {/* More Foods */}
        <MoreFoods />

        {/* Includes payment */}
        <View
          style={{
            marginHorizontal: SPACING.space_20,
            borderRadius: SPACING.space_15,
            borderColor: '#DADADA',
            borderWidth: widthResponsive(1),
            padding: widthResponsive(10),
            gap: widthResponsive(6),
          }}>
          <Text style={styles.TextIncludeBill}>Tom tat thanh toan</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.TextDistance}>Total</Text>
            <Text style={styles.TextDistance}>{route.params.amount} $</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.TextDistance}>Tax</Text>
            <Text style={styles.TextDistance}>
              {(route.params.amount / 10)?.toFixed(0)} $
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.TextDistance}>Delivery</Text>
            <Text style={styles.TextDistance}>25 phut</Text>
          </View>
        </View>

        <Text style={styles.TextTitleDriver}>Phuong thuc thanh toan</Text>

        <View style={styles.PaymentOptionsContainer}>
          {/* <TouchableOpacity
            onPress={() => {
              setPaymentMode('Credit Card');
            }}>
            <View
              style={[
                styles.CreditCardContainer,
                {
                  borderColor:
                    paymentMode == 'Credit Card'
                      ? COLORS.primaryOrangeHex
                      : COLORS.primaryWhiteHex,
                },
              ]}>
              <Text style={styles.CreditCardTitle}>Credit Card</Text>
              <View style={styles.CreditCardBG}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.LinearGradientStyle}
                  colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}>
                  <View style={styles.CreditCardRow}>
                    <CustomIcon
                      name="chip"
                      size={FONTSIZE.size_20 * 2}
                      color={COLORS.primaryOrangeHex}
                    />
                    <CustomIcon
                      name="visa"
                      size={FONTSIZE.size_30 * 2}
                      color={COLORS.primaryWhiteHex}
                    />
                  </View>
                  <View style={styles.CreditCardNumberContainer}>
                    <Text style={styles.CreditCardNumber}>3879</Text>
                    <Text style={styles.CreditCardNumber}>8923</Text>
                    <Text style={styles.CreditCardNumber}>6745</Text>
                    <Text style={styles.CreditCardNumber}>4638</Text>
                  </View>
                  <View style={styles.CreditCardRow}>
                    <View style={styles.CreditCardNameContainer}>
                      <Text style={styles.CreditCardNameSubitle}>
                        Card Holder Name
                      </Text>
                      <Text style={styles.CreditCardNameTitle}>
                        Robert Evans
                      </Text>
                    </View>
                    <View style={styles.CreditCardDateContainer}>
                      <Text style={styles.CreditCardNameSubitle}>
                        Expiry Date
                      </Text>
                      <Text style={styles.CreditCardNameTitle}>02/30</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </TouchableOpacity> */}
          {PaymentList.map((data: any) => (
            <TouchableOpacity
              key={data.name}
              onPress={() => {
                setPaymentMode(data.name);
              }}>
              <PaymentMethod
                paymentMode={paymentMode}
                name={data.name}
                icon={data.icon}
                isIcon={data.isIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <PaymentFooter
        buttonTitle={`Pay with ${paymentMode}`}
        price={{price: route.params.amount, currency: '$'}}
        buttonPressHandler={buttonPressHandler}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryWhiteHex,
  },
  LottieAnimation: {
    flex: 1,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  HeaderContainer: {
    paddingHorizontal: SPACING.space_24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.secondaryBlackRGB,
  },
  EmptyView: {
    height: SPACING.space_36,
    width: SPACING.space_36,
  },
  PaymentOptionsContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_15,
  },
  CreditCardContainer: {
    padding: SPACING.space_10,
    gap: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_15 * 2,
    borderWidth: 3,
  },
  CreditCardTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryBlackHex,
    marginLeft: SPACING.space_10,
  },
  CreditCardBG: {
    backgroundColor: COLORS.primaryGreyHex,
    borderRadius: BORDERRADIUS.radius_25,
  },
  LinearGradientStyle: {
    borderRadius: BORDERRADIUS.radius_25,
    gap: SPACING.space_36,
    paddingHorizontal: SPACING.space_15,
    paddingVertical: SPACING.space_10,
  },
  CreditCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CreditCardNumberContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  CreditCardNumber: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
    letterSpacing: SPACING.space_4 + SPACING.space_2,
  },
  CreditCardNameSubitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.secondaryLightGreyHex,
  },
  CreditCardNameTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
  CreditCardNameContainer: {
    alignItems: 'flex-start',
  },
  CreditCardDateContainer: {
    alignItems: 'flex-end',
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
  TextTitleDriver: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryBlackHex,
    padding: SPACING.space_20,
    fontWeight: '600',
  },
  TextIncludeBill: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryBlackHex,
    fontWeight: '600',
  },
  TextDistance: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryLightGreyHex,
  },
});

export default PaymentScreen;
