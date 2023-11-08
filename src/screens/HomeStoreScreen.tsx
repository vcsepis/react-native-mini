import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import {HttpClient} from '../service/http-client';
import {CacheUtil} from '../utils';
import FoodComponent from '../components/Food';
import {useStore} from '../store/store';
import PopUpProduct from '../components/PopupProduct';
import PopUpCaculateCart from '../components/CaculateCart';
import OrderConfirm from '../components/OrderConfirm';
import StoreCart from '../components/StoreCart';
import ConnectedPopup from '../components/Connected';
import EscPosPrinter from 'react-native-esc-pos-printer';
import moment from 'moment';
import HistoryScreen from './HistoryScreen';
import OnlineStoreScreen from './OnlineStore';
import {Pusher, PusherEvent} from '@pusher/pusher-websocket-react-native';
import {getPusherInstance, handleConnectPusher, handleDisconnectPusher} from '../utils/pusher';

enum TAB {
  TAB_HOME,
  TAB_MENU,
  TAB_FOOD,
  TAB_CART,
  TAB_SETTING,
}

const currentTime = new Date();

const RENDER_VIEW = (tab: any, stateProduct?: any, handleGetStore?: any) => {
  switch (tab) {
    case TAB.TAB_HOME:
      return <FoodComponent handleGetStore={handleGetStore} />;
    case TAB.TAB_MENU:
      return <HistoryScreen />;
    case TAB.TAB_FOOD:
      return <OnlineStoreScreen />;
    case TAB.TAB_CART:
      return <Text style={styles.TextCommon}>TODO CART</Text>;
    case TAB.TAB_SETTING:
      return <Text style={styles.TextCommon}>TODO CART</Text>;
    default:
      return <Text style={styles.TextCommon}>Home</Text>;
  }
};

const INIT_STATE_PRODUCT = {
  product: [],
  categories: [],
};

const HomeStoreScreen = ({navigation}: any) => {
  const [tab, setTab] = useState(TAB.TAB_HOME);
  const [stateProduct, setStateProduct] = useState(INIT_STATE_PRODUCT);
  const [isShow, setIsShow] = useState(false);
  const [isShowOrderConfirm, setIsShowOrderConfirm] = useState(false);
  const [statusConnected, setStatusConnected] = useState(false);

  const AddCategory = useStore((state: any) => state.addCategory);
  const onDetailStore = useStore((state: any) => state.onDetailStore);
  const IsShowProduct = useStore((state: any) => state.IsShowProduct);
  const onAddCaculateCart = useStore((state: any) => state.onAddCaculateCart);
  const CaculateCart = useStore((state: any) => state.CaculateCart);
  const StoreCartData = useStore((state: any) => state.StoreCart);
  const onAddStoreCart = useStore((state: any) => state.onAddStoreCart);
  const TargetDevice = useStore((state: any) => state.TargetDevice);

  const handleToggle = () => setIsShow(!isShow);
  const handleToggleConfirm = () => setIsShowOrderConfirm(!isShowOrderConfirm);
  const handleChangeTab = (tabSelected: any) => setTab(tabSelected);

  const [pusher, setPusher] = useState<Pusher>();

  const connectPusher = async () => {
    await handleConnectPusher();
    const instance = getPusherInstance()
    setPusher(instance);
  };

  const handleEvents = async () => {
    if (!pusher) {
      return;
    }

    console.log('connected');

    await pusher.subscribe({
      channelName: 'my-channel', //change channel
      onEvent: (event: PusherEvent) => {
        console.log(`onEvent: ${event}`);
      },
    });
  };

  useEffect(() => {
    connectPusher();

    () => {
      return handleDisconnectPusher();
    };
  }, []);

  useEffect(() => {
    handleEvents();
  }, [pusher]);

  const onPressShowConected = () => setStatusConnected(!statusConnected);

  useEffect(() => {
    handleGetStore();
  }, []);

  const handleGetStore = async () => {
    const token = await CacheUtil.Token;
    const resCategories = await HttpClient.get(
      `/v1/e-commerce/categories?category=&page=&limit=&keyword=`,
      null,
      token,
    );

    const resDetailStore = await HttpClient.get(
      `/v1/e-commerce/stores/detail`,
      null,
      token,
    );

    if (!resCategories) return setStateProduct(INIT_STATE_PRODUCT);
    if (!resDetailStore) {
      onDetailStore({});
    }

    AddCategory(resCategories?.result?.categories);
    onDetailStore(resDetailStore?.result?.store);

    return setStateProduct({
      ...stateProduct,
      categories: resCategories?.result?.categories,
    });
  };

  const handleSubmitCaculator = (change: any, paymentCd: any) => {
    onAddCaculateCart({...CaculateCart, ...change, paymentMethod: paymentCd});
    setIsShow(!isShow);
    setTimeout(() => {
      setIsShowOrderConfirm(true);
    }, 500);
  };

  const handleSubmitOrder = async (note?: any) => {
    const token = await CacheUtil.Token;

    const StoreCartUpdate = StoreCartData?.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      options: item?.variants?.length
        ? item?.variants[0]?.options?.map((option: any) => ({
            id: option.id,
            quantity: option.quantity,
          }))
        : [],
    }));

    const bodyRequest = {
      products: StoreCartUpdate,
      type: 'TAKE_AWAY',
      paymentType: CaculateCart.paymentMethod,
      vat: 0,
      note: note,
    };

    const res: any = await HttpClient.post(
      `/v1/e-commerce/orders`,
      bodyRequest,
      {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      },
    );

    if (res?.errorCode !== '000') {
      if (Platform.OS) {
        Alert.alert(`${res.message}`);
      } else {
        ToastAndroid.showWithGravity(
          `${res.message}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } else {
      if (Platform.OS) {
        Alert.alert(`Order Success: ${res.result.order.code}`);
        onHandlePrint(res.result.order);
      } else {
        ToastAndroid.showWithGravity(
          `Order Success: ${res.result.order.code}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        onHandlePrint(res.result.order);
      }
    }

    onAddStoreCart([]);
    setIsShowOrderConfirm(false);
  };

  // Print
  const onHandlePrint = async (data: any) => {
    if (TargetDevice?.name?.length > 0) {
      try {
        const printing = new EscPosPrinter.printing();

        await printing
          .initialize()
          .align('center')
          .size(3, 3)
          .line(data?.storeSlug)
          .smooth(true)
          .size(1, 1)
          .text('Adress:')
          .bold()
          .underline()
          .text(data?.address)
          .newline()

          .size(1, 1)
          .text('Time:')
          .bold()
          .underline()
          .text(moment(currentTime).format('dddd, MM, YYYY hh:mm:ss A'))
          .newline()

          .align('center')
          .size(3, 3)
          .line(data?.type)
          .smooth(true)
          .newline()

          .size(1, 1)
          .textLine(48, {
            left: '',
            right: '',
            gapSymbol: '_',
          })
          .newline()

          .size(1, 1)
          .textLine(28, {
            left: 'Item',
            right: 'Total',
          })
          .newline()

          .size(1, 1)
          .textLine(48, {
            left: '',
            right: '',
            gapSymbol: '_',
          })
          .newline();

        for (let item of data.products) {
          await printing
            .size(1, 1)
            .textLine(48, {
              left: `${item.quantity + ' ' + item.name}`, // Tên sản phẩm.
              right: '$' + item.price, // Giá sản phẩm.
              gapSymbol: '.',
            })
            .newline()

            .size(1, 1)
            .textLine(48, {
              left: `${item.note}`, // Tên sản phẩm.
              right: '',
            })
            .newline();

          if (item.variants?.length != 0) {
            for (let i = 0; i < item.variants![0].options!.length; i++) {
              await printing
                .size(1, 1)
                .textLine(48, {
                  left: `${item.quantity + ' ' + item.name}`, // Tên sản phẩm.
                  right: '$' + item.price, // Giá sản phẩm.
                  gapSymbol: '.',
                })
                .newline()

                .size(1, 1)
                .textLine(48, {
                  left: `${item.note}`, // Tên sản phẩm.
                  right: '',
                })
                .newline();
            }
          }
        }

        await printing
          .size(2, 2)
          .textLine(48, {left: 'Total', right: `LRK ${data?.total}`})
          .newline()

          .size(1, 1)
          .textLine(28, {
            left: 'CARD',
            right: data?.total,
          })
          .newline()

          .align('left')
          .size(1, 1)
          .line(
            `Total Items: ${data?.products?.length}, Total Unit: ${data?.products?.length}`,
          )
          .newline()

          .size(1, 1)
          .textLine(48, {
            left: '',
            right: '',
            gapSymbol: '_',
          })
          .newline()

          .align('center')
          .size(3, 3)
          .line('Thank You')
          .smooth(true)
          .newline()

          .size(1, 1)
          .textLine(48, {
            left: '',
            right: '',
            gapSymbol: '_',
          })
          .newline()

          .align('center')
          .size(1, 1)
          .line('Thank You')
          .smooth(true)
          .newline()

          .size(1, 1)
          .textLine(48, {
            left: '',
            right: '',
            gapSymbol: '_',
          })
          .newline()

          .size(1, 1)
          .text('Ref Number:')
          .bold()
          .text('1-17')
          .newline()

          .size(1, 1)
          .text('SpicePos -')
          .bold()
          .text('www.spicepos.com')
          .newline();

        // Kết thúc và cắt giấy.
        const status = await printing.cut().send();

        console.log('Success:', status);

        ToastAndroid.showWithGravity(
          `Order ${data._id}: print success`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } catch (e: any) {
        ToastAndroid.showWithGravity(
          `Order ${data._id}: ${e.message} `,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } else {
      if (Platform.OS) {
        Alert.alert(`Please selected device to Print`);
      } else {
        ToastAndroid.showWithGravity(
          `Please selected device to Print`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    }
  };

  return (
    <LinearGradient
      colors={['#F0EDFC', '#DFDCEB', '#DAD7E6']}
      style={styles.linearGradient}>
      <SafeAreaView style={styles.ScreenContainer}>
        <StatusBar backgroundColor={COLORS.primaryBlackHex} />
        <View style={styles.ScrollViewFlex}>
          <View style={styles.ViewHeader}>
            {/* Header */}
            <View style={styles.HeaderContainer}>
              <Image
                source={{
                  uri: 'https://cdn.discordapp.com/attachments/1060582873771552778/1149413998366838885/E.png?fbclid=IwAR3Tjf1l1OxeL3VjNtnGDxCldL1hd2lmQOZwggeo4MnbSmzWowRhl8iAHgE',
                }}
                style={styles.Image}
              />

              <View style={styles.HeaderMenu}>
                <TouchableOpacity onPress={() => handleChangeTab(TAB.TAB_HOME)}>
                  <CustomIcon
                    name={'home'}
                    color={
                      tab === TAB.TAB_HOME
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                    size={FONTSIZE.size_30 * 1.2}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleChangeTab(TAB.TAB_MENU)}>
                  <CustomIcon
                    name={'menu'}
                    color={
                      tab === TAB.TAB_MENU
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                    size={FONTSIZE.size_30 * 1.2}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleChangeTab(TAB.TAB_FOOD)}>
                  <CustomIcon
                    name={'bean'}
                    color={
                      tab === TAB.TAB_FOOD
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                    size={FONTSIZE.size_30 * 1.2}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleChangeTab(TAB.TAB_CART)}>
                  <CustomIcon
                    name={'cart'}
                    color={
                      tab === TAB.TAB_CART
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                    size={FONTSIZE.size_30 * 1.2}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleChangeTab(TAB.TAB_SETTING)}>
                  <CustomIcon
                    name={'bell'}
                    color={
                      tab === TAB.TAB_SETTING
                        ? COLORS.primaryGreenRGB
                        : COLORS.primaryLightGreyHex
                    }
                    size={FONTSIZE.size_30 * 1.2}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Contain */}
            <View style={styles.Contain}>
              {RENDER_VIEW(tab, stateProduct, handleGetStore)}
            </View>
          </View>

          {/* Cart */}
          <View style={styles.CartView}>
            <StoreCart
              tab={tab === TAB.TAB_MENU}
              handleToggle={handleToggle}
              onPressShowConected={onPressShowConected}
              onHandlePrint={onHandlePrint}
            />
          </View>

          {IsShowProduct && <PopUpProduct />}

          {isShow && (
            <PopUpCaculateCart
              onSubmit={handleSubmitCaculator}
              onToggle={handleToggle}
            />
          )}

          {isShowOrderConfirm && (
            <OrderConfirm
              onToggle={handleToggleConfirm}
              onSubmit={handleSubmitOrder}
            />
          )}

          {statusConnected && (
            <ConnectedPopup
              onToggle={onPressShowConected}
              onSubmit={onPressShowConected}
            />
          )}
        </View>
        {/* Product Popup */}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  ScrollViewFlex: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_20,
  },
  Image: {
    height: SPACING.space_36 * 4,
    width: SPACING.space_36 * 4,
  },
  ViewHeader: {width: '70%', gap: SPACING.space_20},
  HeaderContainer: {
    backgroundColor: COLORS.primaryWhiteHex,
    width: '100%',
    paddingLeft: SPACING.space_10,
    paddingRight: SPACING.space_20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: SPACING.space_15,
    borderBottomEndRadius: SPACING.space_15,
  },
  HeaderMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '65%',
  },
  Contain: {
    width: '100%',
    flex: 1,
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_16,
  },
  CartView: {
    backgroundColor: COLORS.primaryWhiteHex,
    width: '30%',
    borderTopLeftRadius: SPACING.space_15,
    borderBottomStartRadius: SPACING.space_15,
    padding: SPACING.space_20,
    flex: 1,
  },
});

export default HomeStoreScreen;
