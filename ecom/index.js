const express = require('express');
// const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./Config/db');
const authRoutes = require('./Routes/authRouter'); 
const CategoryRouter = require('./Routes/CategoryRouter');
const ProductRoutes = require('./Routes/ProductRoutes');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(bodyParser.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/auth/category', CategoryRouter);
app.use('/api/auth/product', ProductRoutes);


app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the TMPOTT app',
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgYellow.white);
});
