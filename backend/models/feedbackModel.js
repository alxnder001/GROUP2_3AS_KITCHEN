import pool from '../config/db.js';

// read
export const fetch = async () => {
    const [rows] = await pool.query(
        `SELECT f.*, CONCAT(u.first_name, ' ', u.last_name) AS customer_name, o.id AS order_id
         FROM feedback f
         JOIN users u ON f.user_id = u.id
         JOIN orders o ON f.order_id = o.id
         ORDER BY f.created_at DESC`
    );
    return rows;
}

export const findFeedbackByOrderId = async (orderId) => {
    const [rows] = await pool.query(
        "SELECT * FROM feedback WHERE order_id = ?",
        [orderId]
    );
    return rows;
}

// insert
export const insert = async (feedback) => {
    const [result] = await pool.query(
        "INSERT INTO feedback (order_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
        [feedback.orderId, feedback.userId, feedback.rating, feedback.comment || null]
    );
    return result.insertId;
}

// update
export const update = async (feedback) => {
    const [result] = await pool.query(
        "UPDATE feedback SET rating = ?, comment = ? WHERE id = ?",
        [feedback.rating, feedback.comment || null, feedback.id]
    );
    return result.affectedRows;
}

// delete
export const remove = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM feedback WHERE id = ?",
        [id]
    );
    return result.affectedRows;
}
