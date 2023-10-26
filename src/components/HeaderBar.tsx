import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
  widthResponsive,
} from '../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import ProfilePic from './ProfilePic';
import moment from 'moment';
import AnimatedTyping from '../utils/animated';

interface HeaderBarProps {
  title?: string;
  navigation?: any;
}

const generateGreetings = () => {
  const currentHour: any = moment().format('HH');
  if (currentHour >= 1 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 15) {
    return 'Good Afternoon';
  } else if (currentHour >= 15 && currentHour < 20) {
    return 'Good Evening';
  } else if (currentHour >= 20 || currentHour < 1) {
    return 'Good Night';
  } else {
    return 'Hello';
  }
};

const HeaderBar: React.FC<HeaderBarProps> = ({title, navigation}) => {
  const spinValue = new Animated.Value(0);

  // First set up animation
  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['60deg', '-10deg'],
  });

  const handlePressStore = () => {
    const id = 'dev-store-';

    return navigation.push('Store', {id});
  };

  return (
    <View style={styles.HeaderContainer}>
      <View>
        <TouchableOpacity
          style={styles.ContainerCurrentTime}
          onPress={handlePressStore}>
          <AnimatedTyping text={[generateGreetings()]} autoPlay />
          {generateGreetings() === 'Good Morning' ||
          generateGreetings() === 'Good Afternoon' ? (
            <Animated.Image
              source={require('../assets/app_images/sun.png')}
              style={{...styles.Image, transform: [{rotate: spin}]}}
            />
          ) : (
            <></>
          )}
          {generateGreetings() === 'Good Evening' ||
          generateGreetings() === 'Good Night' ? (
            <Animated.Image
              source={require('../assets/app_images/good-night.png')}
              style={{...styles.Image, transform: [{rotate: spin}]}}
            />
          ) : (
            <></>
          )}
        </TouchableOpacity>
        <Text style={styles.LocationName}>Hi, Lets order now</Text>
      </View>
      <Text style={styles.HeaderText}>{title}</Text>
      <ProfilePic />
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    padding: SPACING.space_30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.secondaryBlackRGB,
  },
  LocationText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.secondaryBlackRGB,
  },
  LocationName: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.secondaryBlackRGB,
    fontWeight: 'bold',
  },
  LocationSelected: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.secondaryBlackRGB,
  },
  Image: {
    height: widthResponsive(30),
    width: widthResponsive(30),
    borderRadius: BORDERRADIUS.radius_15,
  },
  ContainerCurrentTime: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default HeaderBar;
