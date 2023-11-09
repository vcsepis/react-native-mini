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
import {useState} from 'react';
import {useStore} from '../store/store';

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
  const [selectedOrder, setSelectedOrder] = useState(1);
  const handleSelectedId = (id: any) => setSelectedId(id);

  const OrderOnline = useStore((state: any) => state.OrderOnline); // data from noti process
  const onAddOrderOnlineCart = useStore(
    (state: any) => state.onAddOrderOnlineCart,
  ); // handle add view detail order

  const handleDetailOnlineCart = (item: any) => {
    onAddOrderOnlineCart([item?.detailOrder]);
    setSelectedOrder(item.resourceId);
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
          <View style={styles.CurrentOrder}>
            {OrderOnline?.length > 0 &&
              OrderOnline?.map((item: any) => (
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
                        onPress={() => handleDetailOnlineCart(item)}>
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
});

export default OnlineStoreScreen;
