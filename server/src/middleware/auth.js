import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required' });
  try {
    const payload = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
