import pool from '../config/db.js';

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
