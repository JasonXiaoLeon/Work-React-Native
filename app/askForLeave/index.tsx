import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import GoBackBTN from '../../components/GoBackBTN/GoBackBTN';

const LeaveRequestForm = () => {
  const [leaveType, setLeaveType] = useState('事假');
  const [showPickerModal, setShowPickerModal] = useState(false);

  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [reason, setReason] = useState('');

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  const handleSubmit = () => {
    if (!startDate || !endDate || !reason) {
      Alert.alert('请填写完整的信息');
      return;
    }

    if (endDate < startDate) {
      Alert.alert('结束时间不能早于开始时间');
      return;
    }

    console.log({ leaveType, startDate, endDate, reason });

    Alert.alert('请假申请已提交！');
    setStartDate(null);
    setEndDate(null);
    setReason('');
    setLeaveType('事假');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <GoBackBTN />
        <Text style={styles.title}>请假申请表</Text>

        <Text style={styles.label}>请假类型</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowPickerModal(true)}>
          <Text style={{ color: '#333' }}>{leaveType}</Text>
        </TouchableOpacity>

        {/* 请假类型 Picker Modal */}
        <Modal
          visible={showPickerModal}
          transparent
          animationType="none"
          onRequestClose={() => setShowPickerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Picker selectedValue={leaveType} onValueChange={(itemValue) => setLeaveType(itemValue)}>
                <Picker.Item label="事假" value="事假" />
                <Picker.Item label="病假" value="病假" />
                <Picker.Item label="突发情况" value="突发情况" />
                <Picker.Item label="其他" value="其他" />
              </Picker>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowPickerModal(false)}
                >
                  <Text style={styles.modalCancelText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={() => setShowPickerModal(false)}
                >
                  <Text style={styles.modalConfirmText}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Text style={styles.label}>开始时间</Text>
        <TouchableOpacity style={styles.input} onPress={() => {
          setTempDate(startDate || new Date());
          setShowStartDateModal(true);
        }}>
          <Text style={{ color: startDate ? '#333' : '#aaa' }}>
            {startDate ? formatDate(startDate) : '请选择开始时间'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>结束时间</Text>
        <TouchableOpacity style={styles.input} onPress={() => {
          setTempDate(endDate || new Date());
          setShowEndDateModal(true);
        }}>
          <Text style={{ color: endDate ? '#333' : '#aaa' }}>
            {endDate ? formatDate(endDate) : '请选择结束时间'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>请假原因</Text>
        <TextInput
          placeholder="请输入请假原因"
          value={reason}
          onChangeText={setReason}
          style={[styles.input, { height: 80 }]}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>提交申请</Text>
        </TouchableOpacity>

        {/* 开始时间 Date Picker Modal */}
        {showStartDateModal && (
          <Modal transparent animationType="none">
            <View style={styles.modalOverlay}>
              <View style={styles.centeredPickerContainer}>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setTempDate(selectedDate);
                    if (Platform.OS === 'android') {
                      setStartDate(selectedDate || new Date());
                      setShowStartDateModal(false);
                    }
                  }}
                />
                {Platform.OS === 'ios' && (
                  <View style={styles.modalButtonRow}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setShowStartDateModal(false)}
                    >
                      <Text style={styles.modalCancelText}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={() => {
                        setStartDate(tempDate);
                        setShowStartDateModal(false);
                      }}
                    >
                      <Text style={styles.modalConfirmText}>确认</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        )}

        {/* 结束时间 Date Picker Modal */}
        {showEndDateModal && (
          <Modal transparent animationType="none">
            <View style={styles.modalOverlay}>
              <View style={styles.centeredPickerContainer}>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setTempDate(selectedDate);
                    if (Platform.OS === 'android') {
                      setEndDate(selectedDate || new Date());
                      setShowEndDateModal(false);
                    }
                  }}
                />
                {Platform.OS === 'ios' && (
                  <View style={styles.modalButtonRow}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setShowEndDateModal(false)}
                    >
                      <Text style={styles.modalCancelText}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={() => {
                        setEndDate(tempDate);
                        setShowEndDateModal(false);
                      }}
                    >
                      <Text style={styles.modalConfirmText}>确认</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default LeaveRequestForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#F8F9FA',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#34495E',
    marginTop: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 32,
    alignItems: 'center',
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginHorizontal: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#3498DB',
  },
  modalCancelText: {
    color: '#555',
    fontSize: 16,
  },
  modalConfirmText: {
    color: '#fff',
    fontSize: 16,
  },
  centeredPickerContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
});
