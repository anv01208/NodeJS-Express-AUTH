const express = require('express')
const bodyParser = require('body-parser')
const PasswdVal = require('./validation/password.validation')



const userRouter = require('./routes/user.route')

const app = express()



app.use(express.json())
app.use('/api',userRouter)



const PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server started: http://localhost:${PORT}`)
})