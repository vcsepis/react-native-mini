import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import moment from 'moment';
import {useStore} from '../store/store';
import {CacheUtil} from '../utils';
import {HttpClient} from '../service/http-client';
import CustomIcon from './CustomIcon';

interface PopUpCommingProps {
  onToggle?: any;
  onSubmit?: any;
}

const CommingPopup: React.FC<PopUpCommingProps> = ({onToggle, onSubmit}) => {
  const newDate = new Date();
  const [detailOrder, setDetailOrder] = useState<any>({});
  const onAddStoreRealTime = useStore((state: any) => state.onAddStoreRealTime);
  const StoreRealTime = useStore((state: any) => state.StoreRealTime); // current noti

  const onAddOrderOnline = useStore((state: any) => state.onAddOrderOnline); // add data process when accepted
  const OrderOnline = useStore((state: any) => state.OrderOnline); // data from noti process

  const data = JSON.parse(StoreRealTime?.data);

  const handleAccept = () => {
    handleGetDetailProduct(data.resourceId);
  };

  const handleReject = () => onAddStoreRealTime({isShow: false, data: {}});

  const handleGetDetailProduct = async (id: any, detailOrder?: any) => {
    const token = await CacheUtil.Token;

    const res = await HttpClient.get(
      `/v1/e-commerce/orders/${id}`,
      null,
      token,
    );

    const resAccept = await HttpClient.put(
      `/v1/e-commerce/orders/${id}/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      },
    );

    if (!res) {
      handleAlertMessage(res);
      return;
    }

    if (!resAccept) {
      handleAlertMessage(resAccept);
      return;
    }

    if (detailOrder) return setDetailOrder(res?.result?.order);

    onAddOrderOnline([
      {
        ...data,
        time: moment(newDate).format('HH:mm:ss A'),
        detailOrder: res?.result?.order,
      },
      ...OrderOnline,
    ]);
    onAddStoreRealTime({isShow: false, data: {}});
    setDetailOrder({});
    handleAlertMessage({message: `Accepted success`});
  };

  const handleAlertMessage = (res: any) => {
    if (Platform.OS) {
      Alert.alert(`${res.message}`);
    } else {
      ToastAndroid.showWithGravity(
        `${res.message}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  useEffect(() => {
    if (data?.resourceId) {
      handleGetDetailProduct(data?.resourceId, true);
    }
  }, [data?.resourceId]);

  return (
    <View style={styles.CenteredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.CenteredView}>
          <View style={styles.ModalView}>
            <View style={styles.OrderInfor}>
              <Text style={styles.TextOrderId}>
                Order Id: {data?.storeId?.slice(-5)}
              </Text>
              <View style={styles.TimeOrder}>
                <Text style={styles.TextOrderId}>
                  {moment(newDate).format('HH:mm:ss A')}
                </Text>
                <TouchableOpacity
                  style={{
                    ...styles.ButtonAccept,
                    backgroundColor: COLORS.primaryGreenRGB,
                  }}>
                  <Text
                    style={{
                      ...styles.TextCommon,
                      color: COLORS.primaryWhiteHex,
                    }}>
                    {data?.type}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView>
              <View
                style={{
                  marginBottom: SPACING.space_20 * 10,
                  marginTop: SPACING.space_20,
                }}>
                {detailOrder?.products?.length &&
                  detailOrder?.products?.map((item: any, index: any) => (
                    <View
                      style={{
                        backgroundColor: '#ddd',
                        borderRadius: SPACING.space_15,
                        padding: SPACING.space_20,
                        width: '100%',
                        marginBottom: SPACING.space_10,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: SPACING.space_10,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View style={styles.ContainView}>
                          <Text style={styles.TextQuantity} numberOfLines={1}>
                            {item?.quantity}x
                          </Text>
                          <Text
                            style={styles.TextNameProduct}
                            numberOfLines={1}>
                            {item?.name}
                          </Text>
                        </View>
                        <Text style={styles.TextQuantity}>
                          $ {(item.price / 100).toFixed(2)}
                        </Text>
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
                              variant?.options?.map((option: any) => (
                                <View
                                  key={option?.id}
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
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

                                  <View
                                    style={styles.CartItemQuantityContainer}>
                                    <Text style={styles.CartItemQuantityText}>
                                      {option.quantity}
                                    </Text>
                                  </View>
                                </View>
                              ))
                            ) : (
                              <></>
                            )}
                          </Fragment>
                        ))
                      ) : (
                        <></>
                      )}
                    </View>
                  ))}
              </View>
            </ScrollView>

            <View style={styles.Footer}></View>

            <View style={styles.FooterAction}>
              <View style={styles.CartDisplay}>
                <View style={styles.CartContentCount}>
                  <Text style={styles.TextCountCartFood} numberOfLines={1}>
                    Tax
                  </Text>
                </View>

                <Text style={styles.TextTotalPriceCartFood}>
                  $ {(detailOrder?.vat / 100).toFixed(2)}
                </Text>
              </View>

              <View
                style={{
                  ...styles.CartDisplay,
                  paddingVertical: SPACING.space_4,
                }}>
                <View style={styles.CartContentCount}>
                  <Text style={styles.TextCountCartFood} numberOfLines={1}>
                    Total
                  </Text>
                </View>

                <Text style={styles.TextTotalPriceCartFood}>
                  $ {(detailOrder?.total / 100).toFixed(2)} {' ' + ' '}
                  <CustomIcon
                    name={'cart'}
                    color={'#008810'}
                    size={FONTSIZE.size_24}
                  />
                </Text>
              </View>
              <View style={styles.ContainView}>
                <TouchableOpacity
                  style={styles.ButtonReject}
                  onPress={handleReject}>
                  <Text style={styles.TextCommon}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ButtonAccept}>
                  <Text
                    style={{
                      ...styles.TextCommon,
                      color: COLORS.primaryWhiteHex,
                    }}
                    onPress={handleAccept}>
                    Accept
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  CenteredView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  ModalView: {
    width: '80%',
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    padding: SPACING.space_30,
    height: '95%',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
  },
  TextOrderId: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
  },
  TextTitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
    fontWeight: '600',
  },
  TextNumber: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_20,
  },
  OrderInfor: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  TimeOrder: {
    gap: SPACING.space_10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ButtonAccept: {
    padding: SPACING.space_15,
    borderRadius: SPACING.space_15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryGreenRGB,
  },
  ButtonReject: {
    padding: SPACING.space_15,
    borderRadius: SPACING.space_15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  FooterAction: {
    marginTop: SPACING.space_20,
    gap: SPACING.space_10,
  },
  Footer: {
    height: SPACING.space_2,
    width: '100%',
    backgroundColor: '#ddd',
    marginTop: SPACING.space_20,
  },
  TextNameProduct: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
  },
  TextQuantity: {
    fontFamily: FONTFAMILY.poppins_bold,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_28,
  },
  DescriptionContainer: {
    padding: SPACING.space_10,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
  },
  TextPrice: {
    fontFamily: FONTFAMILY.poppins_bold,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_24,
  },
  TextDescription: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  ContainerInputSpiner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  CartItemQuantityContainer: {
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: BORDERRADIUS.radius_10,
    alignItems: 'center',
    justifyContent: 'center',
    height: widthResponsive(14),
    paddingHorizontal: SPACING.space_20,
  },
  CartItemQuantityText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_24,
    color: COLORS.primaryLightGreyHex,
  },
  TextVariant: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
    paddingTop: SPACING.space_18,
    textAlign: 'right',
  },
  ContainerVariant: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: SPACING.space_8,
    paddingVertical: SPACING.space_10,
  },
  TextSpaceVariant: {
    height: SPACING.space_2 / 2,
    width: '100%',
    backgroundColor: COLORS.primaryWhiteHex,
  },
  ContainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.space_10,
  },
  CartDisplay: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  CartContentCount: {
    gap: widthResponsive(2),
    width: '20%',
  },
  TextCountCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.primaryBlackHex,
    fontWeight: '600',
  },
  TextTotalPriceCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_24,
    color: COLORS.primaryGreenRGB,
    textAlign: 'right',
    gap: SPACING.space_10,
  },
});

export default CommingPopup;
