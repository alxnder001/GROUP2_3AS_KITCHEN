import * as feedbackController from '../controllers/feedbackController.js';
import express from 'express';

const feedbackRoute = express.Router();

feedbackRoute.get('/',  feedbackController.getAll);
feedbackRoute.post('/', feedbackController.submit);

export default feedbackRoute;
