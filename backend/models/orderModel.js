import pool from '../config/db.js';

export const findOrderById = async (id) => {
    const [rows] = await pool.query(
        `SELECT o.*, CONCAT(u.first_name, ' ', u.last_name) AS customer_name, u.email,
                CONCAT(ru.first_name, ' ', ru.last_name) AS rider_name
         FROM orders o
         JOIN users u ON o.user_id = u.id
         LEFT JOIN riders r ON o.rider_id = r.id
         LEFT JOIN users ru ON r.user_id = ru.id
         WHERE o.id = ?`,
        [id]
    );
    return rows;
}
