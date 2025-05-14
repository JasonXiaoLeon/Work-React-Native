const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  clockIn: {
    type: String,
    required: true,
  },
  clockOut: {
    type: String,
    required: true,
  },
});

// 使用 CommonJS 模块导出
const Attendance = mongoose.model('Attendance', attendanceSchema, 'attendance');

module.exports = { Attendance };
