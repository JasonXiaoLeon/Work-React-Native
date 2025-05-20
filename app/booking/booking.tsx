import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GoBackBTN from '../../components/GoBackBTN/GoBackBTN';
import { API_URL } from '../../src/constants/env';


const getNextWeekDates = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const diffToNextMonday = currentDay === 0 ? 1 : 8 - currentDay;
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() + diffToNextMonday);

  const weekDates: { display: string; date: string }[] = [];
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  for (let i = 0; i < 5; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];

    const displayMonth = month < 10 ? `0${month}` : `${month}`;
    const displayDay = day < 10 ? `0${day}` : `${day}`;
    const isoDate = `${year}-${displayMonth}-${displayDay}`;

    weekDates.push({
      display: `周${weekday} ${month}/${day}`,
      date: isoDate,
    });
  }

  return weekDates;
};

interface DecodedToken {
  user: {
    email: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const Booking = () => {

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const nextWeekDates = getNextWeekDates();

  const handleSelectDate = (date: string) => {
    setSelectedDates((prev) => {
      if (prev.includes(date)) {
        return prev.filter((d) => d !== date);
      } else if (prev.length < 4) {
        return [...prev, date];
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (selectedDates.length < 3) {
      Alert.alert('错误', '请至少选择 3 天');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('jwt');
      if (!token) {
        Alert.alert('错误', '无法获取登录信息');
        return;
      }

      const decoded = jwtDecode<DecodedToken>(token);
      const userEmail = decoded.user;
      const name = userEmail.split('@')[0];

      const response = await fetch(`${API_URL}/api/attendance/booking`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: userEmail,
          dates: selectedDates,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('成功', '预约成功');
        setSelectedDates([]);
      } else {
        Alert.alert('错误', `预约失败: ${data.message}`);
      }
    } catch (error) {
      console.error('请求失败', error);
      Alert.alert('网络错误', '请稍后再试');
    }
  };

  const getSelectedColor = (date: string) => {
    return selectedDates.includes(date) ? '#ADD8E6' : 'transparent';
  };

  const getTextColor = (date: string) => {
    return selectedDates.includes(date) ? '#FFFFFF' : '#333333';
  };


  return (
    <ScrollView style={styles.container}>
      <GoBackBTN />
      <Text style={styles.title}>预约</Text>

      <View style={styles.table}>
        {nextWeekDates.map(({ display, date }, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.row, { backgroundColor: getSelectedColor(date) }]}
            onPress={() => handleSelectDate(date)}
          >
            <Text style={[styles.cell, { color: getTextColor(date) }]}>{display}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, selectedDates.length < 3 && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={selectedDates.length < 3}
      >
        <Text style={styles.submitButtonText}>提交预约</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cell: {
    fontSize: 18,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default Booking;
