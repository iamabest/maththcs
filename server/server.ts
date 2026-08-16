import { createApp } from './src/app.js';
import { ENV } from './src/config/env.js';

const app = createApp();

app.listen(ENV.PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Math3D THCS Express REST API Server Started!`);
  console.log(`📡 URL: http://localhost:${ENV.PORT}/api/v1`);
  console.log(`🩺 Health Check: http://localhost:${ENV.PORT}/api/v1/health`);
  console.log(`🔐 Environment: ${ENV.NODE_ENV}`);
  console.log(`====================================================`);
});
