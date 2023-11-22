import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';

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
import {Styles} from './Caculator/GlobalStyle';
import IconCard from '../assets/icon/ic_card_payment.svg';
import LottieView from 'lottie-react-native';

interface PopUpCalculateCartProps {
  onToggle?: any;
  onSubmit?: any;
  open: boolean;
}

const PopUpCalculateCart: React.FC<PopUpCalculateCartProps> = ({
  onToggle,
  onSubmit,
  open,
}) => {
  const CalculateCart = useStore((state: any) => state.CalculateCart);
  const DetailStore = useStore((state: any) => state.DetailStore);

  const PaymentData = DetailStore?.metadata?.payments?.length
    ? DetailStore?.metadata?.payments?.filter(
        (item: any) =>
          item?.code !== 'APPLE_PAY' && item?.code !== 'GOOGLE_PAY',
      )
    : [];

  const [paymentCd, setPaymentCd] = useState();
  const [change, setChange] = useState({cash: 0, change: 0});

  const handleSelectPaymentCd = (cd?: any) => setPaymentCd(cd);

  useEffect(() => {
    setPaymentCd(PaymentData[1]?.code);
  }, [PaymentData?.length]);

  const sortByCode = (arr: any) => {
    const index = arr.findIndex((item: any) => item.code === 'CARD');

    if (index !== -1) {
      const element = arr.splice(index, 1)[0];
      arr.unshift(element);
    }

    return arr;
  };

  const handleIconType = (item: any) => {
    if (item.code === 'CASH')
      return (
        <Fragment>
          <IconCard width={widthResponsive(6)} height={widthResponsive(6)} />
          <Text style={styles.TextPayment}>Pay at the counter</Text>
        </Fragment>
      );

    if (item.code === 'CARD')
      return (
        <Fragment>
          <LottieView
            style={styles.LottieStyle}
            source={require('../lottie/scan.json')}
            autoPlay
            loop
          />
          <Text style={styles.TextPayment}>Qr code</Text>
        </Fragment>
      );

    if (item.code === 'POS')
      return (
        <Fragment>
          <Text style={styles.TextPayment}>{item?.name}</Text>
        </Fragment>
      );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={onToggle}>
      <View style={styles.CenteredView}>
        <View style={styles.ModalView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.TextTitle}>Payment Method</Text>

            <TouchableOpacity
              style={styles.InputSpinerAction}
              onPress={onToggle}>
              <CustomIcon
                name="close"
                color={COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_18}
              />
            </TouchableOpacity>
          </View>

          {/* Container Product*/}
          <ScrollView>
            <View style={styles.Contain}>
              <View style={styles.ContainerAmount}>
                <View style={styles.ItemAmount}>
                  <Text style={styles.TextCommon}>Total Amount</Text>
                </View>
                <View style={{...styles.ItemAmount, alignItems: 'flex-end'}}>
                  <Text style={styles.TextTotalAmount}>
                    $ {CalculateCart.total}
                  </Text>
                </View>
              </View>

              <Text style={styles.TextCommon}>Payment Method</Text>

              <View style={styles.ContainerPaymentMethod}>
                {sortByCode(PaymentData)?.map((item: any) => (
                  <TouchableOpacity
                    disabled={item.code === 'POS'}
                    key={item.code}
                    onPress={() => handleSelectPaymentCd(item?.code)}
                    style={{
                      ...styles.PaymentStatus,
                      backgroundColor:
                        paymentCd === item?.code
                          ? COLORS.primaryGreenRGB
                          : '#4E505F',
                    }}>
                    {handleIconType(item)}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={() => onSubmit('', change, paymentCd)}
            style={{
              backgroundColor: COLORS.primaryGreenRGB,
              padding: SPACING.space_10,
              borderRadius: SPACING.space_15,
              width: '20%',
              height: widthResponsive(15),
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Text style={Styles.screenSubmit}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  CenteredView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  ModalView: {
    width: '80%',
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    padding: SPACING.space_30,
    height: '88%',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextTitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
    fontWeight: '600',
  },
  InputSpinerAction: {
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_10,
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
  ContainerAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: SPACING.space_10,
    borderRadius: SPACING.space_10,
    marginBottom: SPACING.space_20,
  },
  Contain: {
    marginVertical: SPACING.space_20,
  },
  ItemAmount: {
    gap: SPACING.space_20,
  },
  TextTotalAmount: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_24,
    color: COLORS.primaryGreenRGB,
    fontWeight: '600',
  },
  ContainerPaymentMethod: {
    paddingTop: SPACING.space_10,
    paddingBottom: SPACING.space_20,
    flexDirection: 'row',
    gap: SPACING.space_10,
    justifyContent: 'center',
  },
  PaymentStatus: {
    borderRadius: SPACING.space_15,
    alignItems: 'center',
    height: widthResponsive(20),
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignContent: 'center',
    paddingHorizontal: widthResponsive(10),
  },
  TextPayment: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_regular,
  },
  InputIcon: {
    marginRight: SPACING.space_10,
  },
  LottieStyle: {
    height: widthResponsive(6),
    width: widthResponsive(6),
  },
});

export default PopUpCalculateCart;
