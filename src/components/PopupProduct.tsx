import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import LottieView from 'lottie-react-native';
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
import IconDrop from '../assets/icon/ic_arrow_right.svg';
import Checkbox from './CheckBox';

interface PopUpProductProps {}

const PopUpProduct: React.FC<PopUpProductProps> = ({}) => {
  const [viewHeight, setViewHeight] = useState(0);
  const isShowProduct = useStore((state: any) => state.IsShowProduct);
  const onIsShowProduct = useStore((state: any) => state.onIsShowProduct);
  const ProductCurrent = useStore((state: any) => state.ProductCurrent);
  const StoreCart = useStore((state: any) => state.StoreCart);
  const onAddStoreCart = useStore((state: any) => state.onAddStoreCart);
  const onAddToast = useStore((state: any) => state.onAddToast);

  const [products, setProducts] = useState<any>({});
  const [selected, setSelected] = useState<any>([]);

  const onLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setViewHeight(height + widthResponsive(10));
  };

  useEffect(() => {
    setProducts(ProductCurrent);
  }, [ProductCurrent]);

  useEffect(() => {
    setSelected([]);

    return () => setSelected([]);
  }, [isShowProduct]);

  const handleToggleProduct = () => {
    onIsShowProduct(false);
  };

  const handleAddQuanity = () => {
    const updatedData = {...products};
    updatedData.quantity += 1;
    setProducts(updatedData);
  };
  const handleMinusQuanity = () => {
    const updatedData = {...products};
    updatedData.quantity -= 1;
    setProducts(updatedData);
  };

  const handleAddVariantQuantity = (idxVariant: any, idxOption: any) => {
    const updatedData = {...products};
    updatedData.variants[idxVariant].options[idxOption].quantity += 1;
    setProducts(updatedData);
  };

  const handleMinusVariantQuantity = (idxVariant: any, idxOption: any) => {
    const updatedData = {...products};
    updatedData.variants[idxVariant].options[idxOption].quantity -= 1;
    setProducts(updatedData);
  };

  const totalPrice = () => {
    const variant = products?.variants?.reduce((acc: any, variant: any) => {
      return (
        acc +
        variant.options.reduce((optionAcc: any, option: any) => {
          return (
            optionAcc + option.price * option.quantity * products?.quantity
          );
        }, 0)
      );
    }, 0);

    const product = (products?.quantity * products?.price) / 100;

    const total = product + variant / 100;

    return total;
  };

  const handleChangeNote = (text: any) => {
    const updatedData = {...products};
    updatedData.note = text;
    setProducts(updatedData);
  };

  const checkMinLengthValid = products?.variants?.map((item: any) => {
    let checkMinLength;

    const {id, minLength, options, name, checked} = item;

    const isValid = options.some(
      (option: any) => option.quantity === minLength,
    );

    if (minLength === 1) {
      checkMinLength = isValid ? 'Pass' : 'Fail';
    } else if (minLength > 1) {
      const isCheck = options?.filter((opt: any) => opt?.checked);
      checkMinLength = isCheck?.length === minLength ? 'Pass' : 'Fail';
    }

    return {
      id,
      isValid: checkMinLength,
      name,
      minLength,
    };
  });

  const handleChecked = (idxVariant: any, idxOption: any, checked: any) => {
    const updatedData = {...products};
    updatedData.variants[idxVariant].options[idxOption].checked = checked;

    if (updatedData.variants[idxVariant].minLength > 0) {
      if (updatedData.variants[idxVariant].options[idxOption].checked) {
        const sumChecked = updatedData.variants[idxVariant].options.filter(
          (item: any) => item.checked,
        );
        updatedData.variants[idxVariant].options = updatedData.variants[
          idxVariant
        ].options?.map((item: any, index: number) => ({
          ...item,
          quantity: item.checked ? 1 : 0,
          disabled:
            sumChecked.length === updatedData.variants[idxVariant].minLength
              ? !item.checked
              : false,
        }));
      } else {
        updatedData.variants[idxVariant].options = updatedData.variants[
          idxVariant
        ].options?.map((item: any, index: number) => ({
          ...item,
          disabled: false,
          quantity: 0,
        }));
      }
    }

    setProducts(updatedData);
  };
  console.log(JSON.stringify(products?.variants), 'products?.variants');
  const onSubmit = () => {
    const total = totalPrice();

    const checkValue = checkMinLengthValid.length
      ? checkMinLengthValid.filter((item: any) => item.isValid === 'Fail')
      : [];
    console.log(checkMinLengthValid, 'checkMinLengthValid');
    if (checkValue.length > 0) {
      return handleMsg(
        `${checkValue[0]?.name} required ${checkValue[0]?.minLength} options`,
      );
    }

    const StoreCartUpdate = [...StoreCart];
    const productUpdate = {...products, total: total};

    if (products?.index !== undefined) {
      StoreCartUpdate[productUpdate?.index] = productUpdate;
      onAddStoreCart(StoreCartUpdate);
    } else {
      onAddStoreCart([productUpdate, ...StoreCart]);
    }

    onIsShowProduct(false);

    onAddToast({
      isShow: true,
      message: `Product ${products?.name} has been added to the cart`,
      type: 'success',
    });
  };

  const handleMsg = (msg: any) => {
    if (Platform.OS) {
      Alert.alert(`${msg}`);
    } else {
      ToastAndroid.showWithGravity(
        `${msg}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  const handleSelected = (index: any) => {
    let checkDup = [...selected];
    const number = checkDup.indexOf(index);

    if (number !== -1) {
      checkDup.splice(number, 1);
    } else {
      checkDup.push(index);
    }

    setSelected(checkDup);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isShowProduct}
      onRequestClose={() => {
        onIsShowProduct(false);
      }}>
      <View style={styles.CenteredView}>
        <View style={styles.ModalView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.TextTitle}>Add Product</Text>

            <TouchableOpacity
              style={styles.InputSpinerAction}
              onPress={handleToggleProduct}>
              <CustomIcon
                name="close"
                color={COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_18}
              />
            </TouchableOpacity>
          </View>

          {/* Container Product*/}
          <ScrollView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: SPACING.space_20,
                paddingBottom: viewHeight + SPACING.space_30,
                gap: SPACING.space_20,
              }}>
              {/* Contain */}
              <View
                style={{
                  width: products?.variants?.length === 0 ? '80%' : '30%',
                }}>
                {/* Product */}
                <View
                  style={{
                    backgroundColor: '#ddd',
                    borderRadius: SPACING.space_15,
                    padding: SPACING.space_10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        marginLeft: SPACING.space_10,
                      }}>
                      <Text style={styles.TextTitle}>{products?.name}</Text>
                      <View>
                        <Text style={styles.TextCommon}>Price</Text>
                        <Text style={styles.TextPrice}>
                          {(products?.price / 100).toFixed(2)} $
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.ContainerInputSpiner}>
                    <TouchableOpacity
                      disabled={products.quantity === 1}
                      style={styles.InputSpinerAction}
                      onPress={handleMinusQuanity}>
                      <CustomIcon
                        name="minus"
                        color={COLORS.primaryLightGreyHex}
                        size={FONTSIZE.size_10}
                      />
                    </TouchableOpacity>
                    <View style={styles.CartItemQuantityContainer}>
                      <Text style={styles.CartItemQuantityText}>
                        {products.quantity}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.InputSpinerAction}
                      onPress={handleAddQuanity}>
                      <CustomIcon
                        name="add"
                        color={COLORS.primaryLightGreyHex}
                        size={FONTSIZE.size_10}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Note */}
                <Text
                  style={{
                    ...styles.TextCommon,
                    paddingTop: SPACING.space_20,
                    paddingBottom: SPACING.space_10,
                  }}>
                  Add Note
                </Text>

                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={text => handleChangeNote(text)}
                  style={{
                    backgroundColor: '#ddd',
                    borderRadius: SPACING.space_15,
                    padding: SPACING.space_10,
                    fontFamily: FONTFAMILY.poppins_regular,
                    fontSize: FONTSIZE.size_18,
                    color: COLORS.primaryGreyHex,
                    height: SPACING.space_30 * 3,
                  }}
                  placeholderTextColor={COLORS.primaryGreyHex}
                  placeholder="Do you want to note something?"
                  editable={true}
                  value={products?.note}
                />

                {/* Description */}
                <Text
                  style={{
                    ...styles.TextCommon,
                    paddingTop: SPACING.space_20,
                    paddingBottom: SPACING.space_10,
                  }}>
                  Decription
                </Text>

                <TextInput
                  multiline={true}
                  numberOfLines={4}
                  value={products?.description}
                  style={{
                    backgroundColor: '#ddd',
                    borderRadius: SPACING.space_15,
                    padding: SPACING.space_10,
                    fontFamily: FONTFAMILY.poppins_regular,
                    fontSize: FONTSIZE.size_18,
                    color: COLORS.primaryGreyHex,
                    height: SPACING.space_30 * 3,
                  }}
                  placeholderTextColor={COLORS.primaryLightGreyHex}
                  editable={false}
                />
              </View>

              {/* Variant */}
              <View
                style={{
                  width: products?.variants?.length === 0 ? '20%' : '70%',
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: SPACING.space_10,
                }}>
                {products?.variants?.length ? (
                  products?.variants?.map((item: any, idxVariant: number) => (
                    <View style={{width: '48%'}}>
                      <View
                        style={{
                          marginHorizontal: SPACING.space_10,
                          marginBottom: SPACING.space_10,
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: SPACING.space_10,
                          }}>
                          <Text
                            style={{
                              ...styles.TextCommon,
                              fontFamily: FONTFAMILY.poppins_semibold,
                            }}>
                            {item?.name}
                          </Text>
                          <Text
                            style={{
                              ...styles.TextCommon,
                              fontFamily: FONTFAMILY.poppins_semibold,
                              color: COLORS.primaryRedHex,
                            }}>
                            {item?.minLength} require
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={{
                            transform: [
                              {
                                rotate:
                                  selected?.indexOf(idxVariant) !== -1
                                    ? '-90deg'
                                    : '90deg',
                              },
                            ],
                          }}
                          onPress={() => handleSelected(idxVariant)}>
                          <IconDrop
                            width={FONTSIZE.size_30}
                            height={FONTSIZE.size_30}
                          />
                        </TouchableOpacity>
                      </View>

                      {!selected?.includes(idxVariant) &&
                        item?.options?.map((option: any, idxOption: number) => (
                          <View
                            style={{
                              backgroundColor: '#ddd',
                              borderRadius: SPACING.space_15,
                              padding: SPACING.space_10,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              width: '100%',
                              marginBottom: SPACING.space_10,
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
                                    {(option?.price / 100).toFixed(1)}$
                                  </Text>
                                </View>
                              </View>
                            </View>

                            {item?.minLength > 0 ? (
                              <Checkbox
                                onPress={() =>
                                  handleChecked(
                                    idxVariant,
                                    idxOption,
                                    !option?.checked,
                                  )
                                }
                                isChecked={option?.checked}
                                disabled={option?.disabled}
                              />
                            ) : (
                              <View style={styles.ContainerInputSpiner}>
                                <TouchableOpacity
                                  disabled={option.quantity === 0}
                                  style={styles.InputSpinerAction}
                                  onPress={() =>
                                    handleMinusVariantQuantity(
                                      idxVariant,
                                      idxOption,
                                    )
                                  }>
                                  <CustomIcon
                                    name="minus"
                                    color={COLORS.primaryLightGreyHex}
                                    size={FONTSIZE.size_10}
                                  />
                                </TouchableOpacity>
                                <View style={styles.CartItemQuantityContainer}>
                                  <Text style={styles.CartItemQuantityText}>
                                    {option.quantity}
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  style={styles.InputSpinerAction}
                                  onPress={() =>
                                    handleAddVariantQuantity(
                                      idxVariant,
                                      idxOption,
                                    )
                                  }>
                                  <CustomIcon
                                    name="add"
                                    color={COLORS.primaryLightGreyHex}
                                    size={FONTSIZE.size_10}
                                  />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        ))}
                    </View>
                  ))
                ) : (
                  <LottieView
                    style={styles.AdditionalPrettie}
                    source={require('../lottie/empty.json')}
                    autoPlay
                    loop
                  />
                )}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity onPress={onSubmit}>
            <View onLayout={onLayout} style={styles.CartDisplay}>
              <View style={styles.CartContentCount}>
                <Text style={styles.TextCountCartFood} numberOfLines={1}>
                  Price
                </Text>
              </View>

              <Text style={styles.TextTotalPriceCartFood}>
                {totalPrice()} $
              </Text>
              <CustomIcon
                name={'cart'}
                color={'#008810'}
                size={FONTSIZE.size_24}
              />
            </View>

            <View style={styles.CartPaymentDisplay}>
              <Text style={styles.TextTotalPaymentCartFood}>Add to cart</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    height: '92%',
  },
  Button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  ButtonClose: {
    backgroundColor: '#2196F3',
  },
  TextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ModalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_18,
  },
  TextTitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
    fontWeight: '600',
  },
  TextPrice: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_20,
    fontWeight: '600',
  },
  ItemImage: {
    height: widthResponsive(40),
    width: widthResponsive(40),
    borderRadius: BORDERRADIUS.radius_15,
  },

  SizePrice: {
    color: COLORS.primaryLightGreyHex,
    fontSize: FONTSIZE.size_16,
  },
  InputSpinerAction: {
    backgroundColor: COLORS.primaryWhiteHex,
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
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
  },
  CartItemSingleLinearGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.space_12,
    gap: SPACING.space_12,
    borderRadius: BORDERRADIUS.radius_25,
    backgroundColor: '#F5F5F5',
  },
  CartItemSingleImage: {
    height: 150,
    width: 150,
    borderRadius: BORDERRADIUS.radius_20,
  },
  CartItemSingleInfoContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-around',
  },
  CartItemSingleSizeValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  ContainerInputSpiner: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  TextCountCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryBlackHex,
    fontWeight: '600',
  },
  TextTotalPriceCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryGreenRGB,
    fontWeight: '600',
    textAlign: 'right',
    marginRight: widthResponsive(4),
  },
  CartDisplay: {
    justifyContent: 'space-between',
    marginHorizontal: widthResponsive(20),
    borderRadius: widthResponsive(15),
    padding: widthResponsive(2),
    paddingHorizontal: widthResponsive(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  CartContentCount: {
    gap: widthResponsive(2),
    width: '70%',
  },
  CartPaymentDisplay: {
    backgroundColor: '#008810',
    marginHorizontal: widthResponsive(20),
    borderRadius: widthResponsive(15),
    padding: widthResponsive(3),
    paddingHorizontal: widthResponsive(10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  TextTotalPaymentCartFood: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
    fontWeight: '600',
    marginRight: widthResponsive(4),
    textAlign: 'center',
  },
  AdditionalPrettie: {
    height: '100%',
    width: 'auto',
    borderRadius: BORDERRADIUS.radius_20,
  },
});

export default PopUpProduct;
