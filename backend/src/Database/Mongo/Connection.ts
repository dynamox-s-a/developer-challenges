import { connect } from 'mongoose';
import 'dotenv/config';

const options = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
};

const mongo_uri = process.env.DB_URI || 'mongodb://localhost:27017';

const connectToDatabase = () => connect(mongo_uri, options);

export default connectToDatabase;
