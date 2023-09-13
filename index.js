const express = require('express')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

const PORT = process.env.PORT | 3000
const db = require('./src/config/db')
const router = require('./src/route')

router(app)


db.connect()

app.listen(PORT)




