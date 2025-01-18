import express from 'express';
import characteristicRouter from './routes/CharacteristicRoutes';
import departmentRouter from './routes/DepartmentRoutes'
import categoryRouter from './routes/CategoryRoutes'
import productRouter from './routes/ProductRoutes'
import cartRouter from './routes/CartRoutes'
import bodyParser from 'body-parser';
import { connectDB } from './config/db';
import mongoose from 'mongoose';
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express();
app.use(bodyParser.json())
// app.use(express.json()); 

  connectDB().then(() => {
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
  }));
  console.log('Existing models:', mongoose.models);

  app.use(cookieParser());
  app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 86400000,  // 1 day
      secure: false, 
      sameSite: 'none', 
    },
  }));

app.use('/api', characteristicRouter);
app.use('/api', departmentRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.use('/api', cartRouter);

