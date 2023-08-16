const mongoose = require("mongoose");
const connectDB = async () => {
  const connDB = await mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
    // useFindOneAndUpdate: false
  });

  console.log(
    `project mongodb connected to ${connDB.connection.host}`.cyan.underline.bold
  );
};



module.exports = connectDB;
