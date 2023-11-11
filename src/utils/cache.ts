import AsyncStorage from '@react-native-async-storage/async-storage';

const Key = {
  Profile: 'profile',
  Token: 'access_token',
  RefreshToken: 'refresh_token',
  Language: 'language',
  DenyBrightness: 'deny_brightness',
  HomeData: 'home_data',
  LastRefreshTokenAt: 'last_refresh_token_at',
  DeviceToken: 'device_token',
  IsShowAddress: 'is_show_address_campaign',
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

  // Support methods
  static async clearLogout() {
    await AsyncStorage.removeItem(Key.Profile);
    await AsyncStorage.removeItem(Key.Token);
    await AsyncStorage.removeItem(Key.RefreshToken);
    await AsyncStorage.removeItem(Key.LastRefreshTokenAt);
  }
}
