import express from "express";
import {updateProfilePic,updateName, login, logout, signup,getUserById,getAllUsers, getCountUser,UpdateActiveStatus, } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);


export default router;
