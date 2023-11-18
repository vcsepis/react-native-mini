/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import EscPosPrinter, {
  IPrinter,
  getPrinterSeriesByName,
} from 'react-native-esc-pos-printer';

import {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useStore} from '../../store/store';

type Props = {
  closeModal?: () => void;
};
const MultiPrint = ({closeModal}: Props) => {
  const backgroundStyle = {
    margin: 16,
  };

  const [printers, setPrinters] = useState<any[]>([]);

  const onAddTargetDevice = useStore((state: any) => state.onAddTargetDevice);

  useEffect(() => {
    handleDiscover();
  }, []);

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
    } catch (error) {
      // Init error
    }
  };

  const handleConnect = async (printer: IPrinter) => {
    try {
      EscPosPrinter.connect(printer.target);
      onAddTargetDevice({...printer, connected: true});
    } catch (error) {
      // Failed to connect the printer
    }
  };

  const handleDisconnect = (printer: IPrinter) => {
    try {
      EscPosPrinter.disconnectPrinter(printer.target);
    } catch (error) {
      // Failed to disconnect the printer
    }
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
    } catch (error) {
      // Printing error
    }
  };

  const handlePrintAll = () => {
    const printRequests = printers.map(printer => handlePrint(printer));
    Promise.all(printRequests);
  };

  const handleInitializeAll = () => {
    const initializeRequests = printers.map(printer => handleInit(printer));
    Promise.all(initializeRequests);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <TouchableOpacity
          style={{
            marginBottom: 24,
          }}
          onPress={closeModal}>
          <Text style={{color: '#0A84FF'}}>Close</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={handleInitializeAll}>
            <Text>Initialize all</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrintAll}>
            <Text>Print all</Text>
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
                <Text>Init</Text>
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
                <Text>Connect</Text>
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
                <Text>Disconnect</Text>
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
                <Text>Print</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MultiPrint;
