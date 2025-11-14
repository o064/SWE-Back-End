const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// for sync errors
process.on('uncaughtException', (err) => {
  console.log("uncaughtException : shutting down...");
  console.log(err);
  process.exit(1);

})
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./db');

//  database connection
connectDB()
  .then(() => {
    console.log("Database connection successfully.");

  })
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
    process.exit(1); // Exit if DB connection fails
  });
// server listening
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// unhandledRejection global error handling 
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log("unhandledRejection : shutting down...");
  // stop accepting new requests
  server.close(() => {
    // close DB connection if you have one (example with mongoose)
    if (mongoose && mongoose.connection) {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(1); // exit with failure
      });
    } else {
      process.exit(1);
    }
  });
})
