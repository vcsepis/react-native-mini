import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import {HttpClient} from '../service/http-client';
import {CacheUtil} from '../utils';

interface Iprops {}

const FoodComponent: React.FC<Iprops> = ({}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    handleGetStore();
  }, []);

  const handleGetStore = async () => {
    const token = await CacheUtil.Token;
    const res = await HttpClient.get(`/v1/e-commerce/categories`, null);
    console.log(res, '123');
    console.log(token, '123456');

    if (!res) return setCategories([]);

    return setCategories(res.result);
  };

  return (
    <View style={styles.Root}>
      <View style={styles.Container}>
        <View style={styles.Categories}>
          <View style={styles.Item}>
            <Text style={styles.TextCommon}>TODO CART</Text>
          </View>
        </View>

        <View style={styles.Product}>
          <Text style={styles.TextCommon}>TODO CART</Text>
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
  },
  Product: {
    width: '75%',
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
    fontSize: FONTSIZE.size_16,
  },
});

export default FoodComponent;
