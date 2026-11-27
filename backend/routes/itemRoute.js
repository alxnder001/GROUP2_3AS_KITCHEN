import * as itemController from '../controllers/itemController.js';
import express from 'express';

const itemRoute = express.Router();

itemRoute.get('/',       itemController.getAll);
itemRoute.post('/',      itemController.create);
itemRoute.put('/:id',    itemController.update);
itemRoute.delete('/:id', itemController.remove);

export default itemRoute;
