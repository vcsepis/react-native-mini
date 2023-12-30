import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import WebView from 'react-native-webview';
import CustomIcon from './CustomIcon';
import {useStore} from '../store/store';

const PopupReceipt: React.FC<any> = ({}) => {
  const onReceipt = useStore((state: any) => state.onReceipt);
  const Receipt = useStore((state: any) => state.Receipt);
  console.log(Receipt, 'Receipt');
  const handleClose = () => onReceipt({isShow: false, data: {}});

  useEffect(() => {
    setTimeout(() => {
      handleClose();
    }, 10000);
  }, []);

  return (
    <View style={styles.CenteredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.CenteredView}>
          <View style={styles.ModalView}>
            <TouchableOpacity style={styles.HandleButon} onPress={handleClose}>
              <CustomIcon
                style={styles.InputIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryLightGreyHex}
              />
            </TouchableOpacity>

            <ScrollView>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  marginTop: SPACING.space_10,
                }}>
                <View style={styles.HeaderReceipt}>
                  <Text style={styles.TextCommon}>
                    *********************************************
                  </Text>

                  <Text style={styles.TextTitle}>
                    RECEIPT For {Receipt.data.customerName}
                  </Text>

                  <Text style={styles.TextCommon}>
                    *********************************************
                  </Text>
                </View>

                <View style={styles.ContainReceipt}>
                  {Receipt?.data?.products?.map((item: any) => (
                    <View style={styles.ItemReceipt} key={item.id}>
                      <Text style={styles.TextNameProduct}>
                        {item.quantity} x {item.name}
                      </Text>
                      <Text style={styles.TextPrice}>
                        $ {(item.price / 100).toFixed(2)}
                      </Text>
                    </View>
                  ))}

                  <Text style={styles.TextCommon}>
                    -----------------------------------------
                  </Text>

                  <View style={styles.ItemReceipt}>
                    <Text style={styles.TextNameProduct}>TOTAL AMOUNT</Text>
                    <Text style={styles.TextPrice}>
                      $ {(Receipt.data.total / 100).toFixed(2)}
                    </Text>
                  </View>

                  <Text style={styles.TextCommon}>
                    -----------------------------------------
                  </Text>

                  <View style={styles.FooterReceipt}>
                    <Text style={styles.TextCommon}>************</Text>
                    <Text style={styles.TextPrice}>THANK YOU !</Text>
                    <Text style={styles.TextCommon}>************</Text>
                  </View>

                  <Text style={styles.TextCommon}>
                    -----------------------------------------
                  </Text>
                </View>

                <View style={styles.HeaderReceipt}>
                  <TouchableOpacity
                    style={styles.ButtonSubmit}
                    onPress={handleClose}>
                    <Text style={styles.TextSubmit}>GOT IT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
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
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    padding: SPACING.space_30,
    maxHeight: '80%',
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
  },
  TextTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_28,
  },
  TextNameProduct: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_24,
  },
  TextPrice: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: '#008810',
    fontSize: FONTSIZE.size_24,
  },
  TextSubmit: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryWhiteHex,
    fontSize: FONTSIZE.size_24,
  },
  HandleButon: {
    alignItems: 'flex-end',
  },
  ButtonSubmit: {
    alignItems: 'center',
    backgroundColor: '#008810',
    width: '40%',
    justifyContent: 'center',
    borderRadius: SPACING.space_16,
    padding: SPACING.space_10,
  },
  ItemReceipt: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: SPACING.space_10,
    gap: SPACING.space_10,
  },
  HeaderReceipt: {
    alignItems: 'center',
  },
  FooterReceipt: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.space_10,
  },
  ContainReceipt: {
    gap: SPACING.space_16,
    flex: 1,
    marginVertical: SPACING.space_20,
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
});

export default PopupReceipt;
