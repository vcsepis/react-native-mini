import React, {useEffect} from 'react';
import EscPosPrinter, {
  IPrinter,
  getPrinterSeriesByName,
} from 'react-native-esc-pos-printer';
import {
  requestNeededAndroidPermissions,
  useStripeTerminal,
} from '@stripe/stripe-terminal-react-native';

import {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import {useStore} from '../../store/store';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../../theme/theme';

type Props = {
  closeModal?: () => void;
};
const MultiPrint = ({closeModal}: Props) => {
  const backgroundStyle = {
    margin: 16,
  };

  const {discoverReaders, connectBluetoothReader, discoveredReaders} =
    useStripeTerminal({
      onUpdateDiscoveredReaders: readers => {
        handleConnectBluetoothReader(readers[0].id);
      },
    });

  const {initialize}: any = useStripeTerminal();

  const [printers, setPrinters] = useState<any[]>([]);

  const onAddTargetDevice = useStore((state: any) => state.onAddTargetDevice);

  const handleDiscover = async () => {
    const discoveredPrinters = await EscPosPrinter.discover();
    setPrinters(discoveredPrinters);
  };

  const handleInit = async (printer: any) => {
    try {
      await EscPosPrinter.instantiate({
        target: printer.target,
        seriesName: getPrinterSeriesByName(printer.name),
        language: 'EPOS2_LANG_EN',
      });
      onAddTargetDevice({...printer, connected: true});
    } catch (error) {}
  };

  const handleConnect = async (printer: IPrinter) => {
    try {
      EscPosPrinter.connect(printer.target);
      onAddTargetDevice({...printer, connected: true});
    } catch (error) {}
  };

  const handleDisconnect = (printer: IPrinter) => {
    try {
      EscPosPrinter.disconnectPrinter(printer.target);
    } catch (error) {}
  };

  const handlePrint = async (printer: any) => {
    const printing = new EscPosPrinter.printing();
    try {
      await printing
        .initialize()
        .align('center')
        .size(3, 3)
        .line(`Print target: ${printer.target}`)
        .cut()
        .send({
          target: printer.target,
        });
    } catch (error) {}
  };

  const handlePrintAll = () => {
    const printRequests = printers.map(printer => handlePrint(printer));
    Promise.all(printRequests);
  };

  const handleInitializeAll = () => {
    const initializeRequests = printers.map(printer => handleInit(printer));
    Promise.all(initializeRequests);
  };

  const handleStripe = async () => {
    try {
      const granted = await requestNeededAndroidPermissions({
        accessFineLocation: {
          title: 'Location Permission',
          message: 'Terminal needs access to your location',
          buttonPositive: 'Accept',
        },
      });
      if (granted) {
        handleDiscoverReaders();
      } else {
        console.error(
          'Location and BT services are required in order to connect to a reader.',
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Terminal needs access to your location',
            buttonPositive: 'Accept',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          handleDiscoverReaders();
        } else {
          console.error(
            'Location services are required in order to connect to a reader.',
          );
        }
      } catch {}
    }
    init();
  }, []);

  useEffect(() => {
    handleDiscover();
  }, []);

  useEffect(() => {
    initialize({
      logLevel: 'verbose',
    });
  }, [initialize]);

  const handleDiscoverReaders = async () => {
    const {error}: any = await discoverReaders({
      discoveryMethod: 'bluetoothScan',
      simulated: true,
    });

    if (Platform.OS) {
      Alert.alert(`Discover readers error: 
      ${error.code}, ${error.message}`);
    } else {
      ToastAndroid.showWithGravity(
        `Discover readers error:
        ${error.code}, ${error.message}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  const handleConnectBluetoothReader = async (id: any) => {
    const {reader, error} = await connectBluetoothReader({
      render: discoveredReaders[0].id,
      locationId: 'tml_FVXIbQtL9QB2QF',
    } as any);
    if (error) {
      // console.log('connectBluetoothReader error', error);
      return;
    }

    // console.log('Reader connected successfully', reader);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.TextTitle}>Setting</Text>
          <TouchableOpacity
            style={{
              ...styles.ButtonView,
              marginBottom: 24,
              width: widthResponsive(40),
              alignItems: 'center',
            }}
            onPress={closeModal}>
            <Text style={{...styles.TextCommon, color: '#0A84FF'}}>Close</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', gap: SPACING.space_20}}>
            <TouchableOpacity
              style={styles.ButtonView}
              onPress={handleInitializeAll}>
              <Text style={styles.TextCommon}>Initialize all</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ButtonView} onPress={handleStripe}>
              <Text style={styles.TextCommon}>Terminal</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.ButtonView} onPress={handlePrintAll}>
            <Text style={styles.TextCommon}>Print all</Text>
          </TouchableOpacity>
        </View>

        {printers.map(printer => {
          return (
            <View
              style={{
                padding: 12,
                borderWidth: 1,
                marginVertical: 12,
                borderRadius: 4,
                borderColor: 'grey',
              }}>
              <Text>{printer.name}</Text>
              <TouchableOpacity
                style={{
                  padding: 12,
                  borderWidth: 1,
                  marginVertical: 12,
                  borderColor: '#23395d',
                  borderRadius: 4,
                }}
                onPress={() => handleInit(printer)}>
                <Text style={styles.TextCommon}>Init</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 12,
                  borderWidth: 1,
                  marginVertical: 12,
                  borderColor: '#23395d',
                  borderRadius: 4,
                }}
                onPress={() => handleConnect(printer)}>
                <Text style={styles.TextCommon}>Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 12,
                  borderWidth: 1,
                  marginVertical: 12,
                  borderColor: '#23395d',
                  borderRadius: 4,
                }}
                onPress={() => handleDisconnect(printer)}>
                <Text style={styles.TextCommon}>Disconnect</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 12,
                  borderWidth: 1,
                  marginVertical: 12,
                  borderColor: '#23395d',
                  borderRadius: 4,
                }}
                onPress={() => handlePrint(printer)}>
                <Text style={styles.TextCommon}>Print</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_18,
  },
  TextTitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
  },
  ButtonView: {
    backgroundColor: '#ddd',
    padding: SPACING.space_10,
    borderRadius: SPACING.space_10,
  },
});

export default MultiPrint;
