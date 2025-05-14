import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const MainComponent: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [hasWorkToday, setHasWorkToday] = useState<boolean>(false);
  const [clockIn, setClockIn] = useState<string>('null');
  const [clockOut, setClockOut] = useState<string>('null');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt');
        if (!token) {
          console.warn('未找到 token');
          return;
        }

        const decoded: any = jwtDecode(token);
        const username = decoded.user?.split('@')[0];
        const userAvatar = decoded.user?.avatar || '';

        setUser(username);
        setAvatar(userAvatar);

        const attendanceRes = await axios.get('http://localhost:3001/api/attendance/today', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClockIn(attendanceRes.data.clockIn || 'null');
        setClockOut(attendanceRes.data.clockOut || 'null');
        setHasWorkToday(attendanceRes.data.hasAttendanceToday === true);
      } catch (error) {
        console.error('获取信息失败', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleBooking = () => {
    router.push('/home/schedule/booking');
  };

  const handleClockInOut = async () => {
    try {
      const token = await SecureStore.getItemAsync('jwt');
      if (!token) {
        console.warn('未找到 token');
        return;
      }

      const response = await axios.post(
        'http://localhost:3001/api/attendance/clock-in-out',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.clockIn && response.data.clockIn !== 'null') {
        Alert.alert('提示', '上班打卡成功');
        setClockIn(response.data.clockIn);
      } else if (response.data.clockOut && response.data.clockOut !== 'null') {
        Alert.alert('提示', '下班打卡成功');
        setClockOut(response.data.clockOut);
      }
    } catch (error) {
      console.error('打卡失败', error);
    }
  };

  const avatarUri = avatar || '';
  const isRestDay = !hasWorkToday;
  const canClockIn = hasWorkToday && clockIn === 'null';
  const canClockOut = hasWorkToday && clockIn !== 'null' && clockOut === 'null';
  const hasFinishedWork = hasWorkToday && clockIn !== 'null' && clockOut !== 'null';
  const canClockInOrOut = canClockIn || canClockOut;
  const disableClockButton = !canClockInOrOut || hasFinishedWork;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.welcomeText}>欢迎, {user || '用户'}</Text>
            <Text style={styles.workText}>
              {loading ? '加载中...' : hasWorkToday ? '今天上班' : '今天休息'}
            </Text>
          </View>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.largeButton} onPress={handleBooking}>
            <Text style={styles.buttonText}>预约</Text>
          </TouchableOpacity>

          <View style={styles.rightContainer}>
            <TouchableOpacity
              style={[
                styles.smallButton,
                disableClockButton && styles.disabledButton,
              ]}
              disabled={disableClockButton}
              onPress={handleClockInOut}
            >
              <Text style={styles.buttonText}>
                {canClockIn ? '上班打卡' : canClockOut ? '下班打卡' : '已完成打卡'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallButton}>
              <Text style={styles.buttonText}>请假</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>本周目标：Jira领卡，完整前端组件</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#e3f2fd',
    paddingTop: '10%',
  },
  headerContainer: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    width: 90,
    height: 90,
    fontSize: 18,
    fontWeight: '700',
    color: '#0d47a1',
    backgroundColor: '#42a5f5',
    textAlign: 'center',
    lineHeight: 90,
  },
  workText: {
    width: 90,
    height: 90,
    fontSize: 18,
    fontWeight: '700',
    color: '#0d47a1',
    backgroundColor: '#fff',
    textAlign: 'center',
    lineHeight: 90,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 100,
    marginLeft: 20,
  },
  notificationContainer: {
    width: 320,
    height: 180,
    backgroundColor: '#64b5f6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#0d47a1',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginTop: 20,
    elevation: 5,
  },
  notificationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
  },
  largeButton: {
    width: 210,
    height: 210,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 20,
    shadowColor: '#0d47a1',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  smallButton: {
    width: 92,
    height: 92,
    backgroundColor: '#42a5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#0d47a1',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#b0bec5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MainComponent;
