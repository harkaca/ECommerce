import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser'; 
import Cart from '../schemas/CartSchema'; 
import { v4 as uuidv4 } from 'uuid';  
import Product from '../schemas/ProductSchema';
const router = express.Router();

//add product of 1 type to cart
router.post('/cart', async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid productId or quantity' });
  }

  const sessionId = req.cookies.sessionId || uuidv4();

  try {

    const product = await Product.findById(productId);
    if(!product) {
      return res.status(400).json({message: "product was not found"});
    }

    if(product.stock < quantity){
      return res.status(400).json({message: "not enough stock for purchase"});
    }

    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = new Cart({
        sessionId,
        products: [{ productId, quantity }],
      });
    } else {
      const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (existingProductIndex === -1) {
        cart.products.push({ productId, quantity });
      } else {
        cart.products[existingProductIndex].quantity += quantity;
      }
    }

    await cart.save();

    product.stock -= quantity;
    await product.save(); 

    if (!req.cookies.sessionId) {
      res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 86400000 }); // 1 day
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get cart
router.get('/cart', async (req: Request, res: Response) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(400).json({ message: 'No cart found for this session' });
    
  }

  try {
    const cart = await Cart.findOne({ sessionId }).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart is empty or does not exist' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// delete product from cart by id
router.delete('/cart', async (req: Request, res:Response) => {
  const { productId } = req.body;

  if(!productId) {
    res.status(400).json({message: "ProductId is not found!"});
  }

  const sessionId = req.cookies.sessionId;

  if(!sessionId) {
    return res.status(400).json({message: "There is not a cart for this session"});
  }

  try {
    const cart = await Cart.findOne({sessionId});
    if (!cart) {
      return res.status(400).json({message: "Cart does not exist"});
    }

    const productIndex = cart.products.findIndex(product => product.productId.toString() === productId);

    if(productIndex === -1) {
      return res.status(200).json({message: "Product was not found in cart"});
    }

    const product = await Product.findById(productId);
    if(!product) {
      return res.status(404).json({message: "Product was not found"});
    }

    product.stock += 1;

    if(cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    } else {
      cart.products = cart.products.filter (p => p.productId.toString() !== productId);
    }
    await cart.save();
    await product.save();

    return res.status(200).json({cart});
  } catch(error) {
      console.error(error);
      return res.status(500).json({message: "Server error"});
  }
})


export default router;
