import {StyleSheet} from 'react-native';
import {myColors} from './Color';
import {COLORS, FONTFAMILY, FONTSIZE} from '../../theme/theme';

export const Styles = StyleSheet.create({
  // Button
  btnBlue: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: myColors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  btnDark: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: myColors.btnDark,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  btnLight: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: myColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  btnGray: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: myColors.btnGray,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  smallTextLight: {
    fontSize: 32,
    color: myColors.white,
  },
  smallTextDark: {
    fontSize: 32,
    color: myColors.black,
  },
  // Keyboard
  row: {
    maxWidth: '100%',
    flexDirection: 'row',
  },
  viewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'flex-start',
  },
  screenFirstNumber: {
    fontSize: 30,
    color: COLORS.primaryLocation,
    fontFamily: FONTFAMILY.poppins_regular,
    alignSelf: 'flex-end',
  },
  screenChange: {
    fontSize: 18,
    color: COLORS.primaryBlackHex,
    fontFamily: FONTFAMILY.poppins_regular,
    alignSelf: 'flex-start',
  },
  screenSubmit: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_regular,
    textAlign: 'center',
  },
  screenSecondNumber: {
    fontSize: 18,
    color: myColors.white,
    fontWeight: '200',
    alignSelf: 'flex-end',
  },
});
