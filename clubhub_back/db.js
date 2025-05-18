require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app=express();
const db = mysql.createConnection(
    {
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASS,
        database:process.env.DB_NAME,
        port:process.env.DB_PORT
        
    }
);
db.connect((err)=>{
    if(err){
        console.error("Database connection failed : ",err.stack);
        return;
    }
    console.log("Connected to database");
});
module.exports = db;
