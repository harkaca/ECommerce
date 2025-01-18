import express, { Request, Response } from 'express';
import Department from '../schemas/DepartmentSchema';

const router = express.Router();

router.post('/departments', async (req: Request, res: Response) => {
  const { name, description } = req.body;
  
  const newDepartment = new Department({ name, description });
  await newDepartment.save();
  
  return res.status(201).json(newDepartment);
});


router.get('/departments', async (req: Request, res: Response) => {
  const departments = await Department.find();
  return res.status(200).json(departments);
});

export default router;
