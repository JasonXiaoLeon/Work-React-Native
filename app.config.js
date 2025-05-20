import 'dotenv/config';

export default {
  expo: {
    name: 'Edge实习',
    slug: '你的项目slug',
    version: '1.0.0',
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};
