const pool = require('../config/db');

const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    // Get ID from params (path parameter) or query (fallback for Insomnia)
    let id = req.params.id || req.query.id;
    
    // Handle Insomnia placeholder :id
    if (id === ':id' || id === undefined) {
      id = req.query.id;
    }
    
    if (!id || id === ':id') {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Convert to integer and validate
    id = parseInt(id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID. Must be a number' });
    }

    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category_id } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Name, price, and stock are required' });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ error: 'Price and stock must be non-negative' });
    }

    // Check if category exists if provided
    if (category_id) {
      const categoryCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [category_id]);
      if (categoryCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    const result = await pool.query(
      'INSERT INTO products (name, price, stock, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, stock, category_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    // Get ID from params (path parameter) or query (fallback for Insomnia)
    let id = req.params.id || req.query.id;
    
    // Handle Insomnia placeholder :id
    if (id === ':id' || id === undefined) {
      id = req.query.id;
    }
    
    if (!id || id === ':id') {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Convert to integer and validate
    id = parseInt(id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID. Must be a number' });
    }

    const { name, price, stock, category_id } = req.body;

    // Check if product exists
    const productCheck = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({ error: 'Price must be non-negative' });
      }
      updates.push(`price = $${paramCount++}`);
      values.push(price);
    }
    if (stock !== undefined) {
      if (stock < 0) {
        return res.status(400).json({ error: 'Stock must be non-negative' });
      }
      updates.push(`stock = $${paramCount++}`);
      values.push(stock);
    }
    if (category_id !== undefined) {
      if (category_id !== null) {
        const categoryCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [category_id]);
        if (categoryCheck.rows.length === 0) {
          return res.status(404).json({ error: 'Category not found' });
        }
      }
      updates.push(`category_id = $${paramCount++}`);
      values.push(category_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

const deleteProduct = async (req, res) => {
  try {
    // Get ID from params (path parameter) or query (fallback for Insomnia)
    let id = req.params.id || req.query.id;
    
    // Handle Insomnia placeholder :id
    if (id === ':id' || id === undefined) {
      id = req.query.id;
    }
    
    if (!id || id === ':id') {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Convert to integer and validate
    id = parseInt(id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID. Must be a number' });
    }

    // Check if product exists
    const productCheck = await pool.query('SELECT id FROM products WHERE id = $1', [id]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

