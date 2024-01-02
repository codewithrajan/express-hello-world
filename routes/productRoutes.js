const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// CRUD operations

router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.render('products', { products });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Create
router.get('/add', (req, res) => {
    res.render('addProduct');
  });

  const generateRandomProductId = () => {
    // Generate a random number between 10000000 and 99999999
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };
  
  router.post('/add', upload.array('images', 3), async (req, res) => {
    try {
      const images = req.files.map(file => ({
        data: file.buffer.toString('base64'),
        contentType: file.mimetype
      }));
  
      const newProduct = await Product.create({
        productId: generateRandomProductId(),
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        totalQuantity: req.body.totalQuantity,
        leftQuantity: req.body.leftQuantity,
        description: req.body.description,
        images: images,
      });
      res.redirect(`/products/${newProduct.productId}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

// Read
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    res.render('productDetail', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Update
// Update product form
router.get('/update/:productId', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.productId });
      res.render('updateProduct', { product });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
router.post('/update/:productId', async (req, res) => {
  try {
    await Product.findOneAndUpdate(
      { productId: req.params.productId },
      { $set: req.body },
      { new: true }
    );
    res.redirect(`/products/${req.params.productId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete
router.post('/delete/:productId', async (req, res) => {
  try {
    await Product.findOneAndDelete({ productId: req.params.productId });
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
