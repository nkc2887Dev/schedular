export const config = {
  MONGO: {
    URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/scheduler',
  },
  PORT: process.env.PORT || '5000',
  JWT: {
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || 10000,
    SECRET: process.env.JWT_SECRET || 'myjwtsecret',
  },
  NODE_ENV: process.env.NODE_ENV || 'development',
};
