import { db } from '../utils/db.js';

export const createCategory = async (req, res, next) => {
	try {
				
		const category = await db.category.create({
			data:{
				name: req.body.name
			}
		})
		res.status(201).json({
			success: true,
			message: "Category created successfully",
			data: category
		})
	} catch (error) {
		next(error);
	}
};