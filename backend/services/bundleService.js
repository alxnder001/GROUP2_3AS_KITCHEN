import * as bundleModel from '../models/bundleModel.js';

const doesBundleExist = async (id) => {
    const existing = await bundleModel.findBundleById(id);
    if (existing.length > 0) {
        return { result: true, bundle: existing[0] };
    }
    return { result: false, bundle: undefined };
}

// get all with items
export const fetchAllBundles = async () => {
    const bundles = await bundleModel.fetch();
    return Promise.all(bundles.map(async (b) => ({
        ...b,
        items: await bundleModel.findBundleItems(b.id),
    })));
}

// insert
export const createBundle = async (bundle) => {
    if (!bundle.name) {
        throw new Error('Bundle name is required.');
    }

    if (!(Number(bundle.price) > 0)) {
        throw new Error('Price must be greater than 0.');
    }

    const id = await bundleModel.insert(bundle);

    if (bundle.items && bundle.items.length > 0) {
        await bundleModel.insertBundleItems(id, bundle.items);
    }

    return id;
}

// update
export const updateBundle = async (bundle) => {
    if (!bundle.name) {
        throw new Error('Bundle name is required.');
    }

    if (!(Number(bundle.price) > 0)) {
        throw new Error('Price must be greater than 0.');
    }

    const existing = await doesBundleExist(bundle.id);
    if (!existing.result) {
        throw new Error('Bundle does not exist.');
    }

    await bundleModel.update(bundle);

    // replace bundle items
    await bundleModel.deleteBundleItems(bundle.id);
    if (bundle.items && bundle.items.length > 0) {
        await bundleModel.insertBundleItems(bundle.id, bundle.items);
    }

    return 'Bundle updated.';
}

// delete
export const deleteBundle = async (id) => {
    const existing = await doesBundleExist(id);
    if (!existing.result) {
        throw new Error('Bundle does not exist.');
    }

    await bundleModel.remove(id);
    return 'Bundle removed.';
}
