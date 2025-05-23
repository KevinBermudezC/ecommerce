import { db } from '../utils/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { JWT_SECRET, JWT_EXPIRES_IN,NODE_ENV } from '../config/env.js';

/**
 * Sign up a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - Throws an error if the user already exists or if there is an issue creating the user.
 */

export const signUp = async (req, res, next) => {
	try {
		//create new user
		const { name, email,password} = req.body;

		const existingUser = await db.user.findUnique({
			where: {
				email,
			},
		});

		if(existingUser) {
			const error = new Error("User already exists");
			error.statusCode = 409;
			throw error;
		}
		//hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		//save user to db
		const newUser = await db.user.create({
			data: {  
				name,
				email,
				password: hashedPassword,
			},
		});

		const token = jwt.sign({id: newUser.id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

		// Set token in HTTP-only cookie
		res.cookie('token', token, {
			httpOnly: true,
			secure: NODE_ENV === 'production', // Secure en producción
			sameSite: 'Strict', // Evita ataques CSRF
			maxAge: 24 * 60 * 60 * 1000, // 1 día
		});
	
		res.status(201).json({
			success: true,
			message: "User created successfully",
			data: {
				token,
				user: newUser,
			}
		});

	} catch (error) {
		next(error);
	}
};

export const signIn = async (req,res,next) => {
	try {
		const { email, password } = req.body;

		const user = await db.user.findUnique({
			where: {
				email,
			}
		});

		if(!user) {
			const error = new Error("User not found");
			error.statusCode = 404;
			throw error;
		};

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if(!isPasswordValid) {
			const error = new Error("Invalid password");
			error.statusCode = 401;
			throw error;
		}

		const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

		// Guardar el token en una cookie HTTP-only
		res.cookie("token", token, {
			httpOnly: true, // Protege contra XSS
			secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
			sameSite: "Strict", // Protección contra CSRF
			maxAge: 24 * 60 * 60 * 1000, // 1 día
		});

		res.status(200).json({
			success: true,
			message: "User signed in successfully",
			data: {
				user,
			}
		});

	} catch (error) {
		next(error);
	}
}

export const signOut = async (req, res, next) => {
	try {
		res.cookie("token", "", {
			httpOnly: true,
			expires: new Date(0), // Expira inmediatamente
		});

		res.status(200).json({
			success: true,
			message: "User signed out successfully",
		});
	} catch (error) {
		next(error);
	}
};

export const profile = async (req,res,next) => {
	try {
		const user = req.user;

		res.status(200).json({
			success: true,
			message: "User profile fetched successfully",
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
			},
		});

	} catch (error) {
		next(error);
	}
}