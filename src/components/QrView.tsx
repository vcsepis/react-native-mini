import {
  Image,
  Modal,
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
} from '../theme/theme';
import WebView from 'react-native-webview';
import CustomIcon from './CustomIcon';
import {useStore} from '../store/store';
import QRCode from 'react-native-qrcode-svg';
import LottieView from 'lottie-react-native';

interface PopupQrView {
  handleClose?: any;
  link?: any;
}

const PopupQrView: React.FC<PopupQrView> = ({handleClose, link}) => {
  const CalculateCart = useStore((state: any) => state.CalculateCart);

  return (
    <View style={styles.CenteredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.CenteredView}>
          <View style={styles.ModalView}>
            <TouchableOpacity style={styles.HandleButon} onPress={handleClose}>
              <CustomIcon
                style={styles.InputIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryLightGreyHex}
              />
            </TouchableOpacity>

            <View style={styles.QrView}>
              <View style={styles.HeaderQrView}>
                <Text style={styles.TextCommon}>Awaiting Payment</Text>

                <LottieView
                  style={styles.AnimationPrettie}
                  source={require('../lottie/awaiting.json')}
                  autoPlay
                  loop
                />
              </View>

              <Text style={styles.TextAmount}>
                Amount: ${CalculateCart?.total}
              </Text>

              <QRCode
                size={widthResponsive(80)}
                value={link}
                logoBackgroundColor="transparent"
              />

              <Image
                source={require('../assets/app_images/payment_type.png')}
                style={styles.Image}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    width: '60%',
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    padding: SPACING.space_30,
    height: '80%',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextAmount: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_20,
  },
  HandleButon: {
    alignItems: 'flex-end',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  QrView: {
    alignItems: 'center',
    gap: SPACING.space_10,
    width: '100%',
  },
  Image: {
    height: widthResponsive(20),
    width: '60%',
  },
  AnimationPrettie: {
    height: widthResponsive(20),
    width: widthResponsive(20),
  },
  HeaderQrView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PopupQrView;
