/** @type { import("drizzle-kit").Config } */

export default{
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials:{
     url:'postgresql://neondb_owner:npg_YUpeCQ8ticq9@ep-misty-firefly-a57hs32q-pooler.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
  }
};
