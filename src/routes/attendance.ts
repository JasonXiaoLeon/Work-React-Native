const express = require('express');
const { jwtDecode } = require('jwt-decode');
const { Attendance } = require('../models/Attendance');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();


router.get('/', async (req: { headers: { authorization: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: string; records?: any; error?: unknown; }): any; new(): any; }; }; }) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未授权' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtDecode(token);
    const userEmail = decoded.user;

    const records = await Attendance.find({ email: userEmail })
      .select('email date clockIn clockOut -_id');
    return res.status(200).json({ records });
  } catch (error) {
    console.error('获取考勤记录失败', error);
    return res.status(401).json({ message: 'Token 无效', error });
  }
});

router.get(
  '/today',
  async (
    req: { headers: { authorization: any } },
    res: {
      status: (code: number) => {
        (): any;
        new (): any;
        json: (body: {
          message?: string;
          hasAttendanceToday?: boolean;
          clockIn?: string | null;
          clockOut?: string | null;
          error?: unknown;
        }) => any;
      };
    }
  ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwtDecode(token);
      const userEmail = decoded.user;

      const todayStr = new Date().toISOString().split('T')[0];

      const record = await Attendance.findOne({
        email: userEmail,
        date: todayStr,
      });

      if (!record) {
        return res.status(200).json({
          hasAttendanceToday: false,
          clockIn: null,
          clockOut: null,
        });
      }

      return res.status(200).json({
        hasAttendanceToday: true,
        clockIn: record.clockIn || null,
        clockOut: record.clockOut || null,
      });
    } catch (error) {
      console.error('检查今天是否有考勤记录失败', error);
      return res.status(500).json({ message: '服务器错误', error });
    }
  }
);


router.post('/booking', authenticateToken, async (req: { body: { name:any, email: any; dates: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
  try {
    const { name, email, dates } = req.body;
    console.log(email, dates)
    if (!email || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ message: '缺少 dates 参数' });
    }

    const { start, end } = getNextWeekDateRange();

    // 检查是否已有预约
    const existing = await Attendance.findOne({
      email,
      date: { $gte: start, $lte: end }
    });

    if (existing) {
      return res.status(400).json({ message: '您已经预约过下周的某一天，不能重复预约' });
    }

    const bookingDocs = dates.map(date => ({
      name,
      email,
      date,
      clockIn: 'null',
      clockOut: 'null',
    }));

    await Attendance.insertMany(bookingDocs);

    res.status(200).json({ message: '预约成功' });
  } catch (err) {
    console.error('预约出错:', err);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

function getNextWeekDateRange() {
  const today = new Date();
  const currentDay = today.getDay();
  const diffToNextMonday = currentDay === 0 ? 1 : 8 - currentDay;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + diffToNextMonday);

  const nextFriday = new Date(nextMonday);
  nextFriday.setDate(nextMonday.getDate() + 4);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return {
    start: formatDate(nextMonday),
    end: formatDate(nextFriday),
  };
}

router.post(
  '/clock-in-out',
  authenticateToken,
  async (
    req: { headers: { authorization: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: (arg0: {
          message: string;
          clockIn?: string;
          clockOut?: string;
          error?: unknown;
        }) => any;
      };
    }
  ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未授权' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwtDecode(token);
      const userEmail = decoded.user;

      const todayStr = new Date().toISOString().split('T')[0];

      let record = await Attendance.findOne({
        email: userEmail,
        date: todayStr,
      });

      const currentTime = new Intl.DateTimeFormat('en-AU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Australia/Sydney',
      }).format(new Date());

      // ⏰ 情况一：没有记录
      if (!record) {
        record = new Attendance({
          email: userEmail,
          date: todayStr,
          clockIn: currentTime,
          clockOut: 'null',
        });

        await record.save();
        return res.status(200).json({ message: '打卡上班成功', clockIn: currentTime });
      }

      if (record.clockIn === 'null') {
        record.clockIn = currentTime;
        await record.save();
        return res.status(200).json({ message: '打卡上班成功', clockIn: currentTime });
      }

      if (record.clockOut === 'null') {
        record.clockOut = currentTime;
        await record.save();
        return res.status(200).json({ message: '打卡下班成功', clockOut: currentTime });
      }

      return res.status(400).json({ message: '今天已经打卡下班，无法再打卡' });
    } catch (error) {
      console.error('打卡出错', error);
      return res.status(500).json({ message: '服务器错误', error });
    }
  }
);

module.exports = router;
