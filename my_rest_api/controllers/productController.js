const product = require('../db/models/product');
const component = require('../db/models/component');
const productComponent  = require('../db/models/productComponent');
const sequelize = require('../config/database');
const { SELECT } = require('sequelize/lib/query-types');

// const { product, component, productComponent } = require('../db/models');

exports.createProduct = async (req, res) => {
    const {name, quantity_on_hand, components  } =req.body;
  try {
    const newProduct = await product.create({
        name:name,
        quantity_on_hand:quantity_on_hand,
    });

    if(!newProduct){
        return res.status(400).json({
            status:'fail',
            message: 'Failed to create product'
        });
    }

    const productId = newProduct.id;
    // Add components to the productcomponents table
    if (components && components.length > 0) {
      components.forEach(async componentId => {
        await productComponent.create({
          productId: productId,
          componentId: componentId,
        });
      });
    }
    

    const result = newProduct.toJSON();           

    return res.status(201).json({
        status:'success',
        data: result,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all
exports.getAllProducts = async (req, res) => {
  try {
    // const products = await product.findAll();
    // res.json(products);
    const products = await product.findAll();
    
    const promises = products.map(async (product) => {
      
      const components = await sequelize.query(
        `SELECT c.id , c.name , c.description 
         FROM productComponent pc
         INNER JOIN component c ON pc.componentId = c.id
         WHERE pc.productId = :productId`,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: { productId: product.id }
        }
      );

      product.dataValues.components = components;
      
      return product;
    });

    const productsWithComponents = await Promise.all(promises);

    res.json(productsWithComponents);
   
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update 
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, quantity_on_hand, components } = req.body;
  try {
    const prod = await product.findByPk(id);

    if (!prod) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }

    prod.name = name;
    prod.quantity_on_hand = quantity_on_hand;
    await prod.save();

    const result = prod.toJSON();

    return res.status(200).json({
      status: 'success',
      data: result
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const prod = await product.findByPk(id);

    if (!prod) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }

    await prod.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
