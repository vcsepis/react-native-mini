import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../../theme/theme';
import {SETTING, SettingData} from '../../utils/setting';
import {Fragment, useState} from 'react';
import SettingPaymentMethod from './PaymentMethod';

const HandleRenderView = (type: any) => {
  switch (type) {
    case SETTING.PAYMENT_METHOD:
      return <SettingPaymentMethod />;
    case SETTING.ITEM_SALES:
      return <Text style={styles.TextCommon}>ITEM_SALES</Text>;
    case SETTING.CATEGORY_SALES:
      return <Text style={styles.TextCommon}>CATEGORY_SALES</Text>;
    case SETTING.MODIFIER_SALES:
      return <Text style={styles.TextCommon}>MODIFIER_SALES</Text>;
    case SETTING.DISCOUNTS:
      return <Text style={styles.TextCommon}>DISCOUNTS</Text>;
    case SETTING.TAXES:
      return <Text style={styles.TextCommon}>TAXES</Text>;
    default:
      return <Text style={styles.TextCommon}>Home</Text>;
  }
};

const TabSetting = () => {
  const [typeCategory, setTypeCategory] = useState(0);

  const handleChangeTypeCategory = (type: any) => setTypeCategory(type);

  return (
    <View style={styles.Root}>
      <View style={styles.Container}>
        <View style={styles.CategoryTab}>
          {SettingData.map((item: any, index: number) => (
            <Fragment key={item.id}>
              <TouchableOpacity
                style={{
                  ...styles.TouchCategory,
                  backgroundColor:
                    index === typeCategory
                      ? COLORS.primaryGreenRGB
                      : COLORS.primaryWhiteHex,
                }}
                onPress={() => handleChangeTypeCategory(index)}>
                <Text
                  style={{
                    ...styles.TextCommon,
                    color:
                      index === typeCategory
                        ? COLORS.primaryWhiteHex
                        : COLORS.primaryBlackHex,
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Fragment>
          ))}
        </View>
        <View style={styles.Contain}>{HandleRenderView(typeCategory)}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Root: {
    flex: 1,
  },
  Container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: SPACING.space_20,
    paddingHorizontal: SPACING.space_20,
    height: '100%',
  },
  CategoryTab: {
    width: '30%',
    gap: SPACING.space_10,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    padding: SPACING.space_20,
  },
  Contain: {
    width: '70%',
    gap: SPACING.space_20,
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: SPACING.space_15,
    padding: SPACING.space_20,
  },
  TextCommon: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryBlackHex,
    fontSize: FONTSIZE.size_20,
  },
  TouchCategory: {
    flexDirection: 'row',
    borderRadius: SPACING.space_15,
    padding: SPACING.space_10,
  },
});

export default TabSetting;
