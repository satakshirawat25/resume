import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express()

app.use(cors())

//databse
connectDB();



//middleware
app.use(express.json())

const port = 4000

app.get('/',(req,res)=>{
    res.send("api is working")
})

app.listen(port,()=>{
    console.log(`https://localhost:${port}`)
})