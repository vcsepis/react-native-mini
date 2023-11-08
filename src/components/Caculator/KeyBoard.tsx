import * as React from 'react';
import Button from './Button';
import {View, Text, TouchableOpacity} from 'react-native';
import {Styles} from './GlobalStyle';
import {myColors} from './Color';
import {COLORS, SPACING} from '../../theme/theme';
import {useStore} from '../../store/store';

export default function MyKeyboard({setChange}: any) {
  const CaculateCart = useStore((state: any) => state.CaculateCart);

  const [firstNumber, setFirstNumber] = React.useState('');
  const [secondNumber, setSecondNumber] = React.useState('');
  const [operation, setOperation] = React.useState('');
  const [result, setResult] = React.useState<number>(0);

  const handleNumberPress = (buttonValue: string) => {
    if (firstNumber.length < 10) {
      setFirstNumber(firstNumber + buttonValue);
    }
  };

  const handleOperationPress = (buttonValue: string) => {
    setOperation(buttonValue);
    setSecondNumber(firstNumber);
    setFirstNumber('');
  };

  const clear = () => {
    setFirstNumber('');
    setSecondNumber('');
    setOperation('');
    setResult(0);
  };

  const firstNumberDisplay = () => {
    if (result !== 0) {
      return (
        <Text
          style={
            result < 99999
              ? [Styles.screenFirstNumber, {color: myColors.result}]
              : [
                  Styles.screenFirstNumber,
                  {fontSize: 18, color: myColors.result},
                ]
          }>
          {result?.toString()}
        </Text>
      );
    }
    if (firstNumber && firstNumber.length < 6) {
      return (
        <Text style={Styles.screenFirstNumber}>
          {(Number(firstNumber) / 100).toFixed(2)}
        </Text>
      );
    }
    if (firstNumber === '') {
      return <Text style={Styles.screenFirstNumber}>{'0'}</Text>;
    }
    if (firstNumber.length > 5 && firstNumber.length < 8) {
      return (
        <Text style={[Styles.screenFirstNumber, {fontSize: 70}]}>
          {(Number(firstNumber) / 100).toFixed(2)}
        </Text>
      );
    }
    if (firstNumber.length > 7) {
      return (
        <Text style={[Styles.screenFirstNumber, {fontSize: 50}]}>
          {(Number(firstNumber) / 100).toFixed(2)}
        </Text>
      );
    }
  };

  const getResult = () => {
    switch (operation) {
      case '+':
        clear();
        setResult(parseInt(secondNumber) + parseInt(firstNumber));
        break;
      case '-':
        clear();
        setResult(parseInt(secondNumber) - parseInt(firstNumber));
        break;
      case '*':
        clear();
        setResult(parseInt(secondNumber) * parseInt(firstNumber));
        break;
      case '/':
        clear();
        setResult(parseInt(secondNumber) / parseInt(firstNumber));
        break;
      default:
        clear();
        setResult(0);
        break;
    }
  };

  React.useEffect(() => {
    setChange({
      change: (CaculateCart?.total - Number(firstNumber) / 100).toFixed(2),
      cash: Number(firstNumber) / 100,
    });
  }, [firstNumber]);

  return (
    <View style={Styles.viewBottom}>
      <View
        style={{
          width: '50%',
          justifyContent: 'flex-end',
          gap: SPACING.space_10,
        }}>
        <View
          style={{
            backgroundColor: myColors.btnGray,
            borderRadius: SPACING.space_15,
            padding: SPACING.space_10,
          }}>
          {firstNumberDisplay()}
        </View>
        <Text style={Styles.screenChange}>Change</Text>
        <View
          style={{
            backgroundColor: myColors.btnGray,
            borderRadius: SPACING.space_15,
            padding: SPACING.space_10,
          }}>
          {/* <Text style={Styles.screenSecondNumber}>
          {secondNumber}
          <Text style={{color: 'purple', fontSize: 16, fontWeight: '500'}}>
            {operation}
          </Text>
        </Text> */}
          <Text style={Styles.screenFirstNumber}>
            {Number(firstNumber) === 0
              ? 0
              : (CaculateCart?.total - Number(firstNumber) / 100).toFixed(2)}
          </Text>
        </View>
      </View>
      <View>
        <View style={Styles.row}>
          <Button top isGray title="7" onPress={() => handleNumberPress('7')} />
          <Button top isGray title="8" onPress={() => handleNumberPress('8')} />
          <Button top isGray title="9" onPress={() => handleNumberPress('9')} />
          {/* <Button
          isGray
          title="×"
          isBlue
          onPress={() => handleOperationPress('*')}
        /> */}
        </View>
        <View style={Styles.row}>
          <Button isGray title="4" onPress={() => handleNumberPress('4')} />
          <Button isGray title="5" onPress={() => handleNumberPress('5')} />
          <Button isGray title="6" onPress={() => handleNumberPress('6')} />
          {/* <Button
          isGray
          title="-"
          isBlue
          onPress={() => handleOperationPress('-')}
        /> */}
        </View>
        <View style={Styles.row}>
          <Button isGray title="1" onPress={() => handleNumberPress('1')} />
          <Button isGray title="2" onPress={() => handleNumberPress('2')} />
          <Button isGray title="3" onPress={() => handleNumberPress('3')} />
          {/* <Button
          isGray
          title="+"
          isBlue
          onPress={() => handleOperationPress('+')}
        /> */}
        </View>
        <View style={Styles.row}>
          <Button isGray title="." onPress={() => handleNumberPress('.')} />
          <Button isGray title="0" onPress={() => handleNumberPress('0')} />
          <Button
            isGray
            title="⌫"
            onPress={() => setFirstNumber(firstNumber.slice(0, -1))}
          />
          {/* <Button title="=" isBlue onPress={() => getResult()} /> */}
        </View>
      </View>
    </View>
  );
}
