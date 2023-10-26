import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, SPACING, widthResponsive} from '../theme/theme';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import CustomIcon from '../components/CustomIcon';
import LottieView from 'lottie-react-native';
import ScanScreen from '../screens/ScanScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}: any) => (
            <CustomIcon
              name="home"
              size={25}
              color={focused ? '#2B377D' : COLORS.primaryLightGreyHex}
            />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <CustomIcon
              name="cart"
              size={25}
              color={focused ? '#2B377D' : COLORS.primaryLightGreyHex}
            />
          ),
        }}></Tab.Screen>

      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: () => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primaryWhiteHex,
                width: Platform.OS == 'ios' ? 50 : 60,
                height: Platform.OS == 'ios' ? 50 : 60,
                top: Platform.OS == 'ios' ? -15 : -20,
                borderRadius: Platform.OS == 'ios' ? 25 : 30,
              }}>
              <LottieView
                style={styles.LottieStyle}
                source={require('../lottie/scan.json')}
                autoPlay
                loop
              />
            </View>
          ),
        }}></Tab.Screen>

      <Tab.Screen
        name="Favorite"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({focused}: any) => (
            <CustomIcon
              name="like"
              size={25}
              color={focused ? '#2B377D' : COLORS.primaryLightGreyHex}
            />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="History"
        component={OrderHistoryScreen}
        options={{
          tabBarIcon: ({focused}: any) => (
            <CustomIcon
              name="bell"
              size={25}
              color={focused ? '#2B377D' : COLORS.primaryLightGreyHex}
            />
          ),
        }}></Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    position: 'absolute',
    backgroundColor: '#181A28',
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
    borderTopRightRadius: SPACING.space_18,
    borderTopLeftRadius: SPACING.space_18,
    borderWidth: 1,
  },
  LottieStyle: {
    height: widthResponsive(35),
    width: widthResponsive(35),
  },
});

export default TabNavigator;
