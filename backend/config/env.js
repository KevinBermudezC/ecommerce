import {config} from 'dotenv';

config({path: `.env`});

export const {
	PORT,
	NODE_ENV,
	DATABASE_URL,
	JWT_SECRET, 
	JWT_EXPIRES_IN,
	FRONTEND_URL,
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET
} = process.env;