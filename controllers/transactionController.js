const pool = require('../config/db');

const getAllTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.name as user_name, u.email as user_email 
       FROM transactions t 
       LEFT JOIN users u ON t.user_id = u.id 
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTransactionById = async (req, res) => {
  try {
    // Get ID from params (path parameter) or query (fallback for Insomnia)
    let id = req.params.id || req.query.id;
    
    // Handle Insomnia placeholder :id
    if (id === ':id' || id === undefined) {
      id = req.query.id;
    }
    
    if (!id || id === ':id') {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }
    
    // Convert to integer and validate
    id = parseInt(id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid transaction ID. Must be a number' });
    }

    const result = await pool.query(
      `SELECT t.*, u.name as user_name, u.email as user_email 
       FROM transactions t 
       LEFT JOIN users u ON t.user_id = u.id 
       WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get transaction by ID error:', error);
    res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { total_price, user_id } = req.body;

    if (total_price === undefined) {
      return res.status(400).json({ error: 'Total price is required' });
    }

    if (total_price < 0) {
      return res.status(400).json({ error: 'Total price must be non-negative' });
    }

    // Use authenticated user if user_id not provided
    const userId = user_id || req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if user exists and is active
    const userCheck = await pool.query('SELECT id, is_active FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!userCheck.rows[0].is_active) {
      return res.status(403).json({ error: 'User is inactive' });
    }

    const result = await pool.query(
      'INSERT INTO transactions (total_price, user_id) VALUES ($1, $2) RETURNING *',
      [total_price, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    // Get ID from params (path parameter) or query (fallback for Insomnia)
    let id = req.params.id || req.query.id;
    
    // Handle Insomnia placeholder :id
    if (id === ':id' || id === undefined) {
      id = req.query.id;
    }
    
    if (!id || id === ':id') {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }
    
    // Convert to integer and validate
    id = parseInt(id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid transaction ID. Must be a number' });
    }

    const { total_price, user_id } = req.body;

    // Check if transaction exists
    const transactionCheck = await pool.query('SELECT id FROM transactions WHERE id = $1', [id]);
    if (transactionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (total_price !== undefined) {
      if (total_price < 0) {
        return res.status(400).json({ error: 'Total price must be non-negative' });
      }
      updates.push(`total_price = $${paramCount++}`);
      values.push(total_price);
    }
    if (user_id) {
      const userCheck = await pool.query('SELECT id, is_active FROM users WHERE id = $1', [user_id]);
      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (!userCheck.rows[0].is_active) {
        return res.status(403).json({ error: 'User is inactive' });
      }
      updates.push(`user_id = $${paramCount++}`);
      values.push(user_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const query = `UPDATE transactions SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    // Get ID from params (path parameter) or query (fallback for Insomnia)
    let id = req.params.id || req.query.id;
    
    // Handle Insomnia placeholder :id
    if (id === ':id' || id === undefined) {
      id = req.query.id;
    }
    
    if (!id || id === ':id') {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }
    
    // Convert to integer and validate
    id = parseInt(id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid transaction ID. Must be a number' });
    }

    // Check if transaction exists
    const transactionCheck = await pool.query('SELECT id FROM transactions WHERE id = $1', [id]);
    if (transactionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};

