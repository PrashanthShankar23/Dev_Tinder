const mongoose = require("mongoose");

async function connectDb() {
  await mongoose.connect(
    "mongodb+srv://prashanth23:V6S4tE4eZ1d06E1u@namastenode.fcjtv.mongodb.net/devTinder"
  );
}

module.exports = { connectDb };
