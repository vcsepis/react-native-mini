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
import {useStore} from '../store/store';
import {screenTrace} from '../utils/firebase';
import LottieView from 'lottie-react-native';

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

const OnlineStoreScreen = ({onHandlePrint}: any) => {
  const [selectedId, setSelectedId] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(1);

  const OrderOnline = useStore((state: any) => state.OrderOnline); // data from noti process
  const onAddOrderOnlineCart = useStore(
    (state: any) => state.onAddOrderOnlineCart,
  ); // handle add view detail order

  const [oderOnline, setOderOnline] = useState(OrderOnline || []);

  const handleDetailOnlineCart = (item: any) => {
    onAddOrderOnlineCart([
      {
        ...item?.detailOrder,
        resourceId: item?.resourceId,
        status: item?.status,
        completed: item?.completed,
      },
    ]);
    setSelectedOrder(item.resourceId);
  };

  useEffect(() => {
    setOderOnline(
      OrderOnline?.filter((item: any) =>
        selectedId === 1
          ? item?.status === 'onProcess'
          : item?.status !== 'onProcess',
      ),
    );
  }, [OrderOnline]);

  const handleSelectedId = (id: any) => {
    setSelectedId(id);
    if (id === 1) {
      setOderOnline(
        OrderOnline?.filter((item: any) => item?.status === 'onProcess'),
      );
    } else {
      setOderOnline(
        OrderOnline?.filter((item: any) => item?.status !== 'onProcess'),
      );
    }
  };

  return (
    <View style={styles.Root}>
      <View style={styles.HeaderContain}>
        {PROCESS_STATUS_DATA.map((item: any) => (
          <TouchableOpacity
            key={item.id}
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
          {oderOnline?.length ? (
            <View style={styles.CurrentOrder}>
              {oderOnline?.length > 0 &&
                oderOnline?.map((item: any) => (
                  <View
                    key={item?.resourceId}
                    style={{
                      ...styles.TableOrder,
                      borderColor:
                        item?.resourceId === selectedOrder
                          ? COLORS.primaryGreenRGB
                          : '#ddd',
                    }}>
                    <View style={styles.Row} key={1}>
                      <View style={styles.OrderInfo}>
                        <Text style={styles.TextOrderId}>
                          Orders: {item?.resourceId}
                        </Text>
                        <Text style={styles.TextNumber}>{item?.type}</Text>
                      </View>
                      <Text style={styles.TextNumber}>{item.time}</Text>
                    </View>

                    <View style={styles.Row}>
                      <Text style={styles.TextCommon}>
                        Qta: {item?.detailOrder?.products?.length}
                      </Text>
                      <View style={styles.StatusPrice}>
                        <Text style={styles.TextOrderId}>
                          $ {(item?.detailOrder?.total / 100).toFixed(2)}
                        </Text>
                        <TouchableOpacity
                          style={{
                            ...styles.StatusOrder,
                            backgroundColor: COLORS.primaryGreenRGB,
                          }}
                          onPress={() => handleDetailOnlineCart(item)}>
                          <Text
                            style={{
                              ...styles.TextCommon,
                              color: COLORS.primaryWhiteHex,
                              paddingHorizontal: SPACING.space_10,
                            }}>
                            View
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            ...styles.StatusOrder,
                            backgroundColor: COLORS.primaryOrangeHex,
                          }}
                          onPress={() => {
                            setSelectedOrder(item.resourceId);
                            onHandlePrint(item.detailOrder);
                          }}>
                          <Text
                            style={{
                              ...styles.TextCommon,
                              color: COLORS.primaryWhiteHex,
                              paddingHorizontal: SPACING.space_10,
                            }}>
                            Print Now
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          ) : (
            <TouchableOpacity style={styles.ContainerAnimationPrettie}>
              <LottieView
                style={styles.AnimationPrettie}
                source={require('../lottie/empty.json')}
                autoPlay
                loop
              />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
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
    fontSize: FONTSIZE.size_20,
  },
  TextOrderId: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_24,
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
    marginBottom: SPACING.space_10,
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
    gap: SPACING.space_16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  CurrentOrder: {
    marginBottom: widthResponsive(24),
  },
  ContainerAnimationPrettie: {
    justifyContent: 'center',
    paddingTop: SPACING.space_30 * 6,
  },
  AnimationPrettie: {
    height: 300,
    width: 'auto',
    borderRadius: BORDERRADIUS.radius_20,
  },
});

export default OnlineStoreScreen;
