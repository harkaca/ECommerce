import express , {Request, Response} from "express";
import Product from "../schemas/ProductSchema";
import {IProduct} from '../schemas/ProductSchema'
import Category from "../schemas/CategorySchema";
import Characteristic from "../schemas/CharacteristicsSchema";

const router = express.Router();

//create prodcut
router.post('/products', async (req:Request, res:Response) => {
    const {name, description, price, categoryName, characteristics, image} = req.body;

    try {
        const foundCategory = await Category.findOne({name : categoryName});
        if(!foundCategory) {
            return res.status(400).json({message: 'Category not found'});
        }

        const validCharacteristics = await Characteristic.find({'_id': {$in: characteristics }});

        if (validCharacteristics.length !== characteristics.length) {
            return res.status(400).json({ message: 'Some characteristics are invalid' });
          }
        
        const newProduct = new Product({name,
                                        description,
                                        price,
                                        category:foundCategory._id,
                                        characteristics,
                                        image
        });
        await newProduct.save();
        return res.status(201).json(newProduct);
    } catch(error) {
        console.error(error);
        return res.status(500).json({message: 'Server error'});
    }
});

//get all products
router.get('/products', async (req: Request, res: Response) => {
    try {
        const products = await Product.find().populate('category').populate('characteristics');

        return res.status(200).json(products)
    } catch(error) {
        console.error(error);
        return res.status(500).json({message: 'Server error'});
    }
});

//get a product by id
router.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const product = Product.findById(req.params.id).populate('category').populate('characteristics');
        
        if(!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        return res.status(200).json(product);
    } catch(error)
    {
        return res.status(500).json({message: 'Server error'}); 
    }
});

//add charactaristics to products

router.put('/products/:productId/characteristics', async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { characteristics } = req.body;  
  
    try {
      const characteristicsArray = Array.isArray(characteristics) ? characteristics : [characteristics];
  
      const validCharacteristics = await Characteristic.find({
        '_id': { $in: characteristicsArray }
      });
  
      if (validCharacteristics.length !== characteristicsArray.length) {
        return res.status(400).json({ message: 'Some characteristics are invalid' });
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $addToSet: { characteristics: { $each: characteristicsArray } } }, 
        { new: true }  
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  



router.get("/product/:id", async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    const product: IProduct | null = await Product.findById(productId)
      .populate("category") 
      .populate("characteristics"); 

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;