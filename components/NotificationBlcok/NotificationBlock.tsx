import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ReminderProps {
  text: string;
  color: string;
}

const Reminder = ({ text, color }: ReminderProps) => {
  return (
    <View style={styles.container}>
      <View style={[styles.outerCircle, { borderColor: color }]}>
        <View style={[styles.innerDot, { backgroundColor: color }]} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Reminder;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:10,
    width: 282,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 100,
  },
  text: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 3,
    borderBottomColor: '#ccc',
    paddingBottom: 2,
    width: '100%',
  },
});
