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
import Switch from './Switch';

interface FoodDataPress {}

const FoodDataPress: React.FC<FoodDataPress> = ({}) => {
  const DataPress = useStore((state: any) => state.DataPress);
  const onAddDataPress = useStore((state: any) => state.onAddDataPress);
  const onAddDataStatus = useStore((state: any) => state.onAddDataStatus);
  const DataId = useStore((state: any) => state.DataId);
  const onAddDataId = useStore((state: any) => state.onAddDataId);

  const [checked, setChecked] = useState(false);

  const toggleSwitch = () => {
    setChecked(!checked);
  };

  const currentData = DataPress?.currentData[0]?.id || '';

  const Data = DataPress.data?.filter(
    (item: any, index: number, self: any) =>
      self.findIndex((e: any) => e.id === item.id) === index,
  );

  const dataCheck = DataPress.data?.length
    ? [...DataPress.data, DataPress.currentData[0]]
    : [DataPress.currentData[0]];

  const checkStatus = Data?.some((item: any) => item.id === currentData);

  useEffect(() => {
    if (checkStatus) {
      setChecked(true);
    }
  }, [checkStatus]);

  return (
    <View style={styles.CenteredView}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.CenteredView}>
          <View style={styles.ModalView}>
            <View style={styles.QrView}>
              <Text style={styles.TextTitleFood}>DataId request</Text>
            </View>

            <ScrollView>
              <View style={styles.Clog}>
                <Switch
                  barHeight={40}
                  switchWidth={50}
                  switchHeight={30}
                  value={checked}
                  onValueChange={toggleSwitch}
                  disabled={false}
                  backgroundActive={'#008810'}
                  backgroundInactive={'#d1d1d1'}
                  circleActiveColor={'white'}
                  circleInActiveColor={'white'}
                  changeValueImmediately={true}
                  innerCircleStyle={{
                    borderWidth: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  renderActiveText={false}
                  renderInActiveText={false}
                  switchLeftPx={3}
                  switchRightPx={3}
                  switchWidthMultiplier={2}
                  switchBorderRadius={30}
                />
              </View>
            </ScrollView>

            <View style={styles.Confirm}>
              <TouchableOpacity
                onPress={() => {
                  onAddDataPress({
                    ...DataPress,
                    isShow: false,
                    currentData: [],
                  });
                  onAddDataId({id: ''});
                }}
                style={styles.ButtonCancel}>
                <Text style={styles.TextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onAddDataPress({
                    ...DataPress,
                    isShow: false,
                    data: checked
                      ? dataCheck
                      : DataPress.data.filter(
                          (item: any) => item?.id !== DataId.id,
                        ),
                    currentData: [],
                  });
                  onAddDataId({id: ''});
                  onAddDataStatus(true);
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
  TextAmount: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenRGB,
    fontSize: widthResponsive(14),
  },
  TextTitleFood: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryGreenRGB,
    fontSize: widthResponsive(12),
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

export default FoodDataPress;
