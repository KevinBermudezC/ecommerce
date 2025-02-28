import {Router} from "express";
import { signUp,signIn,signOut,profile } from "../controllers/auth.controllers.js";
import {authLimiter} from '../config/limiter.js'
import authMiddleware from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post("/sign-up",authLimiter,signUp);

authRouter.post("/sign-in",authLimiter,signIn);

authRouter.get("/me", authMiddleware, profile);

authRouter.post("/sign-out",signOut);

export default authRouter;