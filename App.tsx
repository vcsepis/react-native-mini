import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {AuthProvider} from './src/utils';
import Navigation from './src/navigation';

const App = () => {
  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 1000);
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
