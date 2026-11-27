import * as bundleController from '../controllers/bundleController.js';
import express from 'express';

const bundleRoute = express.Router();

bundleRoute.get('/',       bundleController.getAll);
bundleRoute.post('/',      bundleController.create);
bundleRoute.put('/:id',    bundleController.update);
bundleRoute.delete('/:id', bundleController.remove);

export default bundleRoute;
