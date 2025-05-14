import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt');
        if (!token) {
          console.warn('未找到 token');
          return;
        }

        const decoded: any = jwtDecode(token);
        const user = decoded.user.split('@')[0];
        setUsername(user);
      } catch (error) {
        console.error('获取用户信息时出错：', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    router.push('/home/profile/Edit');
  };

  const handleCheckIn = () => {
    router.push('/home/profile/MyCalendar');
  };

  const handleLogout = () => {
    Alert.alert('提示', '确定要登出吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync('jwt');
            router.replace('/login');
          } catch (e) {
            console.error('登出时出错：', e);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileContainer} onPress={handleEditProfile}>
        <Image
          source={require('../../../assets/images/icon.png')}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username || '加载中...'}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCheckIn}>
        <Text style={styles.buttonText}>查看签到情况</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f55' }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>登出</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
  },
  arrow: {
    fontSize: 24,
    color: '#888',
  },
  button: {
    padding: 15,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
