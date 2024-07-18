export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
    origin: process.env.CORS_ORIGIN || '*',
  },
});
