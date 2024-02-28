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
import CustomIcon from './CustomIcon';
import {useStore} from '../store/store';
import LottieView from 'lottie-react-native';

interface FoodComplete {}

const FoodComplete: React.FC<FoodComplete> = ({}) => {
  const onAddDataComplete = useStore((state: any) => state.onAddDataComplete);

  return (
    <View style={styles.CenteredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.CenteredView}>
          <TouchableOpacity
            style={styles.ModalView}
            onPress={() => onAddDataComplete(false)}>
            <View style={styles.QrView}>
              <Text style={styles.TextTitleFood}>EXPRESS</Text>

              <Text style={styles.TextAmount}>ORDER HERE</Text>

              <LottieView
                style={styles.AnimationPrettie}
                source={require('../lottie/order.json')}
                autoPlay
                loop
              />

              <View style={styles.Confirm}>
                <TouchableOpacity
                  onPress={() => onAddDataComplete(false)}
                  style={styles.ButtonConfirm}>
                  <Text style={styles.TextSubmit}>TAKEAWAY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
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
    width: '100%',
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_30,
    height: '100%',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextSubmit: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_24,
  },
  TextAmount: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenRGB,
    fontSize: widthResponsive(14),
  },
  TextTitleFood: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenRGB,
    fontSize: widthResponsive(16),
  },
  HandleButon: {
    alignItems: 'flex-end',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  ButtonConfirm: {
    backgroundColor: COLORS.primaryGreenRGB,
    padding: SPACING.space_20,
    borderRadius: SPACING.space_15,
    width: '48%',
    height: widthResponsive(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  DataConfirm: {
    backgroundColor: COLORS.primaryOrangeHex,
    padding: SPACING.space_20,
    borderRadius: SPACING.space_15,
    width: '50%',
    marginTop: widthResponsive(2),
    height: widthResponsive(20),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
    height: widthResponsive(60),
    width: widthResponsive(100),
  },
  Confirm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: widthResponsive(10),
    width: '50%',
    justifyContent: 'center',
  },
});

export default FoodComplete;
