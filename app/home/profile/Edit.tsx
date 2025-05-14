import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month - 1, day);
};

const formatDateString = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Edit = () => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [tempBirthday, setTempBirthday] = useState<Date | null>(null);
  const [gender, setGender] = useState('未选择');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt');
        if (!token) {
          Alert.alert('未登录', '请先登录以获取用户信息');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3001/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { avatar, gender, age } = response.data;

        setAvatar(avatar || null);
        setGender(gender || '未选择');

        if (age) {
          const parsed = parseDateString(age);
          if (parsed) {
            setBirthday(parsed);
            setTempBirthday(parsed);
          }
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        Alert.alert('错误', '获取用户信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAvatarPress = () => {
    Alert.alert('点击头像', '这里可以实现上传或选择头像的功能');
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '请选择生日';
    return formatDateString(date);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempBirthday(selectedDate);
    }
  };

  const handleConfirmDate = () => {
    setBirthday(tempBirthday);
    setShowDatePicker(false);
    handleSave(tempBirthday, gender);
  };

  const handleCancelDate = () => {
    setTempBirthday(birthday);
    setShowDatePicker(false);
  };

  const handleGenderSelect = (selected: string) => {
    setGender(selected);
    setShowGenderModal(false);
    handleSave(birthday, selected);
  };

  const handleSave = async (birthdayValue: Date | null, genderValue: string) => {
    const birthdayStr = birthdayValue ? formatDateString(birthdayValue) : '';

    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Alert.alert('未登录', '请先登录');
        return;
      }

      const response = await axios.put(
        'http://localhost:3001/api/auth/user',
        {
          gender: genderValue,
          age: birthdayStr,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('保存成功');
      } else {
        Alert.alert('保存失败', '更新用户信息失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      Alert.alert('错误', '保存失败');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleAvatarPress}>
        <Image
          source={avatar ? { uri: avatar } : require('../../../assets/images/icon.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <View style={styles.field}>
        <Text style={styles.label}>生日</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text>{formatDate(birthday)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>性别</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowGenderModal(true)}>
          <Text>{gender}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="none"
        visible={showGenderModal}
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalFooter}>
            <Pressable onPress={() => handleGenderSelect('男')}>
              <Text style={styles.genderOption}>男</Text>
            </Pressable>
            <Pressable onPress={() => handleGenderSelect('女')}>
              <Text style={styles.genderOption}>女</Text>
            </Pressable>
            <Pressable onPress={() => setShowGenderModal(false)}>
              <Text style={[styles.genderOption, { color: 'red' }]}>取消</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <Modal
          transparent
          animationType="none"
          visible={showDatePicker}
          onRequestClose={handleCancelDate}
        >
          <TouchableOpacity style={styles.datePickerOverlay} onPress={handleCancelDate}>
            <View style={styles.datePickerContent} onStartShouldSetResponder={() => true}>
              <DateTimePicker
                value={tempBirthday || birthday || new Date()}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleCancelDate} style={styles.button}>
                  <Text style={styles.buttonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirmDate} style={styles.button}>
                  <Text style={styles.buttonText}>确认</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  field: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 45,
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  genderOption: {
    fontSize: 20,
    paddingVertical: 12,
    textAlign: 'center',
  },
  datePickerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  datePickerContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
