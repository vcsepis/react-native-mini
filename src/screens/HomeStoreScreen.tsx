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

enum TAB {
  TAB_HOME,
  TAB_MENU,
  TAB_FOOD,
  TAB_CART,
  TAB_SETTING,
}

const RENDER_VIEW = (tab: any) => {
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

const HomeStoreScreen = ({navigation}: any) => {
  const [tab, setTab] = useState(TAB.TAB_HOME);

  const handleChangeTab = (tabSelected: any) => setTab(tabSelected);

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
            <View style={styles.Contain}>{RENDER_VIEW(tab)}</View>
          </View>

          {/* Cart */}
          <View style={styles.CartView}>
            <TouchableOpacity>
              <Text style={styles.TextCommon}>TODO CART</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: SPACING.space_15,
    borderBottomStartRadius: SPACING.space_15,
  },
});

export default HomeStoreScreen;
