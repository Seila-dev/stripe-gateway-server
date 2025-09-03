import express from 'express'
import cors from 'cors'
import 'dotenv/config'

export const app = express()

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json())