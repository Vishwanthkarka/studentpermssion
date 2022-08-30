const app = require('./app');
const connectWithDb = require('./config/db');
require('dotenv').config()
const cloudinary = require('cloudinary')



//connecting with database
connectWithDb()


//cloudinary config goes here
cloudinary.config({
    cloud_name:process.env.CLOUDANARY_NAME,
    api_key:process.env.CLOUDANARY_API_KEY,
    api_secret:process.env.CLOUDANARY_API_SECRET
})

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
