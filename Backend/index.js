require("dotenv").config();
const express = require('express')
const  route  = require('./route')
const dbConnection = require('./config/dbConnection')
const app = express()
const port = 3000


dbConnection()
app.use(route)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
