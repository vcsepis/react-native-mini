import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native';

import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../../theme/theme';
import LottieView from 'lottie-react-native';
import {CacheUtil} from '../../utils';
import PopUpAnimation from '../../components/PopUpAnimation';
import {HttpClient} from '../../service/http-client';

const initStateLogin = {
  countries: [],
  selectedCountryCode: {
    phoneCode: '',
    name: '',
  },
  isShowCountries: false,
};

const initStateSuccess = {
  step1: false,
  step2: false,
};

const LoginScreen = ({navigation}: any) => {
  const [stateLogin, setStateLogin] = useState(initStateLogin);
  const [password, setPassword] = useState('Th@i12022022');
  const [phone, setPhone] = useState<any>('484894945');
  const [stateSuccess, setStateSuccess] = useState<any>(initStateSuccess);

  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(true);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    handleGetStore();
  }, []);

  const handleGetStore = async () => {
    const res = await HttpClient.get(`/v1/countries`, null);

    if (!res) return setStateLogin(initStateLogin);

    return setStateLogin({...stateLogin, countries: res.result.countries});
  };

  const handleInputPhoneChange = (text: any) => {
    const filteredText = text.replace(/\D/gm, '');

    if (filteredText !== text) {
      setPhone(text);

      setTimeout(() => {
        setPhone((previousState: any) => {
          return previousState.replace(/\D/gm, '');
        });
      }, 0);
    } else {
      setPhone(filteredText);
    }
  };

  const handleSelectedCountryCode = (phoneCode: any, name: any) => {
    setStateLogin({
      ...stateLogin,
      selectedCountryCode: {phoneCode, name},
      isShowCountries: false,
    });
  };

  const handleToggleCountries = () =>
    setStateLogin({
      ...stateLogin,
      isShowCountries: !stateLogin?.isShowCountries,
    });

  const handleSubmit = async () => {
    if (password?.length === 0) {
      if (Platform.OS) return Alert.alert(`Password is required`);

      ToastAndroid.showWithGravity(
        `Password is required`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else if (phone?.length === 0) {
      if (Platform.OS) return Alert.alert(`Phone is required`);

      ToastAndroid.showWithGravity(
        `Phone is required`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else if (stateLogin?.selectedCountryCode?.phoneCode?.length === 0) {
      if (Platform.OS) return Alert.alert(`Please selected Country code`);

      ToastAndroid.showWithGravity(
        `Phone is required`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      const res: any = await HttpClient.post(`/v1/auth/sign-in`, {
        username: `${stateLogin?.selectedCountryCode?.phoneCode + phone}`,
        password: password,
      });
      if (res?.errorCode !== '000') {
        if (Platform.OS) return Alert.alert(res?.message);

        ToastAndroid.showWithGravity(
          res?.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else return handleLoginSuccess(res);
    }
  };

  const handleLoginSuccess = async (res: any) => {
    CacheUtil.Token = res?.result?.accessToken;
    CacheUtil.RefreshToken = res?.result?.refreshToken;

    // setStateSuccess({...initStateLogin, step1: true});

    setStateSuccess({...initStateSuccess, step2: true});

    setPassword('');
    setPhone('');
    setStateLogin(initStateLogin);

    return setTimeout(() => {
      navigation.push('Home');
      setStateSuccess(initStateSuccess);
    }, 850);
  };

  if (stateSuccess.step2)
    return (
      <PopUpAnimation
        isBg
        style={{flex: 1}}
        source={require('../../lottie/success.json')}
      />
    );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          paddingHorizontal: 25,
          width: '40%',
        }}>
        <LottieView
          style={{
            height: 300,
            width: 300,
            alignSelf: 'center',
          }}
          source={require('../../lottie/login.json')}
          autoPlay
          loop
        />
      </View>
      <View
        style={{
          paddingRight: '5%',
          width: '60%',
          position: 'relative',
        }}>
        <Text
          style={{
            fontFamily: FONTFAMILY.poppins_regular,
            fontSize: FONTSIZE.size_24,
            fontWeight: '600',
            color: COLORS.primaryBlackHex,
            marginBottom: SPACING.space_20,
          }}>
          Sign In to Epos
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
          }}>
          <TouchableOpacity
            onPress={handleToggleCountries}
            style={{
              borderRadius: SPACING.space_10,
              borderWidth: SPACING.space_10 / 10,
              borderColor: '#ccc',
              marginRight: SPACING.space_10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: FONTFAMILY.poppins_regular,
                fontSize: FONTSIZE.size_18,
                color: COLORS.primaryBlackHex,
                padding: SPACING.space_10,
              }}>
              {stateLogin?.selectedCountryCode?.name?.length > 0
                ? stateLogin?.selectedCountryCode?.name +
                  ` +(${stateLogin?.selectedCountryCode?.phoneCode})`
                : 'Please selected'}
            </Text>
          </TouchableOpacity>
          <TextInput
            placeholder={'Phone Number'}
            keyboardType="numeric"
            value={phone}
            onChangeText={handleInputPhoneChange}
            style={{
              flex: 1,
              paddingVertical: 0,
              fontSize: FONTSIZE.size_18,
              fontFamily: FONTFAMILY.poppins_regular,
              color: COLORS.primaryBlackHex,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
          }}>
          <TextInput
            placeholder={'Password'}
            keyboardType={'visible-password'}
            style={{
              flex: 1,
              paddingVertical: 0,
              fontSize: FONTSIZE.size_18,
              fontFamily: FONTFAMILY.poppins_regular,
              color: COLORS.primaryBlackHex,
            }}
            secureTextEntry={showPassword}
            placeholderTextColor="#aaa"
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <Text
              style={{
                fontSize: FONTSIZE.size_18,
                fontFamily: FONTFAMILY.poppins_regular,
                color: 'rgb(0, 159, 127)',
                fontWeight: 'bold',
              }}>
              {showPassword ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: 'rgb(0, 159, 127)',
            padding: SPACING.space_10,
            borderRadius: SPACING.space_10,
            marginBottom: SPACING.space_30,
          }}>
          <Text
            style={{
              color: COLORS.primaryWhiteHex,
              fontFamily: FONTFAMILY.poppins_regular,
              fontSize: FONTSIZE.size_18,
              textAlign: 'center',
              fontWeight: '600',
            }}>
            Sign In
          </Text>
        </TouchableOpacity>
        {stateLogin?.isShowCountries && (
          <View
            style={{
              position: 'absolute',
              top: 105,
              borderRadius: SPACING.space_10,
              borderWidth: SPACING.space_10 / 10,
              borderColor: '#ccc',
              backgroundColor: COLORS.primaryWhiteHex,
              zIndex: 999,
              padding: SPACING.space_10,
            }}>
            {stateLogin?.countries?.map((item: any) => (
              <TouchableOpacity
                key={item?.id}
                style={{
                  borderRadius: SPACING.space_8,
                  backgroundColor:
                    item?.phoneCode ===
                    stateLogin?.selectedCountryCode?.phoneCode
                      ? 'rgb(0, 159, 127)'
                      : COLORS.primaryWhiteHex,
                }}
                onPress={() =>
                  handleSelectedCountryCode(item?.phoneCode, item?.name)
                }>
                <Text
                  style={{
                    fontFamily: FONTFAMILY.poppins_regular,
                    fontSize: FONTSIZE.size_18,
                    color:
                      item?.phoneCode ===
                      stateLogin?.selectedCountryCode?.phoneCode
                        ? COLORS.primaryWhiteHex
                        : COLORS.primaryBlackHex,
                    padding: SPACING.space_10,
                  }}>
                  {item?.name} (+{item.phoneCode})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
