import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    process.stdout.write(`Server running on port ${PORT}\n`);
  });
};

startServer().catch(() => {
  process.exit(1);
});
