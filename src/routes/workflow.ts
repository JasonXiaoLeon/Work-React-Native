const express = require('express');
const { jwtDecode } = require('jwt-decode');
const { Todo } = require('../models/TodoList');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req: { headers: { authorization: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: string; records?: any; error?: unknown; }): any; new(): any; }; }; }) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未授权' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtDecode(token);
    const userEmail = decoded.user;
    const records = await Todo.find({ email: userEmail })
      .select('email task createAt deadline -_id');
    return res.status(200).json({ records });
  } catch (error) {
    console.error('获取考勤记录失败', error);
    return res.status(401).json({ message: 'Token 无效', error });
  }
});

module.exports = router;
