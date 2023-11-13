import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import React, {useEffect, useState} from 'react';
import {Cache} from '../utils';
import {HttpClient} from '../service/http-client';
import moment from 'moment';
import {useStore} from '../store/store';
import CustomIcon from '../components/CustomIcon';
import {Calendar} from 'react-native-calendars';

const INIT_STATE = {
  current: [],
  data: [],
};

const INIT_DATE = new Date();

const HistoryScreen = () => {
  const onAddStoreViewCart = useStore((state: any) => state.onAddStoreViewCart);

  const [listOrder, setListOrder] = useState(INIT_STATE);
  const [searchText, setSearchText] = useState('');
  const [selectedId, setSelectedId] = useState<any>();
  const [searchDate, setSearchDate] = useState(
    moment(INIT_DATE).format('YYYY-MM-DD'),
  );
  const [isShowCalendar, setIsShowCalendar] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const currentDate = moment(INIT_DATE).format('YYYY-MM-DD');
  const beforeCurrentDate = moment(INIT_DATE).subtract(7, 'days');

  useEffect(() => {
    handleGetStore();

    () => {
      onAddStoreViewCart([]);
    };
  }, []);

  const handleGetStore = async () => {
    const token = await Cache.Token;
    const res = await HttpClient.get(
      `/v1/e-commerce/orders?status=&fromDate=&toDate=&paymentType=&page=1&limt=1000`,
      null,
      token,
    );

    if (!res) return setListOrder(INIT_STATE);

    setListOrder({current: res?.result?.orders, data: res?.result?.orders});
  };

  const handleGetDetailProduct = async (item: any) => {
    setSelectedId(item?.id);
    const token = await Cache.Token;
    const res = await HttpClient.get(
      `v1/e-commerce/orders/${item?.id}`,
      null,
      token,
    );

    if (!res) return;

    onAddStoreViewCart([res?.result?.order]);
  };

  const handleSearch = (_text: any) => {
    const data = listOrder?.data.filter((item: any) => {
      const momentCreateAt = moment(item?.createdAt).format('YYYY-MM-DD');
      const momentDate = moment(searchDate).format('YYYY-MM-DD');
      const includesId = item?.id?.toLowerCase()?.includes(searchText);
      return momentCreateAt === momentDate && includesId;
    });
    setListOrder({
      ...listOrder,
      current: data,
    });
  };

  const handleToggleCalendar = () => setIsShowCalendar(!isShowCalendar);

  const handlePressCalendar = (date: any) => {
    const data = listOrder?.data.filter((item: any) => {
      const momentCreateAt = moment(item?.createdAt).format('YYYY-MM-DD');
      const momentDate = moment(date).format('YYYY-MM-DD');
      const includesId = item?.id?.toLowerCase()?.includes(searchText);
      return momentCreateAt === momentDate && includesId;
    });

    setListOrder({
      ...listOrder,
      current: data,
    });
    setIsShowCalendar(false);
  };

  const resetSearch = () => {
    setSearchText('');
    setSearchDate(moment(INIT_DATE).format('YYYY-MM-DD'));
    setListOrder({
      ...listOrder,
      current: listOrder?.data,
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleGetStore();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.Root}>
      <View style={styles.HeaderContain}>
        <View style={styles.InputContainerComponent}>
          <TouchableOpacity
            onPress={() => {
              handleSearch(searchText);
            }}>
            <CustomIcon
              style={styles.InputIcon}
              name="search"
              size={FONTSIZE.size_28}
              color={
                searchText.length > 0
                  ? COLORS.primaryGreenRGB
                  : COLORS.primaryLightGreyHex
              }
            />
          </TouchableOpacity>

          <TextInput
            placeholder="Find Your OrderId..."
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              handleSearch(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />

          {searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                resetSearch();
              }}>
              <CustomIcon
                style={styles.InputIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryLightGreyHex}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>

        <View style={styles.InputDateComponent}>
          <TouchableOpacity onPress={handleToggleCalendar}>
            <Text style={styles.TextCommon}>
              {moment(searchDate).format('DD, MMMM, YYYY')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.TableOrder}>
          <View style={styles.Row}>
            <View style={styles.ContainerTableHeader}>
              <Text style={styles.TextHeaderTitle}>Order Id</Text>
            </View>
            <View style={styles.ContainerTableHeaderNumber}>
              <Text style={styles.TextHeaderTitle}>Date</Text>
            </View>
            <View style={styles.ContainerTableHeaderNumber}>
              <Text style={styles.TextHeaderTitle}>Amount</Text>
            </View>
            <View style={styles.ContainerTableHeaderNumber}>
              <Text style={styles.TextHeaderTitle}>Payment Method</Text>
            </View>
            <View style={styles.ContainerTableHeaderNumber}>
              <Text style={styles.TextHeaderTitle}>Edit</Text>
            </View>
          </View>

          {listOrder?.current.map((item: any, index: any) => (
            <View
              style={{
                ...styles.Row,
                borderColor:
                  item?.id === selectedId ? COLORS.primaryGreenRGB : '#ddd',
              }}
              key={index}>
              <View style={styles.ContainerTableHeader}>
                <Text style={styles.TextCommon}>{item.id}</Text>
              </View>
              <View style={styles.ContainerTableHeaderNumber}>
                <Text style={styles.TextCommon}>
                  {moment(item.createdAt).format('DD, MMMM, YYYY')}
                </Text>
              </View>
              <View style={styles.ContainerTableHeaderNumber}>
                <Text style={styles.TextNumber}>
                  $ {(item.total / 100).toFixed(2)}
                </Text>
              </View>
              <View style={styles.ContainerTableHeaderNumber}>
                <Text style={styles.TextNumber}>{item.paymentType}</Text>
              </View>
              <View style={styles.ContainerTableHeaderNumber}>
                <TouchableOpacity onPress={() => handleGetDetailProduct(item)}>
                  <Text style={styles.TextView}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {isShowCalendar ? (
        <View style={styles.CalendarComponent}>
          <Calendar
            onDayPress={day => {
              setSearchDate(day.dateString);
              handlePressCalendar(day.dateString);
            }}
            markedDates={{
              [searchDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'orange',
              },
            }}
            style={styles.Calendar}
          />
        </View>
      ) : (
        <></>
      )}
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
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_20,
  },
  Row: {
    maxWidth: '100%',
    flexDirection: 'row',
    paddingHorizontal: SPACING.space_20,
    borderColor: '#ddd',
    borderWidth: SPACING.space_2,
    paddingVertical: SPACING.space_20,
  },
  ContainerTableHeader: {
    width: '20%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ContainerTableContain: {
    width: '20%',
    borderRadius: 24,
    padding: SPACING.space_10,
  },
  TableOrder: {
    marginVertical: SPACING.space_20,
    marginBottom: widthResponsive(60),
  },
  ContainerTableHeaderNumber: {
    width: '20%',
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: SPACING.space_20,
    position: 'relative',
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
  InputDateComponent: {
    backgroundColor: '#ddd',
    borderRadius: SPACING.space_24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
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
});

export default HistoryScreen;
