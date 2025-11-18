const pool = require('../config/db');

const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    // Get ID from params (path parameter) or query (fallback for Insomnia)
    let id = req.params.id || req.query.id;
    
    // Handle Insomnia placeholder :id
    if (id === ':id' || id === undefined) {
      id = req.query.id;
    }
    
    if (!id || id === ':id') {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    
    // Convert to integer and validate
    id = parseInt(id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid category ID. Must be a number' });
    }

    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    // Get ID from params (path parameter) or query (fallback for Insomnia)
    let id = req.params.id || req.query.id;
    
    // Handle Insomnia placeholder :id
    if (id === ':id' || id === undefined) {
      id = req.query.id;
    }
    
    if (!id || id === ':id') {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    
    // Convert to integer and validate
    id = parseInt(id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid category ID. Must be a number' });
    }

    const { name, description } = req.body;

    // Check if category exists
    const categoryCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [id]);
    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const query = `UPDATE categories SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

const deleteCategory = async (req, res) => {
  try {
    // Get ID from params (path parameter) or query (fallback for Insomnia)
    let id = req.params.id || req.query.id;
    
    // Handle Insomnia placeholder :id
    if (id === ':id' || id === undefined) {
      id = req.query.id;
    }
    
    if (!id || id === ':id') {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    
    // Convert to integer and validate
    id = parseInt(id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid category ID. Must be a number' });
    }

    // Check if category exists
    const categoryCheck = await pool.query('SELECT id FROM categories WHERE id = $1', [id]);
    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

