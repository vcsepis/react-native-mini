import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import {useStore} from '../store/store';
import IconWarning from '../assets/icon/ic_warning_red.svg';
import IconSuccess from '../assets/icon/ic_success.svg';

interface ToastCustomIprops {}

const ToastCustom: React.FC<ToastCustomIprops> = ({}) => {
  const onAddToast = useStore((state: any) => state.onAddToast);
  const Toast = useStore((state: any) => state.Toast);

  useEffect(() => {
    if (Toast?.isShow) {
      setTimeout(() => {
        onAddToast({
          isShow: false,
          message: '',
          type: '',
        });
      }, 3000);
    }
  }, [Toast?.isShow]);

  return (
    <View style={styles.CenteredView}>
      <View style={styles.ModalView}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.TextMsg}>{Toast?.message}</Text>

          {Toast?.type === 'success' ? (
            <IconSuccess
              width={FONTSIZE.size_30 * 1.8}
              height={FONTSIZE.size_30 * 1.8}
            />
          ) : (
            <IconWarning
              width={FONTSIZE.size_30 * 1.8}
              height={FONTSIZE.size_30 * 1.8}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  CenteredView: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  ModalView: {
    width: '100%',
    backgroundColor: '#D8D3E8',
    borderRadius: SPACING.space_15,
    padding: SPACING.space_30,
    height: '100%',
    justifyContent: 'center',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextType: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextMsg: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
    marginRight: SPACING.space_20,
    width: widthResponsive(120),
  },
  InputSpinerAction: {
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: BORDERRADIUS.radius_10,
    padding: SPACING.space_8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ToastCustom;
