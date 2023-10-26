import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import {useStore} from '../store/store';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import CustomIcon from '../components/CustomIcon';
import {FlatList} from 'react-native';
import CoffeeCard from '../components/CoffeeCard';
import {Dimensions} from 'react-native';
import HeaderStore from '../components/Store/HeaderStore';
import LocationInfo from '../components/Store/LocationInfo';
import ShipStore from '../components/Store/ShipStore';
import ProductCard from '../components/Store/ProductCard';
import {HttpClient} from '../service/http-client';
import PopUpAnimation from '../components/PopUpAnimation';
import {NAME_APP} from '@env';

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].name] == undefined) {
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
};

const getCoffeeList = (category: string, data: any) => {
  if (category == 'All') {
    return data;
  } else {
    let coffeelist = data.filter((item: any) => item.name == category);
    return coffeelist;
  }
};

const StoreScreen = ({navigation, route}: any) => {
  // Store
  const {id} = route?.params;

  const addToStore = useStore((state: any) => state.addToStore);
  const StateStore = useStore((state: any) => state.Store);

  const [StoreData, setStoredata] = useState<any>({
    data: [],
    loading: false,
  });

  const CoffeeList = useStore((state: any) => state.CoffeeList);
  const BeanList = useStore((state: any) => state.BeanList);
  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  const CartList = useStore((state: any) => state.CartList);
  const CartPrice = useStore((state: any) => state.CartPrice);

  const [categories, setCategories] = useState<any>(
    getCategoriesFromData(CoffeeList),
  );
  const [searchText, setSearchText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flastListRef = useRef<any>(null);
  const [categoryIndex, setCategoryIndex] = useState<any>({
    index: 0,
    category: categories[0],
  });
  const [sortedCoffee, setSortedCoffee] = useState(
    getCoffeeList(categoryIndex.category, CoffeeList),
  );

  const [viewHeight, setViewHeight] = useState(0);

  const onLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setViewHeight(height + widthResponsive(10));
  };

  const ListRef: any = useRef<FlatList>();

  const searchCoffee = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({index: 0, category: categories[0]});
      setSortedCoffee([
        ...CoffeeList.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      ]);
    }
  };

  const resetSearchCoffee = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({index: 0, category: categories[0]});
    setSortedCoffee([...CoffeeList]);
    setSearchText('');
  };

  const CoffeCardAddToCart = ({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    prices,
  }: any) => {
    addToCart({
      id,
      index,
      name,
      roasted,
      imagelink_square,
      special_ingredient,
      type,
      prices,
    });

    calculateCartPrice();

    if (Platform.OS) return Alert.alert(`${name} is Added to Cart`);

    ToastAndroid.showWithGravity(
      `${name} is Added to Cart`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  useEffect(() => {
    handleGetStore();
  }, []);

  const handleGetStore = async () => {
    setStoredata({loading: true, data: []});

    const res = await HttpClient.get(`/stores/${id}`, null);

    if (!res) return setStoredata({loading: false, data: []});

    return setTimeout(
      () => setStoredata({loading: false, data: res?.result?.store}),
      500,
    );
  };

  if (StoreData.loading)
    return (
      <PopUpAnimation
        style={styles.LottieAnimation}
        source={require('../lottie/loading.json')}
      />
    );

  if (StoreData?.data?.length === 0)
    return (
      <PopUpAnimation
        style={styles.LottieAnimation}
        source={require('../lottie/empty.json')}
        navigation={() => navigation.goBack()}
      />
    );

  return (
    <SafeAreaView style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          ...styles.ScrollViewFlex,
          paddingBottom: viewHeight + widthResponsive(10),
        }}>
        {/* App Header */}
        <HeaderStore navigation={navigation} data={StoreData?.data} />

        {/* Good Food */}
        <View style={styles.HeaderFoodMemo}>
          <View style={styles.GoodFoodContainer}>
            <Text style={styles.TextGoodFood}>{NAME_APP} Partner</Text>
          </View>

          <Text style={styles.TextGoodFoodMemo}>
            {StoreData?.data?.address}
          </Text>
        </View>

        {/* Location Info */}
        <LocationInfo />

        {/* Ship info */}
        <ShipStore />

        {/* Categories */}

        <FlatList
          ref={flastListRef}
          horizontal
          initialScrollIndex={categoryIndex.index}
          showsHorizontalScrollIndicator={false}
          style={styles.CategoryScrollViewStyle}
          keyExtractor={item => item.id}
          data={categories}
          renderItem={({item, index}: any) => {
            return (
              <View
                key={index.toString()}
                style={{
                  ...styles.CategoryScrollViewContainer,
                  backgroundColor:
                    categoryIndex.index == index ? '#008810' : '#F5F5F5',
                  borderRadius: 15,
                  marginRight: widthResponsive(10),
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: widthResponsive(6),
                }}>
                <TouchableOpacity
                  style={styles.CategoryScrollViewItem}
                  onPress={() => {
                    ListRef?.current?.scrollToOffset({
                      animated: true,
                      offset: 0,
                    });
                    setCategoryIndex({
                      index: index,
                      category: categories[index],
                    });
                    setSortedCoffee([
                      ...getCoffeeList(categories[index], CoffeeList),
                    ]);
                  }}>
                  <Text
                    style={[
                      styles.CategoryText,
                      categoryIndex.index == index
                        ? {color: COLORS.primaryWhiteHex}
                        : {},
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />

        {/* Category Scroller */}
        <Text style={styles.CategoriesTitle}>Hot Foods</Text>

        {/* List Hot */}
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <FlatList
            ref={ListRef}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.EmptyListContainer}>
                <Text style={styles.CategoryText}>No Coffee Available</Text>
              </View>
            }
            columnWrapperStyle={{justifyContent: 'space-between'}}
            showsHorizontalScrollIndicator={false}
            data={sortedCoffee}
            contentContainerStyle={styles.FlatListContainer}
            keyExtractor={item => item.id}
            numColumns={2}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('Details', {
                      index: item.index,
                      id: item.id,
                      type: item.type,
                    });
                  }}>
                  <ProductCard
                    id={item.id}
                    index={item.index}
                    type={item.type}
                    roasted={item.roasted}
                    imagelink_square={item.imagelink_square}
                    name={item.name}
                    special_ingredient={item.special_ingredient}
                    average_rating={item.average_rating}
                    price={item.prices[2]}
                    buttonPressHandler={CoffeCardAddToCart}
                    favourite={item?.favourite}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Name Products */}
        <Text style={styles.CoffeeBeansTitle}>Coffee Beans</Text>

        {/* Beans Flatlist */}
        <FlatList
          onScroll={(event: any) => {
            const indx = event.nativeEvent.contentOffset.y / 50;
            setCategoryIndex({
              ...categoryIndex,
              index: indx.toFixed(0),
            });
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BeanList}
          contentContainerStyle={[styles.FlatListContainer]}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.push('Details', {
                    index: item.index,
                    id: item.id,
                    type: item.type,
                  });
                }}>
                <CoffeeCard
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  roasted={item.roasted}
                  imagelink_square={item.imagelink_square}
                  name={item.name}
                  special_ingredient={item.special_ingredient}
                  average_rating={item.average_rating}
                  price={item.prices[2]}
                  buttonPressHandler={CoffeCardAddToCart}
                />
              </TouchableOpacity>
            );
          }}
        />
      </ScrollView>

      {/* Cart Button */}
      <TouchableOpacity onPress={() => navigation.navigate('CartStore')}>
        <View style={styles.CartDisplay} onLayout={onLayout}>
          <View style={styles.CartContentCount}>
            <Text style={styles.TextCountCartFood}>
              {CartList?.length} dish
            </Text>
            <Text style={styles.TextCountCartFood} numberOfLines={1}>
              Sasin - Mi Cay 7 Cap Do Han Quoc, Nguyen Van Qua
            </Text>
          </View>

          <Text style={styles.TextTotalPriceCartFood}>{CartPrice} $</Text>
          <CustomIcon
            name={'cart'}
            color={COLORS.primaryWhiteHex}
            size={FONTSIZE.size_24}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryWhiteHex,
    position: 'relative',
  },
  linearGradient: {
    flex: 1,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    marginHorizontal: SPACING.space_30,
    marginBottom: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  TextGoodFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryWhiteHex,
    textAlign: 'center',
  },
  TextGoodFoodMemo: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryLightGreyHex,
  },
  GoodFoodContainer: {
    backgroundColor: '#A80017',
    borderRadius: 15,
    width: widthResponsive(110),
    padding: widthResponsive(4),
    marginRight: widthResponsive(8),
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    padding: SPACING.space_20,

    justifyContent: 'space-between',
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  CoffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontWeight: 'bold',
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryBlackRGBA,
  },
  CategoriesTitle: {
    fontSize: FONTSIZE.size_16,
    marginLeft: SPACING.space_30,
    fontWeight: '600',
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryBlackRGB,
  },
  HeaderFoodMemo: {
    height: 'auto',
    padding: SPACING.space_20,
    paddingBottom: SPACING.space_20,
    gap: widthResponsive(10),
  },
  TextCountCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.primaryWhiteHex,
    fontWeight: '600',
  },
  TextTotalPriceCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
    fontWeight: '600',
    textAlign: 'right',
    marginRight: widthResponsive(4),
  },
  CartDisplay: {
    position: 'absolute',
    backgroundColor: '#008810',
    bottom: widthResponsive(4),
    right: 0,
    left: 0,
    justifyContent: 'space-between',
    marginHorizontal: widthResponsive(20),
    borderRadius: widthResponsive(15),
    padding: widthResponsive(8),
    paddingHorizontal: widthResponsive(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  CartContentCount: {
    gap: widthResponsive(2),
    width: '70%',
  },
  LottieAnimation: {
    flex: 1,
  },
});

export default StoreScreen;
