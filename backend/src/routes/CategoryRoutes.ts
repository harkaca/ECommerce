import express, {Request, Response} from 'express'
import Category from '../schemas/CategorySchema'
import Department from '../schemas/DepartmentSchema';

const router = express.Router();

router.post('/categories', async (req: Request, res: Response) => {
    const {name, description, departmentId} = req.body;

    const department = await Department.findById(departmentId);
    if(!department) {
        return res.status(400).json({message:'Department does not exist'});
    }

    const newCategory = new Category({name, description, department:departmentId});
    await newCategory.save();

    return res.status(200).json(newCategory);
});

router.get('/categories', async (req:Request, res: Response) => {
    const categories = await Category.find().populate('department');
    return res.status(200).json(categories);
});

export default router;