// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

class Database {
    constructor() {
        if (!Database.instance) {
            this.connect();
            Database.instance = this;
        }
        return Database.instance;
    }

    async connect() {
        const mongoDBURL = process.env.MONGODB_URL || 'mongodb+srv://Dhanuka:20020502@mernapp.emyz11d.mongodb.net/?retryWrites=true&w=majority&appName=MERNApp';
        try {
            // Remove deprecated options
            await mongoose.connect(mongoDBURL);
            console.log('App connected to database');
        } catch (error) {
            console.error('Database connection error:', error);
            process.exit(1); // Exit if connection fails
        }
    }
}

// Create a single instance of the Database
const instance = new Database();
Object.freeze(instance); // Freeze the instance to prevent modification

export default instance;
