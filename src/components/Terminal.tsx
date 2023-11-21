import {useStripeTerminal} from '@stripe/stripe-terminal-react-native';
import {useEffect} from 'react';
import {Alert, Platform, ToastAndroid, View} from 'react-native';

function Terminal() {
  const {discoverReaders, connectBluetoothReader, discoveredReaders} =
    useStripeTerminal({
      onUpdateDiscoveredReaders: readers => {
        handleConnectBluetoothReader(readers[0].id);
      },
    });

  useEffect(() => {
    handleDiscoverReaders();
  }, []);

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
      locationId: discoveredReaders[0].locationId,
    } as any);

    if (error) {
      console.log('connectBluetoothReader error', error);
      return;
    }

    console.log('Reader connected successfully', reader);
  };

  return <View />;
}

export default Terminal;
