import * as itemService from '../services/itemService.js';

export const getAll = async (req, res) => {
    try {
        const items = await itemService.fetchAllItems();
        res.status(200).json({ success: true, items });
    } catch(e) {
        console.log(e);
        res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
}

export const create = async (req, res) => {
    const { name, description, price, cost, available, image, is_bundle } = req.body;
    const item = { name, description, price, cost, available, image, is_bundle };

    try {
        const id = await itemService.createItem(item);
        res.status(200).json({
            success: true,
            message: id
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: `${e.message || "Internal Server Error"}`
        });
    }
}

export const update = async (req, res) => {
    const { name, description, price, cost, available, image, is_bundle } = req.body;
    const { id } = req.params;
    const item = { id: parseInt(id), name, description, price, cost, available, image, is_bundle };

    try {
        const updatedItem = await itemService.updateItem(item);
        res.status(200).json({
            success: true,
            message: updatedItem
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: `${e.message || "Internal Server Error"}`
        });
    }
}

export const remove = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await itemService.deleteItem(parseInt(id));
        res.status(200).json({
            success: true,
            message: deletedItem
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: `${e.message || "Internal Server Error"}`
        });
    }
}
