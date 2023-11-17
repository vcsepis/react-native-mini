import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const Key: any = {
  Profile: 'profile',
  Token: 'access_token',
  RefreshToken: 'refresh_token',
  Language: 'language',
  DenyBrightness: 'deny_brightness',
  HomeData: 'home_data',
  LastRefreshTokenAt: 'last_refresh_token_at',
  DeviceToken: 'device_token',
  IsShowAddress: 'is_show_address_campaign',
  AutoAccept: false,
  CountOrder: 0,
  DateCountOrder: moment(new Date()).format('DD/MM/YYYY')
};

export class Cache {
  // TOKEN
  static set Token(data: any) {
    AsyncStorage.setItem(Key.Token, data);
  }

  static get Token() {
    return AsyncStorage.getItem(Key.Token);
  }

  // REFRESH_TOKEN
  static set RefreshToken(data: any) {
    AsyncStorage.setItem(Key.RefreshToken, data);
  }

  static get RefreshToken() {
    return AsyncStorage.getItem(Key.RefreshToken);
  }

  static set DenyBrightness(data: any) {
    AsyncStorage.setItem(Key.DenyBrightness, data);
  }

  static get DenyBrightness() {
    return AsyncStorage.getItem(Key.DenyBrightness);
  }

  // Profile
  // TODO

  // Home Data
  // TODO

  // TOKEN
  static set DeviceToken(data: any) {
    AsyncStorage.setItem(Key.DeviceToken, data);
  }

  static get DeviceToken() {
    return AsyncStorage.getItem(Key.DeviceToken);
  }

  // Data tab restaurant top
  // TODO END USER

  // TOKEN
  static set IsShowAddress(data: any) {
    AsyncStorage.setItem(Key.IsShowAddress, data);
  }

  static get IsShowAddress() {
    return AsyncStorage.getItem(Key.IsShowAddress);
  }

  // AutoAccept
  static set AutoAccept(data: any) {
    AsyncStorage.setItem(Key.AutoAccept, data);
  }

  static get AutoAccept() {
    return AsyncStorage.getItem(Key.AutoAccept);
  }

  // CountOrder
  static set CountOrder(data: any) {
    AsyncStorage.setItem(Key.CountOrder, data);
  }

  static get CountOrder() {
    return AsyncStorage.getItem(Key.CountOrder);
  }

  // DateCountOrder
  static set DateCountOrder(data: any) {
    AsyncStorage.setItem(Key.DateCountOrder, data);
  }

  static get DateCountOrder() {
    return AsyncStorage.getItem(Key.DateCountOrder);
  }


  // Support methods
  static async clearLogout() {
    await AsyncStorage.removeItem(Key.Profile);
    await AsyncStorage.removeItem(Key.Token);
    await AsyncStorage.removeItem(Key.RefreshToken);
    await AsyncStorage.removeItem(Key.LastRefreshTokenAt);
  }
}
