import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Fragment, useContext} from 'react';
import LoginScreen from '../screens/AuthScreen/Login';
import HomeStoreScreen from '../screens/HomeStoreScreen';
import {AuthContext} from '../utils';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {isAuth}: any = useContext(AuthContext);

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default Navigation;
