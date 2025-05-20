import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import GoBackBTN from '../../../components/GoBackBTN/GoBackBTN';
import { API_URL } from '../../../src/constants/env';
import { ClockData } from '../../../src/types/attendanceTime';

const MyCalendar = () => {
  const [clockDataMap, setClockDataMap] = useState<Record<string, ClockData>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchClockData = async () => {
    const token = await SecureStore.getItemAsync('jwt');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/attendance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('API 请求失败');

      const data = await response.json();
      
      const clockDataMap: Record<string, ClockData> = data.records.reduce(
        (acc: Record<string, ClockData>, record: { date: string; clockIn: string; clockOut: string }) => {
          if (record.clockIn !== 'null' && record.clockOut !== 'null') {
            acc[record.date] = {
              clockIn: record.clockIn,
              clockOut: record.clockOut,
            };
          }
          return acc;
        },
        {}
      );
  
      setClockDataMap(clockDataMap);

    } catch (err) {
      console.error('获取打卡数据失败', err);
    }
  };

  useEffect(() => {
    fetchClockData();
  }, []);

  const markedDates = Object.keys(clockDataMap).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: 'red',
      selected: date === selectedDate,
      selectedColor: '#87CEEB',
    };
    return acc;
  }, {} as any);

  const clockData = selectedDate ? clockDataMap[selectedDate] : null;

  return (
    <View>
        <GoBackBTN/>
        <View style={styles.container}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
          />

          <Modal visible={!!selectedDate} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedDate}</Text>
                {clockData ? (
                  <View style={styles.clockInfoContainer}>
                    <Text style={styles.clockInfo}>Clock In: <Text style={styles.clockValue}>{clockData.clockIn}</Text></Text>
                    <Text style={styles.clockInfo}>Clock Out: <Text style={styles.clockValue}>{clockData.clockOut}</Text></Text>
                  </View>
                ) : (
                  <Text style={styles.noDataText}>这天没有打卡记录</Text>
                )}
                <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>关闭</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
    </View>

  );
};

export default MyCalendar;

const styles = StyleSheet.create({
  container: {
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    maxWidth: 400,
    elevation: 10, // Adding shadow for Android
    shadowColor: 'black', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  clockInfoContainer: {
    marginBottom: 20,
  },
  clockInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  clockValue: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
