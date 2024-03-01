import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Platform,
  Alert,
  ToastAndroid,
} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import {HttpClient} from '../service/http-client';
import {Cache} from '../utils';
import FoodComponent from '../components/Food';
import {useStore} from '../store/store';
import PopUpProduct from '../components/PopupProduct';
import PopUpCalculateCart from '../components/CalculateCart';
import OrderConfirm from '../components/OrderConfirm';
import StoreCart from '../components/StoreCart';
import ConnectedPopup from '../components/Connected';
import EscPosPrinter from 'react-native-esc-pos-printer';
import moment from 'moment';
import {Pusher, PusherEvent} from '@pusher/pusher-websocket-react-native';
import {
  PaymentIntent,
  useStripeTerminal,
} from '@stripe/stripe-terminal-react-native';

import {
  getPusherInstance,
  handleConnectPusher,
  handleDisconnectPusher,
} from '../utils/pusher';
import InComingPopup from '../components/InComingPopup';
import ToastCustom from '../components/Toast';
import PopupWebView from '../components/WebView';
import PopupQrView from '../components/QrView';
import PopupReceipt from '../components/Receipt';
import axios from 'axios';
import FoodComplete from '../components/FoodComplete';
import FoodDataPress from '../components/FoodDataPress';
import FoodDataSuggest from '../components/FoodDataSuggest';

export enum TAB {
  TAB_HOME,
  TAB_MENU,
  TAB_FOOD,
  TAB_CART,
  TAB_SETTING,
}

const currentTime = new Date();

const RENDER_VIEW = (tab: any, handleGetStore?: any, onHandlePrint?: any) => {
  switch (tab) {
    case TAB.TAB_HOME:
      return <FoodComponent handleGetStore={handleGetStore} />;
    default:
      return <Text style={styles.TextCommon}>Home</Text>;
  }
};

const INIT_STATE_PRODUCT = {
  product: [],
  categories: [],
};

const INIT_QR = {isShow: false, link: ''};

const HomeStoreScreen = ({navigation}: any) => {
  const {retrievePaymentIntent, collectPaymentMethod, processPayment} =
    useStripeTerminal({
      onDidRequestReaderInput: input => {
        console.log(input, 'input');
      },
      onDidRequestReaderDisplayMessage: message => {
        console.log(message, 'message');
      },
    });

  const [tab, setTab] = useState(TAB.TAB_HOME);
  const [stateProduct, setStateProduct] = useState(INIT_STATE_PRODUCT);
  const [showCalculate, setShowCalculate] = useState(false);
  const [isShowOrderConfirm, setIsShowOrderConfirm] = useState(false);
  const [showConnectPrinter, setShowConnectPrinter] = useState(false);
  const [isShowQR, setIsShowQR] = useState(INIT_QR);
  const [paymentIntentMethod, setPaymentIntentMethod] = useState('');

  const AddCategory = useStore((state: any) => state.addCategory);
  const onDetailStore = useStore((state: any) => state.onDetailStore);
  const DetailStore = useStore((state: any) => state.DetailStore);
  const onAddCalculateCart = useStore((state: any) => state.onAddCalculateCart);
  const CalculateCart = useStore((state: any) => state.CalculateCart);
  const StoreCartData = useStore((state: any) => state.StoreCart);
  const onAddStoreCart = useStore((state: any) => state.onAddStoreCart);
  const TargetDevice = useStore((state: any) => state.TargetDevice);
  const onAddStoreRealTime = useStore((state: any) => state.onAddStoreRealTime); // add current noti
  const StoreRealTime = useStore((state: any) => state.StoreRealTime); // current noti
  const AutoAccept = useStore((state: any) => state.AutoAccept); // get status auto accept
  const FoodSuggest = useStore((state: any) => state.FoodDataSuggest); // get status food suggest
  const ToastData = useStore((state: any) => state.Toast);
  const DataComplete = useStore((state: any) => state.DataComplete);
  const DataPress = useStore((state: any) => state.DataPress);
  const onReceipt = useStore((state: any) => state.onReceipt);
  const Receipt = useStore((state: any) => state.Receipt);
  const onProducts = useStore((state: any) => state.onProducts);
  const WebView = useStore((state: any) => state.WebView);

  const handleShowCalculate = () => setShowCalculate(!showCalculate);
  const handleToggleConfirm = () => setIsShowOrderConfirm(!isShowOrderConfirm);

  const [pusher, setPusher] = useState<Pusher>();

  const connectPusher = async () => {
    await handleConnectPusher();
    const instance = getPusherInstance();
    setPusher(instance);
  };

  const handleEvents = async (AutoAccept: any) => {
    await pusher?.subscribe({
      channelName: DetailStore?.id, //change channel
      onEvent: async (event: PusherEvent) => {
        const token = await Cache.Token;
        const data = JSON.parse(event?.data);

        const response = await HttpClient.get(
          `/v1/e-commerce/orders/${data?.code}`, // resourceId is orderId
          null,
          token,
        );
        switch (event.eventName) {
          case 'order-paid':
            // console.log(response.result.order);
            break;

          case 'online.order':
            onAddStoreRealTime({
              isShow: true,
              data: data,
            });
            break;
        }
      },
    });
  };

  useEffect(() => {
    if (DetailStore?.id) {
      // connectPusher(); // pause for mini
    }

    () => {
      return handleDisconnectPusher();
    };
  }, [DetailStore]);

  useEffect(() => {
    if (pusher?.connectionState === 'DISCONNECTED') return;

    // handleEvents(AutoAccept); // pause for mini
  }, [pusher?.connectionState, AutoAccept]);

  const onPressShowConnected = (selectedDevice: any) => {
    setShowConnectPrinter(!showConnectPrinter);
  };

  useEffect(() => {
    handleGetStore();
  }, []);

  const handleGetStore = async () => {
    const token = await Cache.Token;
    const resCategories = await HttpClient.get(
      `/v1/categories?category=&page=&limit=100&keyword=`,
      null,
      token,
    );

    const resDetailStore = await HttpClient.get(
      `/v1/stores/detail`,
      null,
      token,
    );

    const resProduct = await HttpClient.get(
      `/v1/products?page&limit=10000&keyword=`,
      null,
      token,
    );

    if (!resCategories) return setStateProduct(INIT_STATE_PRODUCT);
    if (!resDetailStore) {
      onDetailStore({});
    }

    AddCategory(resCategories?.data);
    onDetailStore(resDetailStore);
    onProducts(resProduct?.data);

    return setStateProduct({
      ...stateProduct,
      categories: resCategories?.data,
    });
  };

  const handleSubmitOrder = async (
    note?: any,
    change?: any,
    paymentCd?: any,
    form?: any,
  ) => {
    const token = await Cache.Token;

    setShowCalculate(!showCalculate);

    try {
      const StoreCartUpdate = StoreCartData?.map((item: any) => ({
        note: item?.note,
        id: item.id,
        quantity: item.quantity,
        options: item?.variants?.length
          ? item?.variants.flatMap((variant: any) =>
              variant?.options?.filter((item: any) => item.quantity > 0),
            )
          : [],
      }));

      let bodyRequest = {
        products: StoreCartUpdate,
        type: 'PICK_UP',
        paymentType: paymentCd,
        note: note,
        cash: CalculateCart?.total * 100,
        vat: 0,
        phoneNumber: form?.phone,
        customerName: form?.name,
      };
      console.log(JSON.stringify(bodyRequest), token);
      const res: any = await HttpClient.post(`/v1/orders`, bodyRequest, {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      const bodyOrder = {
        userID: res.order.storeId,
        message: res.order.code,
      };

      const resOrder: any = await axios.post(
        `https://websocket-aqi9.onrender.com/api/messages`,
        bodyOrder,
        {},
      );

      console.log(resOrder, 'resOrder');

      onReceipt({isShow: true, data: res.order});

      onAddCalculateCart({
        ...CalculateCart,
        ...change,
        paymentMethod: paymentCd,
      });

      onAddStoreCart([]);

      if (paymentCd === 'CARD') {
        setIsShowQR({isShow: true, link: res?.paymentLink});
      }

      if (paymentCd === 'POS') {
        const paymentIntentRetrieve = await retrievePaymentIntent(
          res?.order?.clientSecret,
        );

        if (paymentIntentRetrieve?.error) {
          return ToastAndroid.showWithGravity(
            `Stiple error`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }

        handlePaymentIndent(paymentIntentRetrieve);
      }
    } catch (e) {
      if (Platform.OS) {
        Alert.alert(`Order Fail`);
      } else {
        ToastAndroid.showWithGravity(
          `Order Fail`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    }

    setIsShowOrderConfirm(false);
  };

  const handlePaymentIndent = async (paymentIntentRetrieve: any) => {
    const {paymentIntent, error} = await collectPaymentMethod({
      paymentIntentId: paymentIntentRetrieve?.paymentIntent?.id as string,
      skipTipping: true,
      tipEligibleAmount: 0,
      updatePaymentIntent: true,
    });

    if (error) {
      return ToastAndroid.showWithGravity(
        `Stiple error`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }

    _confirmPaymentIntent(paymentIntent?.id);
  };

  const _confirmPaymentIntent = async (id: string) => {
    const {paymentIntent, error} = await processPayment(id);

    if (paymentIntent?.status === 'succeeded') {
      return;
    }
  };

  // Print
  const onHandlePrint = async (data: any) => {
    EscPosPrinter.connect(TargetDevice?.target);

    if (!TargetDevice?.name?.length) {
      if (Platform.OS) {
        Alert.alert(`Please selected device to Print`);
      } else {
        ToastAndroid.showWithGravity(
          `Please selected device to Print`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }

      return;
    }

    const printing = new EscPosPrinter.printing();

    try {
      await printing
        .initialize()
        .align('center')
        .size(2, 2)
        .line(`${DetailStore?.name}`)
        .smooth(true)
        .newline()
        .size(2, 2)
        .line(data?.type)
        .newline()
        .size(1, 1)
        .textLine(48, {
          left: 'Address',
          right: `${DetailStore?.address}`,
        });
      await printing
        .newline()
        .size(1, 1)
        .textLine(48, {
          left: '',
          right: '', // Giá sản phẩm.
          gapSymbol: '.',
        })
        .newline()
        .size(1, 1)
        .textLine(48, {
          left: 'Item',
          right: 'Price',
        })
        .newline();
      for (let item of data?.products) {
        await printing
          .size(1, 1)
          .textLine(48, {
            left: `${item?.quantity + 'x' + ' ' + item?.name}`,
            right: '$' + (item?.price / 100).toFixed(2), // Giá sản phẩm.
          })
          .newline()
          .size(1, 1)
          .line(`Note: ${item?.note || ''}`)
          .newline();
        if (item?.variants?.length !== 0) {
          for (let variants of item?.variants) {
            if (variants?.options !== 0) {
              for (let option of variants?.options) {
                if (option?.quantity > 0) {
                  await printing
                    .size(1, 1)
                    .textLine(48, {
                      left: '-',
                      right: 'Variant', // Giá sản phẩm.
                    })
                    .newline()
                    .size(1, 1)
                    .textLine(48, {
                      left: `${option?.quantity + ' ' + option?.value}`, // Tên sản phẩm.
                      right: '$' + option?.price / 100, // Giá sản phẩm.
                    })
                    .newline();
                }
              }
            }
          }
        }
        await printing
          .size(1, 1)
          .textLine(48, {
            left: '',
            right: '', // Giá sản phẩm.
            gapSymbol: '.',
          })
          .newline();
      }
      await printing
        .size(1, 1)
        .textLine(48, {
          left: 'Total',
          right: `$ ${(data?.total / 100).toFixed(2)}`,
        })
        .newline()
        .size(1, 1)
        .textLine(48, {left: 'Payment Type', right: `${data?.paymentType}`})
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
        .line('Scan it and order it')
        .newline()
        .align('center')
        .size(1, 1)
        .line('SKIP THE LINE')
        .newline()
        .align('center')
        .qrcode({
          value: `https://order.episcloud.com/${data?.storeSlug}`,
          level: 'EPOS2_LEVEL_M',
          width: 5,
        })
        .smooth(true)
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
        .line(
          `Date time: ${moment(data?.createdAt).format(
            'DD, MM, YYYY hh:mm:ss A',
          )}`,
        )
        .newline()
        .size(1, 1)
        .line(`Total number of items purchased: ${data?.products?.length}`)
        .newline()
        .size(1, 1)
        .line('Ref Number:')
        .bold()
        .line(data?.code || '')
        .newline()
        .size(1, 1)
        .line('EPOS Au Merchant by EPIS CLOUD')
        .bold()
        .line('www.episcloud.com')
        .newline();

      await printing.cut().send({
        target: TargetDevice.target,
      });
    } catch (error) {
      // Printing error
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
            {/* Contain */}
            <View style={styles.Contain}>
              {RENDER_VIEW(tab, handleGetStore, onHandlePrint)}
            </View>
          </View>

          {/* Cart */}
          <View style={styles.CartView}>
            <StoreCart
              tab={tab === TAB.TAB_MENU || tab === TAB.TAB_FOOD}
              currentTab={tab}
              handleToggle={handleShowCalculate}
              onPressShowConnected={onPressShowConnected}
              onHandlePrint={onHandlePrint}
            />
          </View>

          <PopUpProduct />

          <PopUpCalculateCart
            onSubmit={handleSubmitOrder}
            onToggle={handleShowCalculate}
            open={showCalculate}
          />

          {isShowOrderConfirm && (
            <OrderConfirm
              onToggle={handleToggleConfirm}
              onSubmit={handleSubmitOrder}
            />
          )}

          <ConnectedPopup
            onToggle={onPressShowConnected}
            onSubmit={onPressShowConnected}
            open={showConnectPrinter}
          />

          {StoreRealTime.isShow && (
            <InComingPopup onHandlePrint={onHandlePrint} />
          )}

          <ConnectedPopup
            onToggle={onPressShowConnected}
            onSubmit={onPressShowConnected}
            open={showConnectPrinter}
          />

          {ToastData?.isShow && <ToastCustom />}

          {WebView && <PopupWebView />}

          {Receipt.isShow && <PopupReceipt />}

          {isShowQR.isShow && (
            <PopupQrView
              link={isShowQR.link}
              handleClose={() => setIsShowQR(INIT_QR)}
            />
          )}

          {DataComplete && <FoodComplete />}

          {DataPress.isShow && <FoodDataPress />}

          {FoodSuggest && (
            <FoodDataSuggest handleToggle={handleShowCalculate} />
          )}
        </View>
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
    marginTop: SPACING.space_20,
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
  BarContain: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.space_10,
  },
});

export default HomeStoreScreen;
