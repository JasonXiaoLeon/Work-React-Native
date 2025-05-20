const cors = require('cors');
const express = require('express');
const connectDB = require('./lib/db');
const authRoutes = require('./routes/auth');
const workflowRoutes = require('./routes/workflow');
const attendanceRoutes = require('./routes/attendance')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/attendance', attendanceRoutes);

// 先连接数据库，再启动服务
connectDB().then(() => {
  app.listen(3001, () => console.log('Server running on port 3001'));
});
