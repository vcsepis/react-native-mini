import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import EscPosPrinter, {IPrinter} from 'react-native-esc-pos-printer';
import MultiPrint from './Printer/MultiPrint';

interface PopUpConnectedProps {
  onToggle?: any;
  onSubmit?: any;
  open: boolean;
}

const ConnectedPopup: React.FC<PopUpConnectedProps> = ({
  onToggle,
  onSubmit,
  open,
}) => {
  const [listDevice, setListDevice] = useState<IPrinter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getAvailableDevices = () => {
    if (!open) {
      return;
    }
    setLoading(true);
    EscPosPrinter.discover()
      .then((printers: IPrinter[]) => {
        setListDevice(printers);
      })
      .catch(e => {
        Toast.show({
          type: 'error',
          text1: 'Error when get devices list',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => getAvailableDevices(), [open]);

  return (
    <Modal animationType="fade" transparent={true} visible={open}>
      <View style={styles.CenteredView}>
        <View style={styles.ModalView}>
          <MultiPrint closeModal={onToggle} />
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
  TextHeaderTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_18,
    textTransform: 'uppercase',
  },
  TextTitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
    fontWeight: '600',
  },
  TextNumber: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_20,
  },
  InputSpinerAction: {
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_10,
  },
  Contain: {
    marginVertical: SPACING.space_20,
  },
  ScreenSubmit: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_regular,
    textAlign: 'center',
  },
  Row: {
    maxWidth: '100%',
    flexDirection: 'row',
    paddingHorizontal: SPACING.space_20,
    borderColor: COLORS.primaryWhiteHex,
    borderWidth: SPACING.space_2 / 2,
  },
  ContainerTableHeader: {
    width: '40%',
    height: widthResponsive(20),
    borderRadius: 24,
    justifyContent: 'center',
    padding: SPACING.space_10,
  },
  ContainerTableContain: {
    width: '20%',
    borderRadius: 24,
    padding: SPACING.space_10,
  },
  TableOrder: {
    backgroundColor: '#ddd',
    marginVertical: SPACING.space_20,
  },
  ContainerTableHeaderNumber: {
    width: '15%',
    height: widthResponsive(20),
    borderRadius: 24,
    justifyContent: 'center',
    padding: SPACING.space_10,
    alignItems: 'center',
  },
  TextConfirm: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_18,
  },
  NoteContain: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: SPACING.space_20,
  },
  Note: {
    backgroundColor: '#ddd',
    padding: SPACING.space_10,
    borderRadius: SPACING.space_10,
    gap: SPACING.space_10,
    width: '50%',
  },
  OrderInfor: {
    width: '40%',
    marginHorizontal: SPACING.space_10,
    gap: SPACING.space_10,
  },
  Order: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  TextOrderName: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
    textAlign: 'right',
    width: '50%',
  },
  TextPaymentMethod: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  Submit: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  PaymentMethod: {
    borderRadius: SPACING.space_10,
    backgroundColor: '#ddd',
    padding: SPACING.space_10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.space_10,
  },
});

export default ConnectedPopup;
