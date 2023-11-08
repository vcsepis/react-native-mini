import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import moment from 'moment';
import {useStore} from '../store/store';

interface PopUpCommingProps {
  onToggle?: any;
  onSubmit?: any;
}

const newDate = new Date();

const CommingPopup: React.FC<PopUpCommingProps> = ({onToggle, onSubmit}) => {
  const onAddStoreRealTime = useStore((state: any) => state.onAddStoreRealTime);
  const StoreRealTime = useStore((state: any) => state.StoreRealTime);

  const handleAccept = () => onAddStoreRealTime({isShow: false, data: {}});
  const handleReject = () => onAddStoreRealTime({isShow: false, data: {}});

  return (
    <View style={styles.CenteredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.CenteredView}>
          <View style={styles.ModalView}>
            <View style={styles.OrderInfor}>
              <Text style={styles.TextOrderId}>Order Id: 1231231231231231</Text>
              <View style={styles.TimeOrder}>
                <Text style={styles.TextCommon}>
                  {moment(newDate).format('HH:mm:ss A')}
                </Text>
              </View>
            </View>

            <View style={styles.FooterAction}>
              <TouchableOpacity style={styles.ButtonAccept}>
                <Text
                  style={{...styles.TextCommon, color: COLORS.primaryWhiteHex}}
                  onPress={handleReject}>
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ButtonReject}
                onPress={handleAccept}>
                <Text style={styles.TextCommon}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  CenteredView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: widthResponsive(10),
  },
  ModalView: {
    width: '60%',
    backgroundColor: '#ddd',
    borderRadius: SPACING.space_15,
    padding: SPACING.space_30,
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextOrderId: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
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
  OrderInfor: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  TimeOrder: {
    gap: SPACING.space_10,
  },
  ButtonAccept: {
    padding: SPACING.space_15,
    borderRadius: SPACING.space_15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryGreenRGB,
  },
  ButtonReject: {
    padding: SPACING.space_15,
    borderRadius: SPACING.space_15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryWhiteHex,
  },
  FooterAction: {
    marginTop: SPACING.space_20,
    gap: SPACING.space_10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default CommingPopup;
