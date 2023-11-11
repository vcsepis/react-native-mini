import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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

interface PopUpOrderConfirmProps {
  onToggle?: any;
  onSubmit?: any;
}

const OrderConfirm: React.FC<PopUpOrderConfirmProps> = ({
  onToggle,
  onSubmit,
}) => {
  const StoreCart = useStore((state: any) => state.StoreCart);
  const CalculateCart = useStore((state: any) => state.CalculateCart);

  const [note, setNote] = useState('');

  return (
    <View style={styles.CenteredView}>
      <Modal animationType="fade" transparent={true} visible={true}>
        <View style={styles.CenteredView}>
          <View style={styles.ModalView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.TextTitle}>Order Confirmation</Text>

              <TouchableOpacity
                style={styles.InputSpinerAction}
                onPress={onToggle}>
                <CustomIcon
                  name="close"
                  color={COLORS.primaryLightGreyHex}
                  size={FONTSIZE.size_18}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.TextConfirm}>
              Please confirm the order below to completed payment
            </Text>

            <ScrollView>
              <View style={styles.TableOrder}>
                <View style={styles.Row}>
                  <View style={styles.ContainerTableHeader}>
                    <Text style={styles.TextHeaderTitle}>Name</Text>
                  </View>
                  <View style={styles.ContainerTableHeaderNumber}>
                    <Text style={styles.TextHeaderTitle}>Quantity</Text>
                  </View>
                  <View style={styles.ContainerTableHeaderNumber}>
                    <Text style={styles.TextHeaderTitle}>Price</Text>
                  </View>
                  <View style={styles.ContainerTableHeaderNumber}>
                    <Text style={styles.TextHeaderTitle}>Tax</Text>
                  </View>
                  <View style={styles.ContainerTableHeaderNumber}>
                    <Text style={styles.TextHeaderTitle}>Sub Total</Text>
                  </View>
                </View>

                {StoreCart?.map((item: any, index: any) => (
                  <View style={styles.Row} key={index}>
                    <View style={styles.ContainerTableHeader}>
                      <Text style={styles.TextCommon}>{item.name}</Text>
                    </View>
                    <View style={styles.ContainerTableHeaderNumber}>
                      <Text style={styles.TextCommon}>{item.quantity}</Text>
                    </View>
                    <View style={styles.ContainerTableHeaderNumber}>
                      <Text style={styles.TextNumber}>
                        $ {(item.price / 100).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.ContainerTableHeaderNumber}>
                      <Text style={styles.TextCommon}>$ 0</Text>
                    </View>
                    <View style={styles.ContainerTableHeaderNumber}>
                      <Text style={styles.TextNumber}>$ {item.total}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.NoteContain}>
                <View style={styles.Note}>
                  <Text style={styles.TextHeaderTitle}>Note</Text>

                  <TextInput
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => setNote(text)}
                    value={note}
                    style={{
                      borderRadius: SPACING.space_15,
                      padding: SPACING.space_10,
                      fontFamily: FONTFAMILY.poppins_regular,
                      fontSize: FONTSIZE.size_18,
                      color: COLORS.primaryBlackHex,
                      height: SPACING.space_30 * 3,
                      backgroundColor: '#ddd',
                    }}
                    placeholder="Note something"
                    placeholderTextColor={COLORS.primaryBlackHex}
                  />
                </View>

                <View style={styles.OrderInfor}>
                  <View style={styles.Order}>
                    <Text style={styles.TextOrderName}>Sub total</Text>
                    <Text style={styles.TextNumber}>
                      $ {CalculateCart?.total}
                    </Text>
                  </View>
                  <View style={styles.Order}>
                    <Text style={styles.TextOrderName}>Sub Change</Text>
                    <Text style={styles.TextNumber}>$ 0</Text>
                  </View>
                  <View style={styles.Order}>
                    <Text style={styles.TextOrderName}>Order Discount</Text>
                    <Text style={styles.TextNumber}>$ 0</Text>
                  </View>
                  <View style={styles.Order}>
                    <Text style={styles.TextOrderName}>Tax</Text>
                    <Text style={styles.TextNumber}>$ 0</Text>
                  </View>
                  <View style={styles.Order}>
                    <Text style={styles.TextOrderName}>Change Amount</Text>
                    <Text style={styles.TextNumber}>
                      $ {CalculateCart?.change}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.Submit}>
              <View style={styles.PaymentMethod}>
                <CustomIcon
                  name="wallet"
                  size={FONTSIZE.size_30}
                  color={COLORS.primaryOrangeHex}
                />
                <Text style={styles.TextPaymentMethod}>
                  {CalculateCart?.paymentMethod}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onSubmit(note)}
                style={{
                  backgroundColor: COLORS.primaryGreenRGB,
                  padding: SPACING.space_10,
                  borderRadius: SPACING.space_15,
                  width: '40%',
                  alignSelf: 'center',
                }}>
                <Text style={styles.ScreenSubmit}>Done</Text>
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
    borderRadius: SPACING.space_15,
    padding: SPACING.space_30,
    height: '88%',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TextHeaderTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_18,
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
  InputSpinerAction: {
    backgroundColor: COLORS.primaryWhiteHex,
    padding: SPACING.space_15,
    borderRadius: BORDERRADIUS.radius_10,
  },
  Contain: {
    marginVertical: SPACING.space_20,
  },
  ScreenSubmit: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_regular,
    textAlign: 'center',
  },
  Row: {
    maxWidth: '100%',
    flexDirection: 'row',
    paddingHorizontal: SPACING.space_20,
    borderColor: COLORS.primaryWhiteHex,
    borderWidth: SPACING.space_2 / 2,
  },
  ContainerTableHeader: {
    width: '40%',
    height: widthResponsive(20),
    borderRadius: 24,
    justifyContent: 'center',
    padding: SPACING.space_10,
  },
  ContainerTableContain: {
    width: '20%',
    borderRadius: 24,
    padding: SPACING.space_10,
  },
  TableOrder: {
    backgroundColor: '#ddd',
    marginVertical: SPACING.space_20,
  },
  ContainerTableHeaderNumber: {
    width: '15%',
    height: widthResponsive(20),
    borderRadius: 24,
    justifyContent: 'center',
    padding: SPACING.space_10,
    alignItems: 'center',
  },
  TextConfirm: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_18,
  },
  NoteContain: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: SPACING.space_20,
  },
  Note: {
    backgroundColor: '#ddd',
    padding: SPACING.space_10,
    borderRadius: SPACING.space_10,
    gap: SPACING.space_10,
    width: '50%',
  },
  OrderInfor: {
    width: '40%',
    marginHorizontal: SPACING.space_10,
    gap: SPACING.space_10,
  },
  Order: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  TextOrderName: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
    textAlign: 'right',
    width: '50%',
  },
  TextPaymentMethod: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  Submit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  PaymentMethod: {
    borderRadius: SPACING.space_10,
    backgroundColor: '#ddd',
    padding: SPACING.space_10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.space_10,
  },
});

export default OrderConfirm;
