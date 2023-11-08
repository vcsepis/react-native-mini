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
import CustomIcon from './CustomIcon';
import {useStore} from '../store/store';
import EscPosPrinter from 'react-native-esc-pos-printer';
import {base64Image} from './Printer/base64Image';

interface PopUpConnectedProps {
  onToggle?: any;
  onSubmit?: any;
}

const MOCK = [
  {
    name: 'TM_M10',
    ip: '192.168.192.168',
    mac: '12:34:56:78:56:78',
    target: 'TCP:192.168.192.168',
    bt: '12:34:56:78:56:78',
    usb: '000000000000000000',
    usbSerialNumber: '123456789012345678', // available if usbSerialNumber === true
  },
];
const ConnectedPopup: React.FC<PopUpConnectedProps> = ({
  onToggle,
  onSubmit,
}) => {
  const [note, setNote] = useState('');
  const [listDevice, setListDevice] = useState(MOCK);
  const [printer, setPrinter] = React.useState<any>(null);

  const onAddTargetDevice = useStore((state: any) => state.onAddTargetDevice);

  const getStatusConnect = () => {
    EscPosPrinter.discover()
      .then((printers: any) => {
        setListDevice(printers);
        console.log(printers[0]);
      })
      .catch(e => {
        setListDevice([]);
      });
  };

  const onPressParing = async (item: any) => {
    let status;
    await EscPosPrinter.connect(item.target)
      .then(() => {
        status = true;
        onAddTargetDevice(item);
        ToastAndroid.showWithGravity(
          `${item.name} is connected`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      })
      .catch(e => {
        status = false;
        ToastAndroid.showWithGravity(
          `${item.name + ': ' + e.message}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      });

    setPrinter(item);

    // TODO
    if (status) {
      await EscPosPrinter.init({
        target: item?.target,
        seriesName: item?.seriesName,
        language: 'EPOS2_LANG_EN',
      })
        .then(() => handlePrint())
        .catch(e => {
          ToastAndroid.showWithGravity(
            `${item.name + ': ' + e.message}`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        });
    }
  };

  const handlePrint = async () => {
    const printing = new EscPosPrinter.printing();

    try {
      const status = await printing
        .initialize()
        .align('center')
        .size(3, 3)
        .line('DUDE!')
        .smooth(true)
        .line('DUDE!')
        .smooth(false)
        .size(1, 1)
        .text('is that a ')
        .bold()
        .underline()
        .text('printer?')
        .newline()
        .bold()
        .underline()
        .align('left')
        .text('Left')
        .newline()
        .align('right')
        .text('Right')
        .newline()
        .size(1, 1)
        .textLine(48, {
          left: 'Cheesburger',
          right: '3 EUR',
          gapSymbol: '_',
        })
        .newline()
        .textLine(48, {
          left: 'Chickenburger',
          right: '1.5 EUR',
          gapSymbol: '.',
        })
        .newline()
        .size(2, 2)
        .textLine(48, {left: 'Happy Meal', right: '7 EUR'})
        .newline()
        .align('left')
        .text('Left')
        .newline()

        .align('right')
        .text('Right')
        .newline()

        .align('center')

        .image({uri: base64Image}, {width: 75})
        .image(
          {
            uri: 'https://raw.githubusercontent.com/tr3v3r/react-native-esc-pos-printer/main/ios/store.png',
          },
          {width: 75},
        )
        .barcode({
          value: 'Test123',
          type: 'EPOS2_BARCODE_CODE93',
          width: 2,
          height: 50,
          hri: 'EPOS2_HRI_BELOW',
        })
        .qrcode({
          value: 'Test123',
          level: 'EPOS2_LEVEL_M',
          width: 5,
        })
        .cut()
        .send();

      ToastAndroid.showWithGravity(
        `${printer.name + ': ' + status}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } catch (e: any) {
      ToastAndroid.showWithGravity(
        `${printer.name + ': ' + e.message}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  useEffect(() => getStatusConnect(), []);

  return (
    <View style={styles.CenteredView}>
      <Modal animationType="fade" transparent={true} visible={true}>
        <View style={styles.CenteredView}>
          <View style={styles.ModalView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.TextTitle}>List Device</Text>

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

            <Text style={styles.TextConfirm}>
              Please confirm the order below to completed payment
            </Text>

            {/* <App printerItem={printer} /> */}

            <ScrollView>
              <View style={styles.TableOrder}>
                <View style={styles.Row}>
                  <View style={styles.ContainerTableHeader}>
                    <Text style={styles.TextHeaderTitle}>Name</Text>
                  </View>
                  <View style={styles.ContainerTableHeaderNumber}>
                    <Text style={styles.TextHeaderTitle}>Ip</Text>
                  </View>
                  <View style={styles.ContainerTableHeaderNumber}>
                    <Text style={styles.TextHeaderTitle}>Mac</Text>
                  </View>
                  <View style={styles.ContainerTableHeaderNumber}>
                    <Text style={styles.TextHeaderTitle}>Target</Text>
                  </View>
                  <View style={styles.ContainerTableHeaderNumber}>
                    <Text style={styles.TextHeaderTitle}>Bt</Text>
                  </View>
                </View>

                {listDevice?.map((item: any, index: any) => (
                  <TouchableOpacity
                    style={styles.Row}
                    key={index}
                    onPress={() => onPressParing(item)}>
                    <View style={styles.ContainerTableHeader}>
                      <Text style={styles.TextCommon}>{item.name}</Text>
                    </View>
                    <View style={styles.ContainerTableHeaderNumber}>
                      <Text style={styles.TextCommon}>{item.ip}</Text>
                    </View>
                    <View style={styles.ContainerTableHeaderNumber}>
                      <Text style={styles.TextNumber}>{item.mac}</Text>
                    </View>
                    <View style={styles.ContainerTableHeaderNumber}>
                      <Text style={styles.TextNumber}>{item.target}</Text>
                    </View>
                    <View style={styles.ContainerTableHeaderNumber}>
                      <Text style={styles.TextCommon}>{item.bt}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.Submit}>
              <TouchableOpacity
                onPress={() => onSubmit(note)}
                style={{
                  backgroundColor: COLORS.primaryGreenRGB,
                  padding: SPACING.space_10,
                  borderRadius: SPACING.space_15,
                  width: '40%',
                  alignSelf: 'center',
                }}>
                <Text style={styles.ScreenSubmit}>Done</Text>
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
