const bcrypt = require('bcryptjs');
const express = require('express');
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req: { body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; token?: any; user?: { id: any; email: any; permissionLevel: any; }; error?: unknown; }): any; new(): any; }; }; }) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, isDelete: 0 });
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '密码错误' });
    }

    const token = jwt.sign(
      { user: user.email, permissionLevel: user.permissionLevel },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        email: user.email,
        permissionLevel: user.permissionLevel,
      },
    });
  } catch (error) {
    console.error(error); // 添加这个
    return res.status(500).json({ message: '服务器错误', error });
  }
});

// 获取用户资料接口
router.get('/user', authenticateToken, async (req: { user: { user: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; avatar?: any; gender?: any; age?: any; error?: unknown; }): any; new(): any; }; }; }) => {
  try {
    const email = req.user.user;

    const user = await User.findOne({ email, isDelete: 0 });
    if (!user) {
      return res.status(404).json({ message: '用户未找到' });
    }

    const { avatar, gender, age } = user;

    return res.status(200).json({
      message: '获取用户信息成功',
      avatar,
      gender,
      age,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '服务器错误', error });
  }
});

router.put('/user', authenticateToken, async (req: { user: { user: any; }; body: { avatar?: string; gender?: string; age?: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; updatedUser?: any; error?: unknown; }): any; new(): any; }; }; }) => {
  const { avatar, gender, age } = req.body;

  try {
    const email = req.user.user;

    const user = await User.findOne({ email, isDelete: 0 });
    if (!user) {
      return res.status(404).json({ message: '用户未找到' });
    }

    if (avatar) user.avatar = avatar;
    if (gender) user.gender = gender;
    if (age) user.age = age;

    await user.save();

    return res.status(200).json({
      message: '用户资料更新成功',
      updatedUser: {
        id: user._id,
        email: user.email,
        avatar: user.avatar,
        gender: user.gender,
        age: user.age,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '服务器错误', error });
  }
});

module.exports = router;
