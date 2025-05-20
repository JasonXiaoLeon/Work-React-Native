import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { API_URL } from '../../../src/constants/env';

const getWeekRange = (baseDate: Date, weekOffset: number) => {
  const monday = new Date(baseDate);
  const currentDay = baseDate.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  monday.setDate(baseDate.getDate() + diffToMonday + weekOffset * 7);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${month}/${day}`;
  };

  return { startDate: formatDate(monday), endDate: formatDate(friday), monday };
};

const getWeekDates = (monday: Date) => {
  const dates: string[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    dates.push(`${month}/${day}`);
  }
  return dates;
};

const Schedule = () => {
  const currentDate = new Date();
  const [currentWeek, setCurrentWeek] = useState(0); // 当前是第几周偏移
  const [appointments, setAppointments] = useState<string[]>([]); // 后端获取的预约日期

  const { startDate, endDate, monday } = getWeekRange(currentDate, currentWeek);
  const currentWeekDates = getWeekDates(monday);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => prev + 1);
  };

  const getAppointmentColor = (date: string) => {
    return appointments.includes(date) ? '#ADD8E6' : 'transparent';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt');
        if (!token) {
          console.error('未找到 token');
          return;
        }

        const res = await fetch(`${API_URL}/api/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data.records)) {
          const formattedDates = data.records.map((item: { date: string }) => {
            const d = new Date(item.date);
            const month = d.getMonth() + 1;
            const day = d.getDate();
            return `${month}/${day}`;
          });
          setAppointments(formattedDates);
        } else {
          console.error('获取考勤记录失败:', data.message);
        }
      } catch (error) {
        console.error('请求失败:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>排班表</Text>

      <View style={styles.weekRange}>
        <Button title="上一周" onPress={handlePreviousWeek} />
        <Text style={styles.weekText}>{startDate} - {endDate}</Text>
        <Button title="下一周" onPress={handleNextWeek} />
      </View>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.cell, styles.headerCell]}>时间</Text>
          {currentWeekDates.map((date, index) => (
            <Text key={index} style={[styles.cell, styles.headerCell]}>{date}</Text>
          ))}
        </View>

        {timeSlots.map((time, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, styles.timeCell]}>{time}</Text>
            {currentWeekDates.map((date, idx) => (
              <Text
                key={idx}
                style={[styles.cell, { backgroundColor: getAppointmentColor(date) }]}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  weekRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    alignItems: 'center',
  },
  weekText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  table: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    height: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  timeCell: {
    width: 100,
    fontWeight: 'bold',
    borderLeftWidth: 0,
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#ddd',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
});

export default Schedule;
