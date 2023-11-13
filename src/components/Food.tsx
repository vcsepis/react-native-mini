import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import {useStore} from '../store/store';
import LottieView from 'lottie-react-native';
import CustomIcon from './CustomIcon';
import Voice from '@react-native-voice/voice';

const INIT_RECOGNIZING = {
  started: false,
  ended: false,
  results: '',
};
interface Iprops {
  handleGetStore?: any;
}

const handleFilter = (data: any, id: any) => {
  if (id === 0) return data;
  return data?.filter((item: any) => item?.id === id);
};

const FoodComponent: React.FC<Iprops> = ({handleGetStore}) => {
  const [product, setProduct] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [recognizing, setRecognizing] = useState({
    started: false,
    ended: false,
    results: '',
  });

  const Category = useStore((state: any) => state.Category);
  const onIsShowProduct = useStore((state: any) => state.onIsShowProduct);
  const addProductCurrent = useStore((state: any) => state.addProductCurrent);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (Category?.length) {
      setCategoryId(0);
      setProduct(Category);
    }
  }, [Category]);

  const handleCategory = (id: any) => {
    const data = handleFilter(Category, id);
    setCategoryId(id);
    setProduct(data);
  };

  const handleProduct = (product: any) => {
    onIsShowProduct(true);
    addProductCurrent({
      ...product,
      index: undefined,
      price: product?.price,
      quantity: 1,
      variants: product?.variants?.length
        ? product?.variants?.map((item: any) => ({
            ...item,
            options: item?.options?.length
              ? item?.options?.map((option: any) => ({...option, quantity: 0}))
              : [],
          }))
        : [],
    });
  };

  if (!Category)
    return (
      <View style={styles.Root}>
        <View style={styles.CategoryGoContainer}>
          <LottieView
            style={styles.CategoryGo}
            source={require('../lottie/empty.json')}
            autoPlay
            loop
          />
        </View>
      </View>
    );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleGetStore();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSearch = (_text: any) => {};

  const resetSearch = () => {
    setSearchText('');
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = (e: any) => {
    console.log(e);
    setRecognizing({...recognizing, started: true});
  };

  const onSpeechEndHandler = (e: any) => {
    console.log(e);
    setRecognizing({...recognizing, ended: true});
  };

  const onSpeechResultsHandler = (e: any) => {
    console.log(e);
    setRecognizing({...recognizing, results: e.value});
  };

  const startRecognizing = async () => {
    try {
      await Voice.start('en-US');
      setRecognizing(INIT_RECOGNIZING);
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      await Voice.destroy();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.Root}>
      <View style={styles.Container}>
        <View style={styles.Categories}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {Category?.length ? (
              <TouchableOpacity
                style={{
                  ...styles.Item,
                  marginBottom: SPACING.space_20,
                  backgroundColor:
                    categoryId === 0
                      ? COLORS.primaryGreenRGB
                      : COLORS.primaryWhiteHex,
                }}
                onPress={() => handleCategory(0)}>
                <Text
                  style={{
                    ...styles.TextCommon,
                    color:
                      categoryId === 0
                        ? COLORS.primaryWhiteHex
                        : COLORS.primaryBlackHex,
                  }}>
                  All
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}

            {Category?.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  ...styles.Item,
                  marginBottom: SPACING.space_20,
                  backgroundColor:
                    categoryId === item.id
                      ? COLORS.primaryGreenRGB
                      : COLORS.primaryWhiteHex,
                }}
                onPress={() => handleCategory(item?.id)}>
                <Text
                  style={{
                    ...styles.TextCommon,
                    color:
                      categoryId === item.id
                        ? COLORS.primaryWhiteHex
                        : COLORS.primaryBlackHex,
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.Product}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View>
            <View style={styles.InputContainerComponent}>
              <TouchableOpacity
                onPress={() => {
                  startRecognizing();
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
                placeholder="Find products..."
                value={searchText}
                onChangeText={text => {
                  setSearchText(text);
                  handleSearch(text);
                }}
                placeholderTextColor={COLORS.primaryBlackHex}
                style={styles.TextInputContainer}
              />

              {searchText.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    stopRecognizing();
                    resetSearch();
                  }}>
                  <CustomIcon
                    style={styles.InputIcon}
                    name="close"
                    size={FONTSIZE.size_16}
                    color={
                      searchText.length > 0
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                  />
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          </View>
          <View style={styles.ProductContainer}>
            {product?.length ? (
              product?.map((item: any) => (
                <Fragment key={item.id}>
                  {item?.products?.length ? (
                    item?.products
                      ?.filter((prod: any) => prod?.name?.includes(searchText))
                      ?.map((product: any) => (
                        <TouchableOpacity
                          key={product?.id}
                          style={{
                            ...styles.ProductItem,
                            backgroundColor: COLORS.primaryWhiteHex,
                          }}
                          onPress={() => handleProduct(product)}>
                          <Text style={styles.TextProduct}>{product.name}</Text>
                          <Text style={styles.TextProductPrice}>
                            {(product.price / 100).toFixed(2)} $
                          </Text>
                        </TouchableOpacity>
                      ))
                  ) : (
                    <></>
                  )}
                </Fragment>
              ))
            ) : (
              <></>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Root: {
    flex: 1,
    paddingLeft: SPACING.space_10,
  },
  Container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
  },
  Categories: {
    width: '25%',
  },
  Product: {
    width: '75%',
    paddingRight: SPACING.space_20,
  },
  Item: {
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    padding: SPACING.space_10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  ProductContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.space_16,
  },
  ProductItem: {
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    alignItems: 'center',
    width: '48%',
    paddingVertical: SPACING.space_30,
    gap: SPACING.space_10,
  },
  CategoryGo: {
    height: widthResponsive(150),
    width: '100%',
    borderRadius: BORDERRADIUS.radius_20,
  },
  CategoryGoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextProduct: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextProductPrice: {
    fontFamily: FONTFAMILY.poppins_bold,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_20,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    marginBottom: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
    backgroundColor: COLORS.primaryWhiteHex,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
});

export default FoodComponent;
