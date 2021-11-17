import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewURlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`successful connection on ${conn.connection.host}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export { connectDB };
