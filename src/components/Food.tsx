import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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

interface Iprops {}

const handleFilter = (data: any, id: any) => {
  if (id === 0) return data;
  return data?.filter((item: any) => item?.id === id);
};

const FoodComponent: React.FC<Iprops> = ({}) => {
  const [product, setProduct] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const Category = useStore((state: any) => state.Category);
  const onIsShowProduct = useStore((state: any) => state.onIsShowProduct);
  const addProductCurrent = useStore((state: any) => state.addProductCurrent);

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
      price: product?.price,
      quantity: 1,
      variants: product?.variants?.length
        ? product?.variants?.map((item: any) => ({
            ...item,
            options: item?.options?.length
              ? item?.options?.map((option: any) => ({...option, quantity: 1}))
              : [],
          }))
        : [],
    });
  };

  if (Category?.length === 0)
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

  return (
    <View style={styles.Root}>
      <View style={styles.Container}>
        <View style={styles.Categories}>
          {Category?.length && (
            <TouchableOpacity
              style={{
                ...styles.Item,
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
          )}

          {Category?.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              style={{
                ...styles.Item,
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
        </View>

        <View style={styles.Product}>
          <View style={styles.ProductContainer}>
            {product?.length ? (
              product?.map((item: any) => (
                <Fragment key={item.id}>
                  {item?.products?.length ? (
                    item?.products?.map((product: any) => (
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
        </View>
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
    gap: SPACING.space_20,
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
    fontSize: FONTSIZE.size_18,
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
});

export default FoodComponent;
