import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const filter = { owner: req.userId };
    if (req.query.status && req.query.status !== 'All') filter.status = req.query.status;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch { res.status(500).json({ message: 'Could not load tasks' }); }
});

router.post('/', async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.userId });
    res.status(201).json(task);
  } catch { res.status(400).json({ message: 'Invalid task data' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.userId }, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch { res.status(400).json({ message: 'Could not update task' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch { res.status(500).json({ message: 'Could not delete task' }); }
});

export default router;
