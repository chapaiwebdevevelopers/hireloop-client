import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

// In dev, hot-reload re-evaluates this module and a fresh module-level
// MongoClient would replace the old one — the old topology ends up closed
// (MongoTopologyClosedError) and every auth request fails until restart.
// Cache the client on globalThis so all reloads share one connection.
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient }

const client =
  globalForMongo.mongoClient ??
  new MongoClient(process.env.BETTER_AUTH_DB_URI as string)

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client
}

const db = client.db("hireloopdb")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: true, // allow clients to pass role during sign-up
        defaultValue: "seeker",
      },
    },
  },
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
})
