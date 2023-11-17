import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../../theme/theme';
import {PAYMENT_METHOD_TYPE, PaymentMethodData} from '../../utils/setting';
import {Fragment, useState} from 'react';
import LottieView from 'lottie-react-native';
import WebView from 'react-native-webview';
import {useStore} from '../../store/store';

const HandleRenderView = (type: any, handleIsShow: any) => {
  switch (type) {
    case PAYMENT_METHOD_TYPE.SQUAREUP:
      return (
        <View style={styles.PaymentTypeCard}>
          <Image
            source={require('../../assets/app_images/squareup.png')}
            style={styles.CartItemImageSquareup}
            resizeMode="center"
          />

          <TouchableOpacity
            style={{
              ...styles.TouchCategory,
              backgroundColor: COLORS.primaryOrangeHex,
            }}
            onPress={handleIsShow}>
            <Text
              style={{
                ...styles.TextCommon,
                color: COLORS.primaryWhiteHex,
              }}>
              Connect
            </Text>
          </TouchableOpacity>
        </View>
      );
    case PAYMENT_METHOD_TYPE.EPAYMENT:
      return (
        <View style={styles.PaymentTypeCard}>
          <Image
            source={require('../../assets/app_images/epayment.png')}
            style={styles.CartItemImageEpayment}
            resizeMode="center"
          />

          <TouchableOpacity
            style={{
              ...styles.TouchCategory,
              backgroundColor: COLORS.primaryOrangeHex,
            }}
            onPress={handleIsShow}>
            <Text
              style={{
                ...styles.TextCommon,
                color: COLORS.primaryWhiteHex,
              }}>
              Connect
            </Text>
          </TouchableOpacity>
        </View>
      );
    default:
      return <Text style={styles.TextCommon}>Home</Text>;
  }
};

const SettingPaymentMethod = () => {
  const onAddWebView = useStore((state: any) => state.onAddWebView);

  const [paymentType, setPaymentType] = useState(0);

  const handleChangePaymentType = (type: any) => setPaymentType(type);

  const handleIsShow = () => onAddWebView(true);

  return (
    <View style={styles.Root}>
      <View style={styles.Container}>
        <Text style={styles.TextTitle}>Provider</Text>

        <View style={styles.CategoryTab}>
          <View style={styles.Category}>
            {PaymentMethodData.map((item: any, index: number) => (
              <Fragment key={item.id}>
                <TouchableOpacity
                  style={{
                    ...styles.TouchCategory,
                    backgroundColor:
                      index === paymentType
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryWhiteHex,
                  }}
                  onPress={() => handleChangePaymentType(index)}>
                  <Text
                    style={{
                      ...styles.TextCommon,
                      color:
                        index === paymentType
                          ? COLORS.primaryWhiteHex
                          : COLORS.primaryBlackHex,
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </Fragment>
            ))}
          </View>

          <LottieView
            style={styles.LottieStyle}
            source={require('../../lottie/pulsing.json')}
            autoPlay
            loop
          />
        </View>

        <View style={styles.Contain}>
          {HandleRenderView(paymentType, handleIsShow)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Root: {
    flex: 1,
  },
  Container: {
    gap: SPACING.space_20,
    height: '100%',
    padding: SPACING.space_10,
  },
  CategoryTab: {
    gap: SPACING.space_20,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TouchCategory: {
    flexDirection: 'row',
    borderRadius: SPACING.space_15,
    padding: SPACING.space_10,
  },
  Contain: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.space_10,
  },
  TextTitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
  },
  CartItemImageSquareup: {
    height: widthResponsive(80),
    width: widthResponsive(120),
    borderRadius: BORDERRADIUS.radius_20,
  },
  CartItemImageEpayment: {
    height: widthResponsive(80),
    width: widthResponsive(80),
    borderRadius: BORDERRADIUS.radius_20,
  },
  PaymentTypeCard: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.space_20,
  },
  LottieStyle: {
    width: widthResponsive(22),
    height: widthResponsive(22),
    position: 'absolute',
    right: 0,
  },
  Category: {
    gap: SPACING.space_20,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    flexDirection: 'row',
  },
});

export default SettingPaymentMethod;
