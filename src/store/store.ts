import { create } from 'zustand';
import { produce } from 'immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CoffeeData from '../data/CoffeeData';
import BeansData from '../data/BeansData';

export const useStore = create(
  persist(
    (set, get) => ({
      CoffeeList: CoffeeData,
      BeanList: BeansData,
      CartPrice: 0,
      FavoritesList: [],
      CartList: [],
      OrderHistoryList: [],
      Category: [],
      IsShowProduct: false,
      ProductCurrent: {},
      StoreCart: [],
      CalculateCart: {
        total: 0,
        data: {}
      },
      DetailStore: {},
      TargetDevice: {},
      StoreViewCart: [],
      StoreRealTime: {
        isShow: false,
        data: {}
      },
      OrderOnline: [],
      OrderOnlineCart: [],
      AutoAccept: false,
      DataId: { id: '' },
      DataStatus: true,
      FoodDataSuggest: false,
      Toast: {
        isShow: false,
        message: '',
        type: ''
      },
      WebView: false,
      DataComplete: false,
      DataPress: {
        isShow: false,
        data: [],
        currentData: [],
      },
      Secret: "",
      Products: [],
      Receipt: {
        isShow: false,
        data: {}
      },
      addToCart: (cartItem: any) =>
        set(
          produce(state => {
            let found = false;
            for (let i = 0; i < state.CartList.length; i++) {
              if (state.CartList[i].id == cartItem.id) {
                found = true;
                let size = false;
                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                  if (
                    state.CartList[i].prices[j].size == cartItem.prices[0].size
                  ) {
                    size = true;
                    state.CartList[i].prices[j].quantity++;
                    break;
                  }
                }
                if (size == false) {
                  state.CartList[i].prices.push(cartItem.prices[0]);
                }
                state.CartList[i].prices.sort((a: any, b: any) => {
                  if (a.size > b.size) {
                    return -1;
                  }
                  if (a.size < b.size) {
                    return 1;
                  }
                  return 0;
                });
                break;
              }
            }
            if (found == false) {
              state.CartList.push(cartItem);
            }
          }),
        ),
      calculateCartPrice: () =>
        set(
          produce(state => {
            let totalprice = 0;
            for (let i = 0; i < state.CartList.length; i++) {
              let tempprice = 0;
              for (let j = 0; j < state.CartList[i].prices.length; j++) {
                tempprice =
                  tempprice +
                  parseFloat(state.CartList[i].prices[j].price) *
                  state.CartList[i].prices[j].quantity;
              }
              state.CartList[i].ItemPrice = tempprice.toFixed(2).toString();
              totalprice = totalprice + tempprice;
            }
            state.CartPrice = totalprice.toFixed(2).toString();
          }),
        ),
      addToFavoriteList: (type: string, id: string) =>
        set(
          produce(state => {
            if (type == 'Coffee') {
              for (let i = 0; i < state.CoffeeList.length; i++) {
                if (state.CoffeeList[i].id == id) {
                  if (state.CoffeeList[i].favourite == false) {
                    state.CoffeeList[i].favourite = true;
                    state.FavoritesList.unshift(state.CoffeeList[i]);
                  } else {
                    state.CoffeeList[i].favourite = false;
                  }
                  break;
                }
              }
            } else if (type == 'Bean') {
              for (let i = 0; i < state.BeanList.length; i++) {
                if (state.BeanList[i].id == id) {
                  if (state.BeanList[i].favourite == false) {
                    state.BeanList[i].favourite = true;
                    state.FavoritesList.unshift(state.BeanList[i]);
                  } else {
                    state.BeanList[i].favourite = false;
                  }
                  break;
                }
              }
            }
          }),
        ),
      deleteFromFavoriteList: (type: string, id: string) =>
        set(
          produce(state => {
            if (type == 'Coffee') {
              for (let i = 0; i < state.CoffeeList.length; i++) {
                if (state.CoffeeList[i].id == id) {
                  if (state.CoffeeList[i].favourite == true) {
                    state.CoffeeList[i].favourite = false;
                  } else {
                    state.CoffeeList[i].favourite = true;
                  }
                  break;
                }
              }
            } else if (type == 'Beans') {
              for (let i = 0; i < state.BeanList.length; i++) {
                if (state.BeanList[i].id == id) {
                  if (state.BeanList[i].favourite == true) {
                    state.BeanList[i].favourite = false;
                  } else {
                    state.BeanList[i].favourite = true;
                  }
                  break;
                }
              }
            }
            let spliceIndex = -1;
            for (let i = 0; i < state.FavoritesList.length; i++) {
              if (state.FavoritesList[i].id == id) {
                spliceIndex = i;
                break;
              }
            }
            state.FavoritesList.splice(spliceIndex, 1);
          }),
        ),
      incrementCartItemQuantity: (id: string, size: string) =>
        set(
          produce(state => {
            for (let i = 0; i < state.CartList.length; i++) {
              if (state.CartList[i].id == id) {
                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                  if (state.CartList[i].prices[j].size == size) {
                    state.CartList[i].prices[j].quantity++;
                    break;
                  }
                }
              }
            }
          }),
        ),
      decrementCartItemQuantity: (id: string, size: string) =>
        set(
          produce(state => {
            for (let i = 0; i < state.CartList.length; i++) {
              if (state.CartList[i].id == id) {
                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                  if (state.CartList[i].prices[j].size == size) {
                    if (state.CartList[i].prices.length > 1) {
                      if (state.CartList[i].prices[j].quantity > 1) {
                        state.CartList[i].prices[j].quantity--;
                      } else {
                        state.CartList[i].prices.splice(j, 1);
                      }
                    } else {
                      if (state.CartList[i].prices[j].quantity > 1) {
                        state.CartList[i].prices[j].quantity--;
                      } else {
                        state.CartList.splice(i, 1);
                      }
                    }
                    break;
                  }
                }
              }
            }
          }),
        ),
      addToOrderHistoryListFromCart: () =>
        set(
          produce(state => {
            let temp = state.CartList.reduce(
              (accumulator: number, currentValue: any) =>
                accumulator + parseFloat(currentValue.ItemPrice),
              0,
            );
            if (state.OrderHistoryList.length > 0) {
              state.OrderHistoryList.unshift({
                OrderDate:
                  new Date().toDateString() +
                  ' ' +
                  new Date().toLocaleTimeString(),
                CartList: state.CartList,
                CartListPrice: temp.toFixed(2).toString(),
              });
            } else {
              state.OrderHistoryList.push({
                OrderDate:
                  new Date().toDateString() +
                  ' ' +
                  new Date().toLocaleTimeString(),
                CartList: state.CartList,
                CartListPrice: temp.toFixed(2).toString(),
              });
            }
            state.CartList = [];
          }),
        ),
      addToStore: () => (loading: boolean, data: any) => {
        set(
          produce(state => {
            state.Store = {
              loading: loading,
              data: data
            }
          })
        )
      },
      addCategory: (data: any) => set({ Category: data }),
      addProductCurrent: (data: any) => set({ ProductCurrent: data }),
      onIsShowProduct: (data: any) => set({ IsShowProduct: data }),
      onAddStoreCart: (data: any) => set({ StoreCart: data }),
      onAddCalculateCart: (data: any) => set({ CalculateCart: data }),
      onDetailStore: (data: any) => set({ DetailStore: data }),
      onAddTargetDevice: (data: any) => set({ TargetDevice: data }),
      onAddStoreViewCart: (data: any) => set({ StoreViewCart: data }), // add order for tab history
      onAddStoreRealTime: (data: any) => set({ StoreRealTime: data }), // add current order from pusher
      onAddOrderOnline: (data: any) => set({ OrderOnline: data }), // add order tab online
      onAddOnlineCart: (data: any) => set({ OrderOnlineCart: data }), // add order for tab online
      onAddAutoAccept: (data: any) => set({ AutoAccept: data }), // add order for tab online
      onAddDataId: (data: any) => set({ DataId: data }), // add catalog for status
      onAddDataStatus: (data: any) => set({ DataStatus: data }), // add catalog for status
      onAddFoodDataSuggest: (data: any) => set({ FoodDataSuggest: data }), // add food suggest status
      onAddToast: (data: any) => set({ Toast: data }), // add custom toast msg status
      onAddDataComplete: (data: any) => set({ DataComplete: data }), // add data complete status
      onAddDataPress: (data: any) => set({ DataPress: data }), // add data press status
      onAddWebView: (data: any) => set({ WebView: data }),
      onAddSecret: (data: any) => set({ Secret: data }),
      onProducts: (data: any) => set({ Products: data }),
      onReceipt: (data: any) => set({ Receipt: data }),
    }),
    {
      name: 'coffee-app',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
