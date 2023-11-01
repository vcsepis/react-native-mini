import {
  Alert,
  Image,
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
import React, {useEffect, useState} from 'react';
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

interface PopUpProductProps {
  onToggle?: any;
  onSubmit?: any;
}

const PopUpProduct: React.FC<PopUpProductProps> = ({onToggle}) => {
  const [viewHeight, setViewHeight] = useState(0);
  const IsShowProduct = useStore((state: any) => state.IsShowProduct);
  const onIsShowProduct = useStore((state: any) => state.onIsShowProduct);
  const ProductCurrent = useStore((state: any) => state.ProductCurrent);
  const StoreCart = useStore((state: any) => state.StoreCart);
  const onAddStoreCart = useStore((state: any) => state.onAddStoreCart);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<any>({});

  const onLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setViewHeight(height + widthResponsive(10));
  };

  useEffect(() => {
    if (ProductCurrent?.quantity) {
      setQuantity(ProductCurrent?.quantity || 1);
    }
    setProducts(ProductCurrent);
  }, []);

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

  const handleAddVariantQuantity = (idxVariant: any, idxOpition: any) => {
    const updatedData = {...products};
    updatedData.variants[idxVariant].options[idxOpition].quantity += 1;
    setProducts(updatedData);
  };

  const handleMinusVariantQuantity = (idxVariant: any, idxOpition: any) => {
    const updatedData = {...products};
    updatedData.variants[idxVariant].options[idxOpition].quantity -= 1;
    setProducts(updatedData);
  };

  const totalPrice = () => {
    const variant = products?.variants?.reduce((acc: any, variant: any) => {
      return (
        acc +
        variant.options.reduce((optionAcc: any, option: any) => {
          return optionAcc + option.price * option.quantity;
        }, 0)
      );
    }, 0);

    const product = (products?.quantity * products?.price) / 100;

    const total = product + variant / 100;

    return total;
  };

  const handleChangeNote = (text: any) => {
    const updatedData = {...products};
    updatedData.discription = text;
    setProducts(updatedData);
  };

  const onSubmit = () => {
    if (Platform.OS) {
      Alert.alert(`${products.name} is Added to Cart`);
    } else {
      ToastAndroid.showWithGravity(
        `${products.name} is Added to Cart`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }

    const total = totalPrice();

    const productUpdate = {...products, total: total};

    const productId = products?.id;

    const index = StoreCart.findIndex((item: any) => item.id === productId);

    const updateData = [...StoreCart];

    // if (index === -1) {
    //   updateData[index] = productUpdate;
    //   onAddStoreCart(updateData);

    //   return onIsShowProduct(false);
    // } else {
    onAddStoreCart([productUpdate, ...StoreCart]);

    return onIsShowProduct(false);
    // }
  };

  return (
    <View style={styles.CenteredView}>
      <Modal animationType="slide" transparent={true} visible={IsShowProduct}>
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
                <View style={{width: '65%'}}>
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
                      <Image
                        source={require('../assets/app_images/discout.png')}
                        style={styles.ItemImage}
                      />

                      <View
                        style={{
                          justifyContent: 'space-between',
                          marginLeft: SPACING.space_10,
                        }}>
                        <Text style={styles.TextTitle}>{products?.name}</Text>
                        <View>
                          <Text style={styles.TextCommon}>Price</Text>
                          <Text style={styles.TextPrice}>
                            {products?.price / 100} $
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.ContainerInputSpiner}>
                      <TouchableOpacity
                        disabled={quantity === 1}
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
                    value={products?.description}
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
                    onChangeText={text => {}}
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
                    // value={this.state.text}
                  />
                </View>

                {/* Variant */}
                <View style={{width: '35%', flex: 1}}>
                  <Text
                    style={{
                      ...styles.TextCommon,
                      paddingBottom: SPACING.space_20,
                    }}>
                    Add Additional {`(${products?.variants?.length})`}
                  </Text>

                  {products?.variants?.length ? (
                    products?.variants?.map((item: any, idxVariant: number) =>
                      item?.options?.length ? (
                        item?.options?.map(
                          (option: any, idxOpition: number) => (
                            <View
                              style={{
                                backgroundColor: '#ddd',
                                borderRadius: SPACING.space_15,
                                padding: SPACING.space_10,
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
                                      {(option?.price / 100).toFixed(1)}$
                                    </Text>
                                  </View>
                                </View>
                              </View>

                              <View style={styles.ContainerInputSpiner}>
                                <TouchableOpacity
                                  style={styles.InputSpinerAction}
                                  onPress={() =>
                                    handleMinusVariantQuantity(
                                      idxVariant,
                                      idxOpition,
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
                                      idxOpition,
                                    )
                                  }>
                                  <CustomIcon
                                    name="add"
                                    color={COLORS.primaryLightGreyHex}
                                    size={FONTSIZE.size_10}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          ),
                        )
                      ) : (
                        <></>
                      ),
                    )
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
              <View
                style={{
                  backgroundColor: COLORS.primaryWhiteHex,
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  left: 0,
                }}>
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
                  <Text style={styles.TextTotalPaymentCartFood}>
                    Add To Order
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  CenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ModalView: {
    width: '80%',
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    padding: SPACING.space_30,
    height: '70%',
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
    padding: widthResponsive(8),
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
    padding: widthResponsive(8),
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