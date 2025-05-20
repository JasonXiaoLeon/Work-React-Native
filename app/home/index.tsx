import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import { API_URL } from '../../src/constants/env';

import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getInternshipInfo } from '../../src/utils/getInternshipInfo';

const MainComponent: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [internshipStartTime, setinternshipStartTime] = useState<Date | null>(null);
  const { start, end, daysLeft } = getInternshipInfo(internshipStartTime);
  const [hasWorkToday, setHasWorkToday] = useState<boolean>(false);
  const [clockIn, setClockIn] = useState<string>('null');
  const [clockOut, setClockOut] = useState<string>('null');
  const [taskList, setTaskList] = useState<string[] | null>(null);

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
        setUser(username);

        const userInfoRes = await axios.get(`${API_URL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = await axios.get(`${API_URL}/api/workflow`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });  

        if (userInfoRes.status === 200) {
          const { avatar } = userInfoRes.data;
          await SecureStore.setItemAsync('userAvatar', avatar);
          setAvatar(avatar);
        }

        if (res.status === 200) {
          const now = new Date();
          const validTasks = res.data.records.filter((task: { deadline: string | number | Date; }) => new Date(task.deadline) > new Date());
          setTaskList(validTasks);
        }

        const attendanceRes = await axios.get(`${API_URL}/api/attendance/today`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setinternshipStartTime(userInfoRes.data.internshipStartedTime)
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
    router.push('/booking');
  };

  const handleAskForLeaving = () => {
    router.push('/askForLeave');
  };

  const handleNotification = (task:any) => {

      Alert.alert(`${task.task}的截止日期是:`,new Date(task.deadline).toLocaleString())
  }
  const handleClockInOut = async () => {
    try {
      const token = await SecureStore.getItemAsync('jwt');
      if (!token) {
        console.warn('未找到 token');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/attendance/clock-in-out`,
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
  const canClockIn = hasWorkToday && clockIn === 'null';
  const canClockOut = hasWorkToday && clockIn !== 'null' && clockOut === 'null';
  const hasFinishedWork = hasWorkToday && clockIn !== 'null' && clockOut !== 'null';
  const canClockInOrOut = canClockIn || canClockOut;
  const disableClockButton = !canClockInOrOut || hasFinishedWork;

  return (
    <SafeAreaView>    
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View>
              <View>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <Text style={styles.loadingIconText}>加载头像...</Text>
                )}
              </View>
                <Text style={styles.workText}>
                  {loading ? '加载中...' : hasWorkToday ? '今天上班' : '今天休息'}
                </Text>
              </View>
            <View>
          </View>

            <View>
              <View  style={styles.welcomeText}>
                <Text style={styles.welcomeTextFont}>欢迎, </Text>
                <Text style={styles.welcomeTextFont}>{user || '用户'}</Text>
              </View>
              <View style={styles.dateContainer}>
                  <Text style={styles.label}>
                    实习日期：
                  </Text>
                  <Text style={styles.label}>
                    <Text style={styles.date}>{start} </Text>
                    <Text style={styles.date}>{end} </Text>
                  </Text>

                  {(start && end) && (
                    <Text style={styles.remaining}>（还剩 <Text style={styles.days}>{daysLeft}</Text> 天）</Text>
                  )}
              </View>
            </View>

          </View>
          <View style={styles.notificationContainer}>
          <ScrollView>
          {taskList && taskList.length > 0 ? (
            taskList.map((task: any) => (
              <TouchableOpacity key={task.id} style={styles.taskRow} onPress={() => handleNotification(task)}>
                <View style={styles.outerCircle}>
                  <View style={styles.innerCircle} />
                </View>
                <Text>{task.task}</Text>
                {/* <Text>截止日期: {new Date(task.ddl).toLocaleString()}</Text> */}
              </TouchableOpacity>
            ))
          ) : (
            <Text>没有未到期的任务</Text>
          )}
          </ScrollView>
          </View>


          <View style={styles.buttonContainer}>
            <View style={styles.rightContainer}>
              <TouchableOpacity
                style={
                  styles.smallButton
                }
                onPress={handleBooking}
              >
                <Svg viewBox="0 0 1024 1024" width={32} height={32}>
                    <Path
                      d="M746.666667 490.666667a213.333333 213.333333 0 1 1 0 426.666666 213.333333 213.333333 0 0 1 0-426.666666z m-85.333334-384a42.666667 42.666667 0 0 1 42.666667 42.666666h85.333333a128 128 0 0 1 128 128V469.333333a42.666667 42.666667 0 0 1-85.333333 0v-21.333333h-640V768a42.666667 42.666667 0 0 0 42.666667 42.666667H469.333333a42.666667 42.666667 0 0 1 0 85.333333H234.666667a128 128 0 0 1-128-128V277.333333a128 128 0 0 1 128-128h42.666666a42.666667 42.666667 0 1 1 85.333334 0h256a42.666667 42.666667 0 0 1 42.666666-42.666666z m85.333334 469.333333a128 128 0 1 0 0 256 128 128 0 0 0 0-256z m-10.666667 21.333333a32 32 0 0 1 32 32v42.666667h32a32 32 0 1 1 0 64h-64a32 32 0 0 1-31.573333-37.333333 31.914667 31.914667 0 0 1-0.426667-5.333334v-64a32 32 0 0 1 32-32z m-341.333333 64a32 32 0 1 1 0 64h-106.666667a32 32 0 1 1 0-64h106.666667z m0-128a32 32 0 1 1 0 64h-106.666667a32 32 0 1 1 0-64h106.666667z m-117.333334-298.666666h-42.666666a42.666667 42.666667 0 0 0-42.666667 42.666666v85.333334h640v-85.333334a42.666667 42.666667 0 0 0-42.666667-42.666666h-85.333333a42.666667 42.666667 0 0 1-85.333333 0h-256a42.666667 42.666667 0 1 1-85.333334 0z"
                      fill="#ffffff"
                    />
                </Svg>
                <Text style={styles.buttonText}>
                  预约
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.smallButton} onPress={handleAskForLeaving}>
              <Svg viewBox="0 0 1024 1024" width="32" height="32" fill="#ffffff">
                <Path d="M376.6784 726.4768c0-33.4848 5.2224-65.792 15.104-96.1536 9.8816-30.8736 24.4224-58.7776 42.1888-84.48 18.3808-25.8048 39.5264-48.3328 64.5632-68.2496 24.32-20.0704 52.0704-35.584 81.7152-47.6672 2.048-4.5568 3.2768-9.0624 6.0416-16.2304l4.5056-12.3392c0.6656-3.84 2.048-7.68 3.2768-10.8544 6.0416-2.048 11.264-5.2224 16.3328-9.7792 4.5568-3.84 8.4992-9.728 12.4928-16.7424 3.2768-7.1168 6.0416-17.4592 7.2704-29.6448 0.6656-9.0624 0.6656-16.7424-0.6656-23.1936-1.9456-6.4512-3.2768-11.52-6.0416-15.5136-2.6112-4.5568-6.0416-8.3968-9.8816-11.008 0-23.9104-2.048-47.104-4.5056-69.632-3.2768-20.0704-7.8336-41.216-15.104-63.1808-6.6048-21.9648-17.8688-42.5984-32.9728-60.5696-6.6048-7.68-15.7696-16.2304-26.9312-23.9104-11.264-7.68-24.32-14.848-38.7072-21.2992-14.5408-5.7856-30.208-10.9568-46.6944-14.848-16.3328-3.84-32.9728-5.888-49.9712-5.888-13.1584 0-26.9312 1.2288-41.472 3.2768-14.5408 1.9456-28.9792 5.7856-43.52 11.52-14.5408 5.7856-28.9792 14.1312-42.1376 23.9104-13.2096 9.728-25.7024 22.6816-37.4784 38.7072-11.8272 16.7424-21.1456 35.584-26.9312 56.7296-6.0416 21.2992-9.8816 41.216-12.4928 59.3408-2.048 21.9648-3.2768 43.264-3.2768 65.0752-5.2224 5.888-8.4992 11.52-11.264 17.9712-2.6112 6.4512-4.5568 13.568-5.2224 21.2992-0.6656 7.68 0.6656 16.7424 3.2768 26.5216 2.6112 10.2912 6.6048 17.4592 10.5984 22.6816 3.9936 5.2224 7.8336 9.728 11.264 12.3392 4.5568 2.6112 8.4992 4.5056 12.4928 5.888 2.6112 9.0624 6.0416 17.9712 8.4992 26.5216 2.6112 7.68 6.0416 14.848 9.8816 21.9648 3.2768 7.1168 7.8336 12.9024 12.4928 16.7424 9.8816 8.3968 19.0976 16.2304 26.9312 23.9104 7.8336 7.68 12.4928 18.7904 13.8752 31.5904 0.6656 9.7792 0.6656 17.4592 0.6656 25.1392 0 7.168-2.048 14.1312-4.5568 21.2992-3.2768 7.168-7.8336 14.1312-14.5408 21.2992-6.7072 7.1168-15.7696 14.1312-28.416 21.9648-9.8816 6.4512-21.7088 11.52-34.2016 16.1792-12.4928 4.5568-25.7024 8.3968-38.8608 12.3392-13.8752 3.84-26.9312 7.68-39.5776 11.52-12.4928 4.5568-24.32 9.728-34.8672 16.2304-10.5984 7.168-19.7632 14.848-26.9312 23.9104-7.2704 9.0624-11.8272 20.5824-14.5408 34.7648-6.0416 37.376-7.2704 67.6864-3.9936 91.4432 3.2768 23.9104 7.8336 38.0416 14.5408 42.5984 3.9936 2.6112 12.4928 5.888 25.7024 8.3968 13.2096 2.6112 29.6448 5.888 48.7424 8.3968 19.7632 3.2768 40.8064 5.888 64.5632 8.3968 23.6032 2.6112 47.5136 5.2224 71.1168 7.168 24.4224 1.9456 47.5136 3.1744 69.888 4.4032 22.3744 1.2288 42.1888 2.048 59.3408 2.048h23.1936c-13.8752-23.9104-25.1392-49.7152-32.9728-76.7488-7.8336-27.4432-11.8272-55.8592-11.8272-85.5552z" p-id="10780"></Path>
                <Path d="M959.3856 623.36c-14.5408-32.9728-34.2016-61.2352-59.3408-86.3744-24.9856-24.4224-53.9648-43.8272-87.5008-57.9584-33.6384-14.1312-69.0688-21.2992-107.4176-21.2992-38.1952 0-74.4448 7.1168-107.9296 21.2992-33.6384 14.1312-62.6176 33.4848-87.5008 57.9584-24.9856 24.4224-44.7488 53.5552-59.3408 86.3744-14.5408 32.9728-21.7088 67.6864-21.7088 105.0624s7.2704 72.2432 21.7088 105.0624c14.5408 32.9728 34.2016 61.2352 59.3408 86.3744 24.9856 24.4224 53.9648 43.8272 87.5008 57.9584 33.6384 14.1312 69.888 21.2992 107.9296 21.2992 38.0416 0 73.728-7.1168 107.4176-21.2992 33.6384-14.1312 62.6176-33.4848 87.5008-57.9584 25.1392-24.4224 44.7488-53.5552 59.3408-86.3744 14.5408-32.9728 21.7088-67.6864 21.7088-105.0624 0-37.2224-7.2704-72.0896-21.7088-105.0624z m-178.4832 224.8192c-10.5984 0-21.1456-4.096-29.1328-12.0832l-82.1248-82.432c-7.424-7.2704-12.0832-17.7152-12.0832-28.9792v-164.4032c0-22.784 18.3808-41.0624 41.0624-41.0624 22.6816 0 41.0624 18.3808 41.0624 41.0624v147.5072l70.1952 70.1952c16.6912 16.7424 16.6912 43.8784 0 60.5184-8.4992 8.4992-19.0464 12.4672-29.9392 12.4672z" p-id="10781"></Path>
              </Svg>
                <Text style={styles.buttonText}>请假</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.largeButton, disableClockButton && styles.disabledButton]} 
              onPress={handleClockInOut} 
              disabled={disableClockButton}
              >
                <Svg
                  width={64}
                  height={64}
                  viewBox="0 0 1024 1024"
                  fill="none"
                >
                  <Path
                    d="M891.259259 852.764444H132.740741c-41.813333 0-75.851852-34.038519-75.851852-75.851851V247.087407c0-41.813333 34.038519-75.851852 75.851852-75.851851h758.518518c41.813333 0 75.851852 34.038519 75.851852 75.851851v529.92c0 41.718519-34.038519 75.757037-75.851852 75.757037zM132.740741 228.124444c-10.42963 0-18.962963 8.533333-18.962963 18.962963v529.92c0 10.42963 8.533333 18.962963 18.962963 18.962963h758.518518c10.42963 0 18.962963-8.533333 18.962963-18.962963V247.087407c0-10.42963-8.533333-18.962963-18.962963-18.962963H132.740741z"
                    fill='#ffffff'
                  />
                  <Path
                    d="M308.717037 606.814815c-48.355556 0-87.608889-39.348148-87.608889-87.608889s39.348148-87.608889 87.608889-87.608889 87.608889 39.348148 87.608889 87.608889-39.253333 87.608889-87.608889 87.608889z m0-118.423704c-16.971852 0-30.72 13.842963-30.72 30.72s13.842963 30.72 30.72 30.72 30.72-13.842963 30.72-30.72-13.748148-30.72-30.72-30.72z"
                    fill='#ffffff'
                  />
                  <Path
                    d="M443.259259 761.457778c-15.739259 0-28.444444-12.705185-28.444444-28.444445 0-65.896296-47.691852-119.561481-106.382222-119.561481S201.955556 667.022222 201.955556 733.013333c0 15.739259-12.705185 28.444444-28.444445 28.444445s-28.444444-12.705185-28.444444-28.444445c0-46.648889 16.687407-90.642963 46.933333-123.828148 30.90963-33.943704 72.248889-52.622222 116.337778-52.622222s85.428148 18.678519 116.337778 52.622222c30.245926 33.185185 46.933333 77.179259 46.933333 123.828148 0.094815 15.644444-12.705185 28.444444-28.34963 28.444445zM938.666667 396.420741H85.522963c-15.739259 0-28.444444-12.705185-28.444444-28.444445s12.705185-28.444444 28.444444-28.444444H938.666667c15.739259 0 28.444444 12.705185 28.444444 28.444444s-12.705185 28.444444-28.444444 28.444445zM874.477037 488.296296H579.982222c-15.739259 0-28.444444-12.705185-28.444444-28.444444s12.705185-28.444444 28.444444-28.444445h294.494815c15.739259 0 28.444444 12.705185 28.444444 28.444445s-12.705185 28.444444-28.444444 28.444444zM866.417778 610.607407H696.50963c-15.739259 0-28.444444-12.705185-28.444445-28.444444s12.705185-28.444444 28.444445-28.444444h169.908148c15.739259 0 28.444444 12.705185 28.444444 28.444444s-12.705185 28.444444-28.444444 28.444444z"
                    fill='#ffffff'
                  />
                </Svg>
              <Text style={styles.buttonText} >
                {canClockIn ? '上班打卡' : canClockOut ? '下班打卡' : '已完成打卡'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    paddingTop: '10%',
  },
  dateContainer: {
    backgroundColor: '#fff',
    borderBottomEndRadius:20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: 150,
    height:150,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    color: '#555',
    marginRight: 4,
  },
  date: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4,
    lineHeight:26,
  },
  remaining: {
    fontSize: 14,
    color: '#FF9500',
    marginTop: 6,
  },
  days: {
    fontWeight: 'bold',
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
    width: 150,
    height: 150,
    backgroundColor: '#42a5f5',
    textAlign: 'center',
    justifyContent: 'center',
    lineHeight: 150,
    borderTopEndRadius:20,
  },
  welcomeTextFont:{
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 45,
  },
  workText: {
    width: 150,
    height: 150,
    fontSize: 18,
    fontWeight: '700',
    color: '#0d47a1',
    backgroundColor: '#fff',
    textAlign: 'center',
    lineHeight: 150,
    borderBottomStartRadius:20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderTopStartRadius: 20,
  },
  loadingIconText:{
    width: 150,
    height:150,
    lineHeight:150,
    textAlign: 'center',
  },
  notificationContainer: {
    width: 320,
    height: 180,
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#0d47a1',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginTop: 10,
    elevation: 5,
  },
  taskRow: {
    marginLeft:10,
    width:310,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-start',
    marginBottom: 8,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
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
    height: 200,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 20,
    shadowColor: '#0d47a1',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  smallButton: {
    width: 92,
    height: 92,
    backgroundColor: '#1976d2',
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
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginTop:5,
  },
});

export default MainComponent;
