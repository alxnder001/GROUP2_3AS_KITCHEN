import pool from '../config/db.js';

// read
export const fetch = async () => {
    const [rows] = await pool.query("SELECT * FROM items WHERE deleted = 0 ORDER BY id ASC");
    return rows;
}

export const findItemById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM items WHERE id = ?",
        [id]
    );
    return rows;
}

// insert
export const insert = async (item) => {
    const [result] = await pool.query(
        "INSERT INTO items (name, description, price, cost, available, image, is_bundle) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [item.name, item.description || '', item.price, item.cost || 0, item.available ? 1 : 0, item.image || null, item.is_bundle ? 1 : 0]
    );
    return result.insertId;
}

// update
export const update = async (item) => {
    const [result] = await pool.query(
        "UPDATE items SET name = ?, description = ?, price = ?, cost = ?, available = ?, image = ?, is_bundle = ? WHERE id = ?",
        [item.name, item.description || '', item.price, item.cost || 0, item.available ? 1 : 0, item.image || null, item.is_bundle ? 1 : 0, item.id]
    );
    return result.affectedRows;
}
