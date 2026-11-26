import * as userController from '../controllers/userController.js';
import express from 'express';

const userRoute = express.Router();

userRoute.get('/',          userController.getAll);
userRoute.get('/me',        userController.me);
userRoute.post('/register', userController.createAccount);
userRoute.post('/login',    userController.login);
userRoute.post('/logout',   userController.logout);

export default userRoute;
