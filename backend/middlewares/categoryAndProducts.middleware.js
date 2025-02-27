import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";
import { JWT_SECRET } from "../config/env.js";

const categoryAndProductsMiddleware = async (req, res, next) => {
	try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("Token:", token);

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    
    console.log("Usuario encontrado:", user);

    if (!user || user.role !== "admin") {
      console.log("Rol del usuario:", user.role);
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

		next();
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Unauthorized",
			error: error.message,
		});
	}
};

export default categoryAndProductsMiddleware;