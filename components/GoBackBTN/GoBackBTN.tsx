import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const GoBackBTN = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.button}>
        <View>
            <Svg
                width={32}
                height={32}
                viewBox="0 0 1024 1024"
                fill="none"
            >
                <Path
                d="M658.24 210.304H292.544V64L0 283.456l292.544 219.456V356.544H658.24c124.352 0 219.52 95.04 219.52 219.456s-95.104 219.456-219.52 219.456H292.544V941.76H658.24C855.744 941.76 1024 780.8 1024 576S863.104 210.304 658.24 210.304z"
                fill='#000000'
                />
            </Svg>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingLeft: 0,
    justifyContent:'flex-start',
  },
  button: {
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default GoBackBTN;
