import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(String(process.env.MONGODB_URI), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`MongoDB connection established: ${conn.connection.host}`);
  } catch (err) {
    console.error(`DB Conn error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
