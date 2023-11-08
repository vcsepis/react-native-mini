import {useContext} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {Styles} from './GlobalStyle';

interface ButtonProps {
  onPress: () => void;
  title: string;
  isBlue?: boolean;
  isGray?: boolean;
  top?: boolean;
}

export default function Button({
  title,
  onPress,
  isBlue,
  isGray,
  top,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={
        isBlue
          ? {...Styles.btnBlue, marginTop: top ? 0 : 8}
          : isGray
          ? {...Styles.btnGray, marginTop: top ? 0 : 8}
          : {...Styles.btnLight, marginTop: top ? 0 : 8}
      }
      onPress={onPress}>
      <Text
        style={
          isBlue || isGray ? Styles.smallTextLight : Styles.smallTextLight
        }>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
