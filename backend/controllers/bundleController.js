import * as bundleService from '../services/bundleService.js';

export const getAll = async (req, res) => {
    const bundles = await bundleService.fetchAllBundles();
    res.status(200).json({ success: true, bundles });
}

export const create = async (req, res) => {
    const { name, description, price, available, image, items } = req.body;
    const bundle = { name, description, price, available, image, items };

    try {
        const id = await bundleService.createBundle(bundle);
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
    const { name, description, price, available, image, items } = req.body;
    const { id } = req.params;
    const bundle = { id: parseInt(id), name, description, price, available, image, items };

    try {
        const result = await bundleService.updateBundle(bundle);
        res.status(200).json({
            success: true,
            message: result
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
        const result = await bundleService.deleteBundle(parseInt(id));
        res.status(200).json({
            success: true,
            message: result
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({
            error: `${e.message || "Internal Server Error"}`
        });
    }
}
