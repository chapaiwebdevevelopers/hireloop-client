import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string);
const db = client.db('hireloopdb');

export const auth = betterAuth({
     baseURL: process.env.BETTER_AUTH_URL, 
    // Google Authentication 
     socialProviders: {
        // google:{ 
        //     clientId: process.env.GOOGLE_CLIENT_ID as string, 
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        // }, 
    },

    // Email Authentication 
   emailAndPassword: { 
    enabled: true, 
  },
//   Mongodb client Database connection 
   database: mongodbAdapter(db, {
    client,
  }),

});