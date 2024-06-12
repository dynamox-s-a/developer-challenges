import 'dotenv/config';
import app from './app';
import connectToDatabase from './Database/Mongo/Connection';

const PORT = process.env.BE_PORT || 3001;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.log('Connection with database generated an error:\r\n');
    console.error(error);
    console.log('\r\nServer initialization cancelled');
    process.exit(0);
  });
