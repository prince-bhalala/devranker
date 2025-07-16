import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

type ConnectionObject  = {
    isConnected?: number; 
};

const connection:ConnectionObject = {}

export default async function dbconnect() : Promise<void> {
    if (connection.isConnected) {
        console.log("DataBase is all ready concted")
        return;
    }

    try {
        const db  = await mongoose.connect(MONGODB_URI || '', {})
        connection.isConnected = db.connections[0].readyState
        console.log("DataBase Connected Sucessfully ")
    } catch (error) {
        console.error("Database connection fails : ",error)
        process.exit(1)
    }
}