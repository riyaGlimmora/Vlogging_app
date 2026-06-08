import dns from 'dns';
import mongoose from 'mongoose';

// Some networks block SRV DNS lookups; public resolvers fix querySrv ECONNREFUSED.
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(uri);
  } catch (err) {
    if (err.message?.includes('querySrv ECONNREFUSED')) {
      throw new Error(
        'MongoDB DNS lookup failed. Use Google DNS (8.8.8.8) or a standard mongodb:// URI from Atlas (not mongodb+srv://).'
      );
    }
    if (err.message?.includes('bad auth')) {
      throw new Error(
        'MongoDB authentication failed. Verify username/password in MONGO_URI and URL-encode special characters in the password.'
      );
    }
    throw err;
  }
};

export default connectDB;
