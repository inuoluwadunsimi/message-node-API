const bodyParser = require('body-parser')
const express = require('express')



const app = express()

app.use(bodyParser.urlencoded({extended:false}))




app.listen(8080)