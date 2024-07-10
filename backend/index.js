
const express = require('express')
const app = express()
const port = 5000
const mongoDB=require("./db")
const cors = require('cors');
//const { default: createDoc } = require('./models/Schma')
mongoDB();



app.use(cors({ origin: 'http://localhost:3000' })); 
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api',require("./Routes/CreateUser") )
app.use('/api', require("./Routes/FormRoutes")); 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})  



