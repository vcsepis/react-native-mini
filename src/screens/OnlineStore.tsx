import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import {useEffect, useState} from 'react';
import ConnectChannel from '../components/Pusher';
import {Pusher, PusherEvent} from '@pusher/pusher-websocket-react-native';
import {handleConnectPusher} from '../utils/pusher';

const PROCESS_STATUS_DATA = [
  {
    id: 1,
    name: 'On-process',
  },
  {
    id: 2,
    name: 'Completed',
  },
];

const OnlineStoreScreen = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [pusher, setPusher] = useState<Pusher>();
  const handleSelectedId = (id: any) => setSelectedId(id);

  const connectPusher = async () => {
    const instance = await handleConnectPusher();
    setPusher(instance);
  };

  const handleEvents = async () => {
    if (!pusher) {
      return;
    }

    console.log('connected')

    await pusher.subscribe({
      channelName: 'my-channel',
      onEvent: (event: PusherEvent) => {
        console.log(`onEvent: ${event}`);
      },
    });
  };

  useEffect(() => {
    connectPusher();
  }, []);

  useEffect(() => {
    handleEvents();
  }, [pusher]);

  return (
    <View style={styles.Root}>
      <ConnectChannel />
      {/* <View style={styles.HeaderContain}>
        {PROCESS_STATUS_DATA.map((item: any) => (
          <TouchableOpacity
            style={{
              ...styles.StatusOrder,
              backgroundColor:
                selectedId === item.id ? COLORS.primaryGreenRGB : '#ddd',
            }}
            onPress={() => handleSelectedId(item?.id)}>
            <Text
              style={{
                ...styles.TextCommon,
                color:
                  selectedId === item.id
                    ? COLORS.primaryWhiteHex
                    : COLORS.primaryBlackHex,
              }}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <ScrollView>
          <View style={styles.TableOrder}>
            <View style={styles.Row} key={1}>
              <View style={styles.OrderInfo}>
                <Text style={styles.TextOrderId}>Orders: 1231231</Text>
                <Text style={styles.TextNumber}>Tabel: 7</Text>
              </View>
              <Text style={styles.TextNumber}>20.30pm</Text>
            </View>

            <View style={styles.Row}>
              <Text style={styles.TextCommon}>Qta: 7</Text>
              <View style={styles.StatusPrice}>
                <Text style={styles.TextOrderId}>$ 100</Text>
                <TouchableOpacity
                  style={{
                    ...styles.StatusOrder,
                    backgroundColor: COLORS.primaryGreenRGB,
                  }}>
                  <Text
                    style={{
                      ...styles.TextCommon,
                      color: COLORS.primaryWhiteHex,
                    }}>
                    {'Dine-in'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    paddingHorizontal: SPACING.space_20,
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
  TextNumber: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
  },
  TextOrderId: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_28,
  },
  Row: {
    maxWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.space_15,
    alignItems: 'center',
  },
  ContainerTableHeader: {
    width: '20%',
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
    marginHorizontal: SPACING.space_10,
    paddingVertical: SPACING.space_20,
    borderRadius: SPACING.space_15,
    borderColor: '#ddd',
    borderWidth: SPACING.space_2,
  },
  ContainerTableHeaderNumber: {
    width: '20%',
    height: widthResponsive(20),
    borderRadius: 24,
    justifyContent: 'center',
    padding: SPACING.space_10,
    alignItems: 'center',
  },
  TextView: {
    borderRadius: SPACING.space_15,
    padding: SPACING.space_10,
    alignItems: 'center',
    backgroundColor: COLORS.primaryGreenRGB,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_20,
  },
  HeaderContain: {
    flexDirection: 'row',
    marginVertical: SPACING.space_20,
    position: 'relative',
    gap: SPACING.space_20,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    marginHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
    backgroundColor: '#ddd',
    alignItems: 'center',
    width: '70%',
    justifyContent: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryBlackHex,
  },
  CalendarComponent: {
    position: 'absolute',
    top: 80,
    right: 0,
    width: '40%',
    zIndex: 999,
  },
  Calendar: {
    backgroundColor: COLORS.primaryWhiteHex,
  },
  StatusOrder: {
    padding: SPACING.space_10,
    borderRadius: SPACING.space_15,
  },
  OrderInfo: {
    gap: SPACING.space_10,
  },
  StatusPrice: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OnlineStoreScreen;
