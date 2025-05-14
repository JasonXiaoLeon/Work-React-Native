const jwt = require('jsonwebtoken');

const authenticateToken = (req: { headers: { [x: string]: any; }; user: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }, next: () => void) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ message: '未提供 token' });

  jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: 'token 无效' });

    req.user = decoded;
    next();
  });
};

module.exports = { authenticateToken };
