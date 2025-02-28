import {Router} from "express";
import { signUp,signIn,signOut } from "../controllers/auth.controllers.js";
import {authLimiter} from '../config/limiter.js'


const authRouter = Router();


authRouter.post("/sign-up",authLimiter,signUp);

authRouter.post("/sign-in",authLimiter,signIn);

authRouter.post("/sign-out",signOut);


export default authRouter;