const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', authController.renderRegister);
router.post('/register', authController.register);
router.get('/login', authController.renderLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get("/forgot-password", authController.showForgotPassword);
router.post("/forgot-password", authController.forgotPassword);

router.get("/reset-password/:token", authController.showResetPassword);
router.post("/reset-password/:token", authController.resetPassword);


module.exports = router;
