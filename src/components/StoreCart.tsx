import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment, useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import CustomIcon from './CustomIcon';
import {useStore} from '../store/store';
import LottieView from 'lottie-react-native';
import {TAB} from '../screens/HomeStoreScreen';
import {HttpClient} from '../service/http-client';
import {CacheUtil} from '../utils';

interface StoreCartProps {
  handleToggle?: any;
  onPressShowConected?: any;
  tab?: any;
  onHandlePrint?: any;
  currentTab?: any;
}

const StoreCart: React.FC<StoreCartProps> = ({
  handleToggle,
  onPressShowConected,
  tab = false,
  onHandlePrint,
  currentTab,
}) => {
  const StoreCart = useStore((state: any) => state.StoreCart);
  const onIsShowProduct = useStore((state: any) => state.onIsShowProduct);
  const addProductCurrent = useStore((state: any) => state.addProductCurrent);
  const onAddStoreCart = useStore((state: any) => state.onAddStoreCart);
  const onAddCaculateCart = useStore((state: any) => state.onAddCaculateCart);
  const StoreViewCart = useStore((state: any) => state.StoreViewCart);
  const OrderOnlineCart = useStore((state: any) => state.OrderOnlineCart);
  const onAddOrderOnline = useStore((state: any) => state.onAddOrderOnline); // add data process when accepted
  const OrderOnline = useStore((state: any) => state.OrderOnline); // data process when accepted order
  const onAddOrderOnlineCart = useStore(
    (state: any) => state.onAddOrderOnlineCart,
  );

  const handlePressProduct = (product: any, index: any) => {
    addProductCurrent({...product, index: index});
    onIsShowProduct(true);
  };

  const handleRemoveItem = (index: any) => {
    const updateData = StoreCart?.filter(
      (_: any, idx: number) => idx !== index,
    );
    onAddStoreCart(updateData);
  };

  const handleAddQuanity = (index: any) => {
    const updatedData = [...StoreCart];
    updatedData[index].quantity += 1;
    onAddStoreCart(updatedData);
  };

  const handleMinusQuanity = (index: any) => {
    const updatedData = [...StoreCart];
    updatedData[index].quantity -= 1;
    onAddStoreCart(updatedData);
  };

  // Variants
  const handleVariantAddQuanity = (
    index: any,
    variantIdx: any,
    optionIdx: any,
  ) => {
    const updatedData = [...StoreCart];
    updatedData[index].variants[variantIdx].options[optionIdx].quantity += 1;
    onAddStoreCart(updatedData);
  };

  const handleVariantMinusQuanity = (
    index: any,
    variantIdx: any,
    optionIdx: any,
  ) => {
    const updatedData = [...StoreCart];
    updatedData[index].variants[variantIdx].options[optionIdx].quantity -= 1;
    onAddStoreCart(updatedData);
  };

  const totalPrice = () => {
    const price = StoreCart.reduce((accumulator: any, item: any) => {
      // Tính tổng tiền cho cấp độ options trong từng variant
      const variantTotal = item.variants.reduce(
        (variantAcc: any, variant: any) => {
          return (
            variantAcc +
            variant.options.reduce((optionAcc: any, option: any) => {
              return optionAcc + option.price * option.quantity;
            }, 0)
          );
        },
        0,
      );

      // Tổng tiền của mỗi phần tử là price * quantity + variantTotal
      return (
        accumulator + (item.price * item.quantity) / 100 + variantTotal / 100
      );
    }, 0);

    return price.toFixed(2);
  };

  const onSubmit = () => {
    const total = totalPrice();
    if (StoreCart?.length === 0) {
      if (Platform.OS) {
        Alert.alert(`Please add to cart`);
      } else {
        ToastAndroid.showWithGravity(
          `Please add to cart`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }

      return;
    }

    onAddCaculateCart({total, data: StoreCart});
    handleToggle();
  };

  const dataCart =
    currentTab === TAB.TAB_FOOD
      ? OrderOnlineCart?.length
        ? OrderOnlineCart[0]
        : []
      : tab
      ? StoreViewCart[0]
      : StoreCart;

  const total = () => {
    if (currentTab === TAB.TAB_FOOD)
      return ((OrderOnlineCart[0]?.total || 0) / 100).toFixed(2);
    if (tab) return ((dataCart?.total || 0) / 100).toFixed(2);
    else return totalPrice();
  };

  const handleButtonName = () => {
    if (currentTab === TAB.TAB_FOOD)
      return `${
        dataCart?.status === 'completed'
          ? 'Completed'
          : 'Readly to ' + (dataCart?.type || '')
      }`;
    if (tab) return 'Print Now';
    else return 'Pay Now';
  };

  const handleSubmit = () => {
    if (currentTab === TAB.TAB_FOOD) return handlePickUp();
    if (tab) return onHandlePrint(dataCart);
    else return onSubmit();
  };

  const handlePickUp = async () => {
    if (!dataCart?.resourceId)
      return handleAlert({message: 'Please view order before print'});

    const token = await CacheUtil.Token;

    const endpoint =
      dataCart?.status === 'completed'
        ? `/v1/e-commerce/orders/${dataCart?.resourceId}/complete`
        : `/v1/e-commerce/orders/${dataCart?.resourceId}/confirm`;

    const resAccept: any = await HttpClient.put(
      endpoint,
      {},
      {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      },
    );

    // if (!resAccept) return;

    onAddOrderOnline(
      OrderOnline?.map((item: any) => ({
        ...item,
        status:
          dataCart?.resourceId === item?.resourceId
            ? 'completed'
            : item?.status,
      })),
    );

    if (dataCart?.status === 'completed') {
      const updateDate = [...OrderOnlineCart];
      updateDate[0].completed = true;
      onAddOrderOnlineCart(updateDate);

      onAddOrderOnline(
        OrderOnline?.map((item: any) => ({
          ...item,
          completed:
            dataCart?.resourceId === item?.resourceId ? true : item?.completed,
        })),
      );
    }

    if (Platform.OS) {
      Alert.alert(`${resAccept.message}`);
    } else {
      ToastAndroid.showWithGravity(
        `${resAccept.message}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  const handleAlert = (resAccept: any) => {
    if (Platform.OS) {
      Alert.alert(`${resAccept.message}`);
    } else {
      ToastAndroid.showWithGravity(
        `${resAccept.message}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  return (
    <View style={styles.Root}>
      <View style={styles.Header}>
        <View style={styles.Printer}>
          <Text style={styles.TextTitle}>Current Printer:</Text>

          <TouchableOpacity onPress={onPressShowConected}>
            <Text style={styles.TextTotalPriceCartFood}>Connected</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.TextTotalPriceCartFood}>
          items {`(${dataCart?.products?.length || dataCart?.length || 0})`}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: SPACING.space_10,
          width: '100%',
          paddingTop: SPACING.space_10,
        }}>
        <View style={styles.PickupStatusContainer}>
          <Text style={styles.TextPickUpStatus}>{'Take Away'}</Text>
        </View>
      </View>

      {dataCart?.products?.length || dataCart?.length ? (
        <ScrollView style={styles.CartContainer}>
          <View style={{marginBottom: SPACING.space_20 * 10}}>
            {(tab ? dataCart.products : dataCart)?.map(
              (item: any, index: any) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#ddd',
                    borderRadius: SPACING.space_15,
                    padding: SPACING.space_10,
                    width: '100%',
                    marginBottom: SPACING.space_10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: SPACING.space_10,
                    }}>
                    <Text style={styles.TextNameProduct} numberOfLines={1}>
                      {tab ? item.id : item.name}
                    </Text>
                    <View
                      style={{
                        width: '50%',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: SPACING.space_10,
                      }}>
                      {tab ? (
                        <Fragment>
                          <Text style={styles.TextPrice}>
                            {item.paymentType}
                          </Text>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <TouchableOpacity
                            style={styles.ContainerEditAction}
                            onPress={() => handlePressProduct(item, index)}>
                            <CustomIcon
                              name="add"
                              color={COLORS.primaryWhiteHex}
                              size={FONTSIZE.size_10}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.ContainerRemoveAction}
                            onPress={() =>
                              tab ? {} : handleRemoveItem(index)
                            }>
                            <CustomIcon
                              name="close"
                              color={COLORS.primaryWhiteHex}
                              size={FONTSIZE.size_10}
                            />
                          </TouchableOpacity>
                        </Fragment>
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: 'flex-end',
                      width: '80%',
                      flexDirection: 'row',
                      gap: SPACING.space_10,
                      marginBottom: SPACING.space_10,
                    }}></View>

                  <View style={styles.DescriptionContainer}>
                    <Text style={styles.TextDescription}>
                      {item.description || item?.note || 'Do descrption'}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingTop: SPACING.space_20,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          justifyContent: 'space-between',
                          marginLeft: SPACING.space_10,
                        }}>
                        <View>
                          <Text style={styles.TextCommon}>Price</Text>
                          <Text style={styles.TextPrice}>
                            $ {(item.price / 100).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.ContainerInputSpiner}>
                      {!tab && (
                        <TouchableOpacity
                          disabled={item.quantity === 1}
                          style={styles.InputSpinerAction}
                          onPress={() => handleMinusQuanity(index)}>
                          <CustomIcon
                            name="minus"
                            color={COLORS.primaryLightGreyHex}
                            size={FONTSIZE.size_10}
                          />
                        </TouchableOpacity>
                      )}

                      <View style={styles.CartItemQuantityContainer}>
                        <Text style={styles.CartItemQuantityText}>
                          {item.quantity}
                        </Text>
                      </View>

                      {!tab && (
                        <TouchableOpacity
                          style={styles.InputSpinerAction}
                          onPress={() => handleAddQuanity(index)}>
                          <CustomIcon
                            name="add"
                            color={COLORS.primaryLightGreyHex}
                            size={FONTSIZE.size_10}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {item?.variants?.length ? (
                    <Text style={styles.TextVariant}>Variant</Text>
                  ) : (
                    <></>
                  )}

                  {item?.variants?.length ? (
                    item?.variants?.map((variant: any, variantIdx: any) => (
                      <Fragment key={variant?.id}>
                        <View style={styles.ContainerVariant}>
                          <View style={styles.TextSpaceVariant} />
                        </View>

                        {variant?.options?.length ? (
                          variant?.options?.map(
                            (option: any, optionIdx: any) => (
                              <View
                                key={option?.id}
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                  <View
                                    style={{
                                      justifyContent: 'space-between',
                                      marginLeft: SPACING.space_10,
                                    }}>
                                    <View>
                                      <Text style={styles.TextCommon}>
                                        {option?.value}
                                      </Text>
                                      <Text style={styles.TextPrice}>
                                        $ {(option.price / 100).toFixed(2)}
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                <View style={styles.ContainerInputSpiner}>
                                  {!tab && (
                                    <TouchableOpacity
                                      disabled={option.quantity === 0}
                                      style={styles.InputSpinerAction}
                                      onPress={() =>
                                        handleVariantMinusQuanity(
                                          index,
                                          variantIdx,
                                          optionIdx,
                                        )
                                      }>
                                      <CustomIcon
                                        name="minus"
                                        color={COLORS.primaryLightGreyHex}
                                        size={FONTSIZE.size_10}
                                      />
                                    </TouchableOpacity>
                                  )}

                                  <View
                                    style={styles.CartItemQuantityContainer}>
                                    <Text style={styles.CartItemQuantityText}>
                                      {option.quantity}
                                    </Text>
                                  </View>

                                  {!tab && (
                                    <TouchableOpacity
                                      style={styles.InputSpinerAction}
                                      onPress={() =>
                                        handleVariantAddQuanity(
                                          index,
                                          variantIdx,
                                          optionIdx,
                                        )
                                      }>
                                      <CustomIcon
                                        name="add"
                                        color={COLORS.primaryLightGreyHex}
                                        size={FONTSIZE.size_10}
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                            ),
                          )
                        ) : (
                          <></>
                        )}
                      </Fragment>
                    ))
                  ) : (
                    <></>
                  )}
                </View>
              ),
            )}
          </View>
        </ScrollView>
      ) : (
        <TouchableOpacity style={styles.ContainerAnimationPrettie}>
          <LottieView
            style={styles.AnimationPrettie}
            source={require('../lottie/empty.json')}
            autoPlay
            loop
          />
        </TouchableOpacity>
      )}

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
        }}>
        <View
          style={{
            backgroundColor: COLORS.primaryWhiteHex,
          }}>
          <View style={styles.CartDisplayData}>
            <View style={styles.CartContentCount}>
              <Text style={styles.TextCountCartFood} numberOfLines={1}>
                Tax
              </Text>
            </View>

            <Text style={styles.TextTotalPriceCartFood}>0 $</Text>
          </View>
          <View style={styles.CartDisplay}>
            <View style={styles.CartContentCount}>
              <Text style={styles.TextCountCartFood} numberOfLines={1}>
                Price
              </Text>
            </View>

            <Text style={styles.TextTotalPriceCartFood}>{total()} $</Text>
          </View>

          {!dataCart?.completed && (
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.CartPaymentDisplay}>
              <Text style={styles.TextTotalPaymentCartFood}>
                {handleButtonName()}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Root: {
    flex: 1,
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  ContainerVariant: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: SPACING.space_8,
    paddingVertical: SPACING.space_10,
  },
  TextVariant: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
    paddingTop: SPACING.space_10,
    textAlign: 'right',
  },
  TextSpaceVariant: {
    height: SPACING.space_2 / 2,
    width: '100%',
    backgroundColor: COLORS.primaryWhiteHex,
  },
  TextNameProduct: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
    fontWeight: '500',
    width: '50%',
  },
  DescriptionContainer: {
    padding: SPACING.space_10,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
  },
  PickupStatusContainer: {
    padding: SPACING.space_10,
    backgroundColor: COLORS.primaryOrangeHex,
    borderRadius: SPACING.space_15,
    flex: 1,
    alignItems: 'center',
  },
  PickUpContainer: {
    padding: SPACING.space_10,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
  },
  TextDescription: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextPickUpStatus: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_20,
  },
  TextTitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  AnimationPrettie: {
    height: 300,
    width: 'auto',
    borderRadius: BORDERRADIUS.radius_20,
  },
  ContainerAnimationPrettie: {
    justifyContent: 'center',
    paddingTop: SPACING.space_30 * 6,
  },
  CartContainer: {
    paddingVertical: SPACING.space_20,
  },
  CartDisplay: {
    justifyContent: 'space-between',
    borderRadius: widthResponsive(15),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.space_4,
  },
  CartDisplayData: {
    justifyContent: 'space-between',
    borderRadius: widthResponsive(15),
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.space_8,
  },
  CartContentCount: {
    gap: widthResponsive(2),
    width: '20%',
  },
  CartPaymentDisplay: {
    backgroundColor: '#008810',
    borderRadius: widthResponsive(4),
    padding: widthResponsive(4),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  TextTotalPaymentCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
    fontWeight: '600',
    textAlign: 'center',
  },
  TextCountCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryBlackHex,
    fontWeight: '600',
  },
  TextTotalPriceCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryGreenRGB,
    fontWeight: '600',
    textAlign: 'right',
    marginRight: widthResponsive(4),
  },
  Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TextPrice: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_20,
    fontWeight: '600',
  },
  ContainerInputSpiner: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  InputSpinerAction: {
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_10,
  },
  ContainerEditAction: {
    backgroundColor: COLORS.primaryBlueHex,
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_10,
  },
  ContainerRemoveAction: {
    backgroundColor: COLORS.primaryRedHex,
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_10,
  },
  CartItemQuantityContainer: {
    backgroundColor: COLORS.primaryWhiteHex,
    width: 40,
    borderRadius: BORDERRADIUS.radius_10,
    alignItems: 'center',
    paddingVertical: SPACING.space_8,
    marginHorizontal: SPACING.space_8,
  },
  CartItemQuantityText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryLightGreyHex,
  },
  ItemImage: {
    height: widthResponsive(26),
    width: widthResponsive(26),
    borderRadius: BORDERRADIUS.radius_15,
  },
  Printer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
});

export default StoreCart;
