import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import {useStore} from '../store/store';

interface FoodDataSuggest {
  handleToggle: any;
}

const FoodDataSuggest: React.FC<FoodDataSuggest> = ({handleToggle}) => {
  const DataPress = useStore((state: any) => state.DataPress);
  const onAddFoodDataSuggest = useStore(
    (state: any) => state.onAddFoodDataSuggest,
  );
  const DataId = useStore((state: any) => state.DataId);
  const onAddDataId = useStore((state: any) => state.onAddDataId);
  const onIsShowProduct = useStore((state: any) => state.onIsShowProduct);
  const StoreCart = useStore((state: any) => state.StoreCart);
  const onAddStoreCart = useStore((state: any) => state.onAddStoreCart);
  const onAddDataPress = useStore((state: any) => state.onAddDataPress);
  const onAddCalculateCart = useStore((state: any) => state.onAddCalculateCart);
  const onAddDataStatus = useStore((state: any) => state.onAddDataStatus);
  const addProductCurrent = useStore((state: any) => state.addProductCurrent);

  const Data = DataPress?.data?.length
    ? DataPress?.data?.filter(
        (item: any, index: number, self: any) =>
          self.findIndex((e: any) => e.id === item.id) === index,
      )
    : [];

  const checkData = Data?.length
    ? [Data?.filter((item: any) => item?.products?.length)[0]]
    : [];

  const handleProduct = async (item: any) => {
    onIsShowProduct(true);
    addProductCurrent({
      ...item,
      index: undefined,
      price: item?.price,
      quantity: 1,
      variants: item.variants?.length
        ? item.variants?.map((item: any) => ({
            ...item,
            options: item?.options?.length
              ? item?.options?.map((option: any) => ({...option, quantity: 0}))
              : [],
          }))
        : [],
    });
  };

  const addCard = (data: any) => {
    onAddStoreCart([{...data, quantity: 1}, ...StoreCart]);
  };

  const totalPrice = () => {
    const price = StoreCart.reduce((accumulator: any, item: any) => {
      // Tính tổng tiền cho cấp độ options trong từng variant
      const variantTotal = item?.variants?.reduce(
        (variantAcc: any, variant: any) => {
          return (
            variantAcc +
            variant?.options?.reduce((optionAcc: any, option: any) => {
              return (
                optionAcc + option.price * option.quantity * item?.quantity
              );
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

  const total = totalPrice();

  return (
    <View style={styles.CenteredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.CenteredView}>
          <View style={styles.ModalView}>
            <View style={styles.QrView}>
              <Text style={styles.TextTitleFood}>
                Which ({Data[0]?.name}) do you want to choose
              </Text>
            </View>

            <ScrollView>
              {checkData?.length ? (
                checkData?.map((item: any) => (
                  <>
                    <Text style={styles.TextProduct}>{item.name}</Text>

                    <View style={styles.ProductContainer}>
                      {item.products.map((e: any) => (
                        <TouchableOpacity
                          key={e?.id}
                          style={{
                            ...styles.ProductItem,
                            backgroundColor: COLORS.primaryWhiteHex,
                          }}
                          onPress={() => handleProduct(e)}>
                          <Text style={styles.TextProduct}>{e.name}</Text>
                          <Text style={styles.TextProductPrice}>
                            {(e.price / 100).toFixed(2)} $
                          </Text>

                          {e?.variants?.length === 0 && (
                            <TouchableOpacity
                              onPress={() => addCard(e)}
                              style={styles.ButtonCancel}>
                              <Text style={styles.TextCancel}>Add</Text>
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                ))
              ) : (
                <></>
              )}
            </ScrollView>

            <View style={styles.Confirm}>
              <TouchableOpacity
                onPress={() => onAddFoodDataSuggest(false)}
                style={styles.ButtonCancel}>
                <Text style={styles.TextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (DataPress.data?.length > 1) {
                    onAddDataPress({
                      ...DataPress,
                      data:
                        DataPress.data?.length > 0
                          ? DataPress.data.filter(
                              (item: any, index: number) => index !== 0,
                            )
                          : [],
                    });

                    onAddCalculateCart({total, data: StoreCart});

                    return;
                  }

                  if (DataPress.data?.length === 1) {
                    onAddFoodDataSuggest(false);
                    onAddCalculateCart({total, data: StoreCart});
                    onAddDataStatus(false);
                    handleToggle();
                  }
                }}
                style={styles.ButtonConfirm}>
                <Text style={styles.TextSubmit}>Confirm</Text>
              </TouchableOpacity>
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
    padding: SPACING.space_30,
    height: '80%',
    borderRadius: SPACING.space_15,
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextCancel: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
  },
  TextSubmit: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_24,
  },
  TextProductPrice: {
    fontFamily: FONTFAMILY.poppins_bold,
    color: COLORS.primaryGreenRGB,
    fontSize: FONTSIZE.size_20,
  },
  TextProduct: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextAmount: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenRGB,
    fontSize: widthResponsive(14),
  },
  TextTitleFood: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenRGB,
    fontSize: widthResponsive(8),
  },
  HandleButon: {
    alignItems: 'flex-end',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  ButtonConfirm: {
    padding: SPACING.space_15,
    borderRadius: SPACING.space_15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryGreenRGB,
  },
  ProductContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.space_16,
  },
  ProductItem: {
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    alignItems: 'center',
    width: '23.5%',
    paddingVertical: SPACING.space_30,
    gap: SPACING.space_10,
    borderColor: '#ddd',
    borderWidth: widthResponsive(0.5),
  },
  ButtonCancel: {
    padding: SPACING.space_15,
    borderRadius: SPACING.space_15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  DataConfirm: {
    backgroundColor: COLORS.primaryOrangeHex,
    padding: SPACING.space_20,
    borderRadius: SPACING.space_15,
    width: '50%',
    marginTop: widthResponsive(2),
    height: widthResponsive(20),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  QrView: {
    alignItems: 'center',
    width: '100%',
  },
  Clog: {
    alignItems: 'center',
    width: '100%',
    marginTop: widthResponsive(10),
  },
  Image: {
    height: widthResponsive(20),
    width: '60%',
  },
  AnimationPrettie: {
    height: widthResponsive(60),
    width: widthResponsive(100),
  },
  Confirm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: widthResponsive(10),
    justifyContent: 'center',
    gap: SPACING.space_10,
  },
});

export default FoodDataSuggest;
