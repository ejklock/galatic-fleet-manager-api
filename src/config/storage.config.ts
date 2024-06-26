import { registerAs } from '@nestjs/config';

export default registerAs('storage-config', () => {
  return {
    engine: process.env.STORAGE_DEFAULT as 'local',
    localDir: process.env.STORAGE_LOCAL_DIRECTORY,
    localUrl: process.env.STORAGE_LOCAL_URL,
  };
});
