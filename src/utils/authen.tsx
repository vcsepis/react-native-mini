import AsyncStorage from '@react-native-async-storage/async-storage';
import {useReducer, createContext, useEffect} from 'react';
import {CacheUtil} from '.';
import {HttpClient} from '../service/http-client';

export const AuthContext = createContext({});

export function AuthProvider({children}: any) {
  const [state, setAuth] = useReducer(
    (prev: any, newState: any) => {
      return {...prev, ...newState};
    },
    {
      isAuth: false,
      aToken: '',
      rToken: '',
      user: {},
    },
  );

  useEffect(() => {
    if (state.rToken) {
      AsyncStorage.setItem('RefreshToken', state.rToken);
    }
  }, [state.rToken]);

  useEffect(() => {
    if (!state.aToken) {
      return;
    }

    verifyToken();
  }, [state.aToken]);

  useEffect(() => {
    reFreshToken();
  }, []);

  const verifyToken = async () => {
    const token = await CacheUtil.Token;
    const res = await HttpClient.get(`/v1/auth/profile`, null, token);

    if (!res) return;
    setAuth({isAuth: true, user: res.result});
  };

  const reFreshToken = async () => {
    const rToken = await CacheUtil.RefreshToken;
    const res = await HttpClient.get(`/v1/auth/refresh-token`, null, rToken);

    if (res.errorCode !== '000')
      return setAuth({
        isAuth: false,
        aToken: '',
        rToken: '',
        user: {},
      });

    setAuth({rToken, aToken: res.result.accessToken});
    CacheUtil.Token = res.result.accessToken;
    CacheUtil.RefreshToken = res.result.refreshToken;
  };

  return (
    <AuthContext.Provider value={{...state, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
}
