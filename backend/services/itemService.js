import * as itemModel from '../models/itemModel.js';

const doesItemExist = async (id) => {
    const existing = await itemModel.findItemById(id);
    if (existing.length > 0) {
        return { result: true, item: existing[0] };
    }
    return { result: false, item: undefined };
}

// get all
export const fetchAllItems = async () => {
    const items = await itemModel.fetch();
    return items;
}

// insert
export const createItem = async (item) => {
    if (!item.name) {
        throw new Error('Product name is required.');
    }

    if (!(Number(item.price) > 0)) {
        throw new Error('Price must be greater than 0.');
    }

    const id = await itemModel.insert(item);
    return id;
}

// update
export const updateItem = async (item) => {
    if (!item.name) {
        throw new Error('Product name is required.');
    }

    if (!(Number(item.price) > 0)) {
        throw new Error('Price must be greater than 0.');
    }

    const existing = await doesItemExist(item.id);
    if (!existing.result) {
        throw new Error('Product does not exist.');
    }

    const rows = await itemModel.update(item);
    return rows;
}
