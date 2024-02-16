import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Fragment, useContext, useEffect} from 'react';
import LoginScreen from '../screens/AuthScreen/Login';
import HomeStoreScreen from '../screens/HomeStoreScreen';
import {AuthContext, Cache} from '../utils';
import {StripeTerminalProvider} from '@stripe/stripe-terminal-react-native';
import {useStore} from '../store/store';
import {HttpClient} from '../service/http-client';
import {Alert, Platform, ToastAndroid} from 'react-native';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {isAuth}: any = useContext(AuthContext);

  const onAddDataComplete = useStore((state: any) => state.onAddDataComplete);

  const fetchTokenProvider = async () => {
    const token = await Cache.Token;
    const {secret}: any = await HttpClient.get(
      `/v1/stores/pos/tokens`,
      null,
      token,
    );

    return secret;
  };

  useEffect(() => {
    if (isAuth) {
      onAddDataComplete(true);
    }
  }, [isAuth]);
  return (
    <StripeTerminalProvider
      logLevel="verbose"
      tokenProvider={fetchTokenProvider}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuth ? (
          <Stack.Screen
            name="Home"
            component={HomeStoreScreen}
            options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        )}
      </Stack.Navigator>
    </StripeTerminalProvider>
  );
};

export default Navigation;
