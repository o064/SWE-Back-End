const mongoose = require('mongoose');


// Check if the connection is already cached globally
const MONGODB_URI = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DB_PASSWORD
).replace("<USER_NAME>", process.env.DB_USERNAME);

let cached = global.mongoose;

if (!cached) {
    global.mongoose = { conn: null, promise: null };
    cached = global.mongoose;
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn; // Return the cached connection if it exists
    }

    if (!cached.promise) {
        // If a connection promise hasn't been created, create one
        cached.promise = mongoose.connect(MONGODB_URI, {

        }).then((mong) => {
            return mong;
        });
    }

    // Wait for the promise to resolve and store the actual connection object
    cached.conn = await cached.promise;
    console.log("DB Connected or Reused.");
    return cached.conn;
}

module.exports = connectDB;