import { connect } from 'mongoose';
import 'dotenv/config';

const options = {
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASSWORD,
  dbName: process.env.DB_NAME,
};

const mongo_uri = process.env.MONGO_URI || 'mongodb://mongodb:27017/test';

const connectToDatabase = () => connect(mongo_uri, options);

export default connectToDatabase;
