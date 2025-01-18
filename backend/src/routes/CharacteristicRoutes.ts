import express, { Request, Response } from 'express';
import Characteristic from '../schemas/CharacteristicsSchema'; 


const router = express.Router();

//reate a new characteristic
router.post('/characteristics', async (req: Request, res: Response) => {

    const { name, value } = req.body;

    try {
      const newCharacteristic = new Characteristic({
        name,
        value,
      });

      const savedCharacteristic = await newCharacteristic.save();

      res.status(201).json(savedCharacteristic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.get('/characteristics', async (req: Request, res: Response) => {
    const characteristics = await Characteristic.find();
    return res.status(200).json(characteristics);
})

export default router;
