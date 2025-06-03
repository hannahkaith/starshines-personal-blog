// Connection to MongoDB file

const mongoose = require('mongoose');
const connectDB = async () => { // connect application to database

  try { // set some settings
    mongoose.set('strictQuery', false); // switch strictQuery off
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`); // confirmation for when the connection works!
  } catch (error) {
    console.log(error); // else, if there's an error, this will run
  }

}

module.exports = connectDB;
