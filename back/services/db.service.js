import { MongoClient } from "mongodb"

// una sola conexion a mongo para todos los services
const client = new MongoClient(process.env.MONGO_URI || "mongodb://127.0.0.1:27017")

export const db = client.db(process.env.DB_NAME || "bodegon")
