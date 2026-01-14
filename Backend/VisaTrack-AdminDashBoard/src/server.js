const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await config();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();