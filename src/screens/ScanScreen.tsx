import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import CustomIcon from '../components/CustomIcon';

export default function ScanScreen({navigation}: any) {
  const [qrValue, setQrValue] = useState('dev-store-');
  const [light, setLight] = useState(false);

  const [showDialog, setShowDialog] = useState(false);

  const handlePressStore = () => {
    const id = qrValue?.replace('https://order.episcloud.com/', '');

    return navigation.push('Store', {id});
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: widthResponsive(600),
          position: 'relative',
        }}>
        <QRCodeScanner
          onRead={e => {
            setShowDialog(true);
            setQrValue(e?.data);
          }}
          flashMode={
            light
              ? RNCamera.Constants.FlashMode.torch
              : RNCamera.Constants.FlashMode.auto
          }
          topContent={<></>}
          bottomContent={
            <TouchableOpacity
              style={styles.buttonHome}
              onPress={() => {
                setLight(!light);
              }}>
              <Text style={styles.containText}>{`Flash ${
                light ? 'OFF' : 'ON'
              }`}</Text>
            </TouchableOpacity>
          }
        />
      </View>

      <TouchableOpacity
        onPress={handlePressStore}
        style={{
          backgroundColor: '#2B377D',
          paddingHorizontal: widthResponsive(20),
          borderRadius: SPACING.space_15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={styles.containText}>
          {!qrValue.length ? 'Scan now' : qrValue}
        </Text>
        <CustomIcon
          name="search"
          color={COLORS.primaryWhiteHex}
          size={FONTSIZE.size_20}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  iconButtonHome: {
    type: 'material',
    size: 50,
    color: 'white',
  },
  buttonHome: {
    backgroundColor: 'rgba(255, 193, 7, 1)',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30,
    height: SPACING.space_30 * 1.5,
    width: SPACING.space_30 * 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    padding: SPACING.space_10,
    fontWeight: '600',
  },
});
