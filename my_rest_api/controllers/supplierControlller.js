const supplier = require('../db/models/supplier');

exports.createSupplier = async (req, res) => {
    
  try {
    const { name } =req.body;
    const newSupplier = await supplier.create({
        name
    });

    if(!newSupplier){
        return res.status(400).json({
            status:'fail',
            message: 'Failed to create supplier'
        });
    }
    const result = newSupplier.toJSON();           

    return res.status(201).json({
        status:'success',
        data: result,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplier.findAll();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update 
exports.updateSuppliers = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const suppliers = await supplier.findByPk(id);

    if (!suppliers) {
      return res.status(404).json({
        status: 'fail',
        message: 'suppliers not found'
      });
    }

    suppliers.name = name;
    await suppliers.save();

    const result = suppliers.toJSON();

    return res.status(200).json({
      status: 'success',
      data: result
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete
exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const suppliers = await supplier.findByPk(id);

    if (!suppliers) {
      return res.status(404).json({
        status: 'fail',
        message: 'suppliers not found'
      });
    }

    await suppliers.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'suppliers deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
