import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import {HttpClient} from '../service/http-client';
import {CacheUtil} from '../utils';
import FoodComponent from '../components/Food';
import {useStore} from '../store/store';
import PopUpProduct from '../components/PopupProduct';
import StoreCart from '../components/StoreCart';

enum TAB {
  TAB_HOME,
  TAB_MENU,
  TAB_FOOD,
  TAB_CART,
  TAB_SETTING,
}

const RENDER_VIEW = (tab: any, stateProduct?: any) => {
  switch (tab) {
    case TAB.TAB_HOME:
      return <Text style={styles.TextCommon}>TODO CART</Text>;
    case TAB.TAB_MENU:
      return <Text style={styles.TextCommon}>TODO CART</Text>;
    case TAB.TAB_FOOD:
      return <FoodComponent />;
    case TAB.TAB_CART:
      return <Text style={styles.TextCommon}>TODO CART</Text>;
    case TAB.TAB_SETTING:
      return <Text style={styles.TextCommon}>TODO CART</Text>;
    default:
      return <Text style={styles.TextCommon}>Home</Text>;
  }
};

const INIT_STATE_PRODUCT = {
  product: [],
  categories: [],
};

const HomeStoreScreen = ({navigation}: any) => {
  const [tab, setTab] = useState(TAB.TAB_HOME);
  const [stateProduct, setStateProduct] = useState(INIT_STATE_PRODUCT);
  const AddCategory = useStore((state: any) => state.addCategory);
  const IsShowProduct = useStore((state: any) => state.IsShowProduct);
  const onIsShowProduct = useStore((state: any) => state.onIsShowProduct);

  const handleChangeTab = (tabSelected: any) => setTab(tabSelected);

  useEffect(() => {
    handleGetStore();
  }, []);

  const handleGetStore = async () => {
    const token = await CacheUtil.Token;
    const resCategories = await HttpClient.get(
      `/v1/e-commerce/categories?category=&page=&limit=&keyword=`,
      null,
      token,
    );

    if (!resCategories) return setStateProduct(INIT_STATE_PRODUCT);

    AddCategory(resCategories?.result?.categories);
    return setStateProduct({
      ...stateProduct,
      categories: resCategories?.result?.categories,
    });
  };

  return (
    <LinearGradient
      colors={['#F0EDFC', '#DFDCEB', '#DAD7E6']}
      style={styles.linearGradient}>
      <SafeAreaView style={styles.ScreenContainer}>
        <StatusBar backgroundColor={COLORS.primaryBlackHex} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ScrollViewFlex}>
          <View style={styles.ViewHeader}>
            {/* Header */}
            <View style={styles.HeaderContainer}>
              <Image
                source={{
                  uri: 'https://cdn.discordapp.com/attachments/1060582873771552778/1149413998366838885/E.png?fbclid=IwAR3Tjf1l1OxeL3VjNtnGDxCldL1hd2lmQOZwggeo4MnbSmzWowRhl8iAHgE',
                }}
                style={styles.Image}
              />

              <View style={styles.HeaderMenu}>
                <TouchableOpacity onPress={() => handleChangeTab(TAB.TAB_HOME)}>
                  <CustomIcon
                    name={'home'}
                    color={
                      tab === TAB.TAB_HOME
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                    size={FONTSIZE.size_30 * 1.2}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleChangeTab(TAB.TAB_MENU)}>
                  <CustomIcon
                    name={'menu'}
                    color={
                      tab === TAB.TAB_MENU
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                    size={FONTSIZE.size_30 * 1.2}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleChangeTab(TAB.TAB_FOOD)}>
                  <CustomIcon
                    name={'bell'}
                    color={
                      tab === TAB.TAB_FOOD
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                    size={FONTSIZE.size_30 * 1.2}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleChangeTab(TAB.TAB_CART)}>
                  <CustomIcon
                    name={'cart'}
                    color={
                      tab === TAB.TAB_CART
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                    size={FONTSIZE.size_30 * 1.2}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleChangeTab(TAB.TAB_SETTING)}>
                  <CustomIcon
                    name={'bell'}
                    color={
                      tab === TAB.TAB_SETTING
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                    size={FONTSIZE.size_30 * 1.2}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Contain */}
            <View style={styles.Contain}>{RENDER_VIEW(tab, stateProduct)}</View>
          </View>

          {/* Cart */}
          <View style={styles.CartView}>
            <StoreCart />
          </View>

          {/* Product Popup */}
        </ScrollView>
        {IsShowProduct && <PopUpProduct />}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  ScrollViewFlex: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_20,
  },
  Image: {
    height: SPACING.space_36 * 4,
    width: SPACING.space_36 * 4,
  },
  ViewHeader: {width: '70%', gap: SPACING.space_20},
  HeaderContainer: {
    backgroundColor: COLORS.primaryWhiteHex,
    width: '100%',
    paddingLeft: SPACING.space_10,
    paddingRight: SPACING.space_20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: SPACING.space_15,
    borderBottomEndRadius: SPACING.space_15,
  },
  HeaderMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '65%',
  },
  Contain: {
    width: '100%',
    flex: 1,
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_16,
  },
  CartView: {
    backgroundColor: COLORS.primaryWhiteHex,
    width: '30%',
    borderTopLeftRadius: SPACING.space_15,
    borderBottomStartRadius: SPACING.space_15,
    padding: SPACING.space_20,
    flex: 1,
  },
});

export default HomeStoreScreen;
