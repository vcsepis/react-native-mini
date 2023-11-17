import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import WebView from 'react-native-webview';
import CustomIcon from './CustomIcon';
import {useStore} from '../store/store';

interface PopupWebView {}

const PopupWebView: React.FC<PopupWebView> = ({}) => {
  const onAddWebView = useStore((state: any) => state.onAddWebView);

  const handleClose = () => onAddWebView(false);

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

            <WebView
              source={{
                uri: 'https://squareupsandbox.com/oauth2/authorize?client_id=sandbox-sq0idb-8xiH45_VghMmvgrkxXxqXg&scope=ITEMS_READ+MERCHANT_PROFILE_READ+PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS+PAYMENTS_WRITE+PAYMENTS_READ&state=0499178ad6fdf1946bcb184aeae355cdbf90fed7faf60dde36e35de6d2d91b09',
              }}
              style={{flex: 1}}
            />
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
    width: '80%',
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    padding: SPACING.space_30,
    height: '92%',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
  },
  HandleButon: {
    alignItems: 'flex-end',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
});

export default PopupWebView;
