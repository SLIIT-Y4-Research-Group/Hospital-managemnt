import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const PORT = process.env.PORT || 5000;

export const mongoDBURL = process.env.MONGODB_URL || 'mongodb+srv://Dhanuka:20020502@mernapp.emyz11d.mongodb.net/?retryWrites=true&w=majority&appName=MERNApp';

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51Q9OJEP8uKMsK9jbYFLuxJ8SVKIzpoDvkbNbPYa7kPV2cDJzSDcywn3vNdD1XXO9fhMA2DYVuCEXPyNo2TxyzNIj00FhKMukLW';

// Firebase configuration
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
export const FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;


