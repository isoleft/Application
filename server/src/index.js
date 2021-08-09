const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const passport = require('passport')

app.use(bodyParser.json({
    limit: '1MB'
}))
app.use(cors())
app.use(express.json())
app.use(require('./routes/user-route.js'))
app.use(passport.initialize())
require('./middleware/passport')(passport)

const PORT = process.env.PORT || 8081 
app.listen(PORT, () => console.log(`server started on ${PORT}`))