import pool from '../config/db.js';

// read
export const fetch = async () => {
    const [rows] = await pool.query(
        "SELECT * FROM bundles WHERE deleted = 0 ORDER BY id ASC"
    );
    return rows;
}

export const findBundleById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM bundles WHERE id = ?",
        [id]
    );
    return rows;
}

export const findBundleItems = async (bundleId) => {
    const [rows] = await pool.query(
        `SELECT bi.*, i.name, i.description, i.price, i.cost
         FROM bundle_items bi
         JOIN items i ON bi.item_id = i.id
         WHERE bi.bundle_id = ?`,
        [bundleId]
    );
    return rows;
}

// insert
export const insert = async (bundle) => {
    const [result] = await pool.query(
        "INSERT INTO bundles (name, description, price, available, image) VALUES (?, ?, ?, ?, ?)",
        [bundle.name, bundle.description || '', bundle.price, bundle.available ? 1 : 0, bundle.image || null]
    );
    return result.insertId;
}

export const insertBundleItems = async (bundleId, items) => {
    const values = items.map(i => [bundleId, i.item_id, i.quantity || 1]);
    await pool.query(
        "INSERT INTO bundle_items (bundle_id, item_id, quantity) VALUES ?",
        [values]
    );
}

// update
export const update = async (bundle) => {
    const [result] = await pool.query(
        "UPDATE bundles SET name = ?, description = ?, price = ?, available = ?, image = ? WHERE id = ?",
        [bundle.name, bundle.description || '', bundle.price, bundle.available ? 1 : 0, bundle.image || null, bundle.id]
    );
    return result.affectedRows;
}

export const deleteBundleItems = async (bundleId) => {
    await pool.query(
        "DELETE FROM bundle_items WHERE bundle_id = ?",
        [bundleId]
    );
}

// delete (soft)
export const remove = async (id) => {
    const [result] = await pool.query(
        "UPDATE bundles SET deleted = 1 WHERE id = ?",
        [id]
    );
    return result.affectedRows;
}
