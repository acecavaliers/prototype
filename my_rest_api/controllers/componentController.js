const sequelize = require('../config/database');
const component = require('../db/models/component');
const componentsupplier = require('../db/models/componentSupplier');

exports.createComponent = async (req, res) => {
    const { name, description, suppliers } =req.body;
  try {
    const newComponent = await component.create({
        name:name,
        description:description,
    });

    if(!newComponent){
        return res.status(400).json({
            status:'fail',
            message: 'Failed to create component'
        });
    }

    const componentId = newComponent.id;
    // Add components to the componentsupplier table
    if (suppliers && suppliers.length > 0) {
      suppliers.forEach(async suppliertId => {
        await componentsupplier.create({
          componentId: componentId,
          supplierId: suppliertId,
        });
      });
    }

    const result = newComponent.toJSON();           

    return res.status(201).json({
        status:'success',
        data: result,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get All
exports.getAllComponents = async (req, res) => {
  try {
    // const components = await component.findAll();
    // res.json(components);
    const components = await component.findAll();

    const componentsWithProducts = await Promise.all(
      components.map(async (component) => {
        const products = await sequelize.query(
          `SELECT p.id, p.name
           FROM productComponent pc
           INNER JOIN product p ON pc.productId = p.id
           WHERE pc.componentId = :componentId`,
          {
            type: sequelize.QueryTypes.SELECT,
            replacements: { componentId: component.id }
          }
        );

        component.dataValues.products = products;

        return component;
      })
    );

    const componentsWithSuppliers = await Promise.all(
      componentsWithProducts.map(async (component) => {
        const suppliers = await sequelize.query(
          `SELECT s.id, s.name
           FROM componentSupplier cs
           INNER JOIN supplier s ON cs.supplierId = s.id
           WHERE cs.componentId = :componentId`,
          {
            type: sequelize.QueryTypes.SELECT,
            replacements: { componentId: component.id }
          }
        );

        component.dataValues.suppliers = suppliers;

        return component;
      })
    );

    res.json(componentsWithSuppliers);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update 
exports.updateComponents = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const components = await component.findByPk(id);

    if (!components) {
      return res.status(404).json({
        status: 'fail',
        message: 'components not found'
      });
    }

    components.name = name;
    components.description = description;
    await components.save();

    const result = components.toJSON();

    return res.status(200).json({
      status: 'success',
      data: result
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete
exports.deleteComponent = async (req, res) => {
  const { id } = req.params;
  try {
    const components = await component.findByPk(id);

    if (!components) {
      return res.status(404).json({
        status: 'fail',
        message: 'components not found'
      });
    }

    await components.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'components deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
