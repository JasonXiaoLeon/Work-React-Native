import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ProfileScreen = () => {
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt');
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const user = decoded.user.split('@')[0];
        setUsername(user);

        const avatar = await SecureStore.getItemAsync('userAvatar');
        setAvatar(avatar);
      } catch (error) {
        console.error('获取用户信息时出错：', error);
      }
    };

    fetchUserData();
  }, []);

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

  const MenuItem = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: avatar || '' }} style={styles.avatar} />
        <Text style={styles.username}>{username || '加载中...'}</Text>
      </View>

      <View style={styles.section}>
        <MenuItem label="编辑资料" onPress={() => router.push('/home/profile/Edit')} />
        <MenuItem label="查看签到情况" onPress={() => router.push('/home/profile/MyCalendar')} />
        <MenuItem label="我的项目" onPress={() => router.push('/home/profile/MyProjects')} />
        <MenuItem label="我的任务" onPress={() => router.push('/home/profile/MyTasks')} />
        <MenuItem label="我的请假" onPress={() => router.push('/home/profile/MyLeaves')} />
      </View>

      <View style={styles.section}>
        <MenuItem label="设置" onPress={() => router.push('/home/profile/Settings')} />
        <MenuItem label="意见反馈" onPress={() => router.push('/home/profile/Feedback')} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    backgroundColor: '#f7f7f7',
    paddingVertical: 40,
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  username: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingHorizontal: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 18,
    color: '#999',
  },
  logoutButton: {
    marginTop: 30,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#f55',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});
