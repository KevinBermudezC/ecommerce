import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";
import { JWT_SECRET } from "../config/env.js";

const authMiddleware = async (req, res, next) => {
	try {
		let token;

		if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
			token = req.headers.authorization.split(" ")[1];
		} else if (req.cookies?.token) {
			token = req.cookies.token;
		}

		if(!token) return res.status(401).json({message: 'Unauthorized'});

		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await db.user.findUnique({
			where: {
				id: decoded.id,
			},
		});
		if(!user) return res.status(401).json({message: 'Unauthorized'});

		req.user = user;
				
		next();
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Unauthorized",
			error: error.message,
		});
	}
}

export default authMiddleware;