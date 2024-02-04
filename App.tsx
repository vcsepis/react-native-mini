import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {AuthProvider} from './src/utils';
import Navigation from './src/navigation';
import Toast from 'react-native-toast-message';
import ToastCustom from './src/components/Toast';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

const App = () => {
  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 1000);
  }, []);

  useKeepAwake();

  return (
    <>
      <AuthProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </AuthProvider>
      <Toast />
    </>
  );
};

export default App;
