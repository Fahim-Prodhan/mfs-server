import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import adminProtectRoute from "../middleware/verifyAdmin.js";
import { createTransaction } from "../controllers/transaction.controller.js";
const router = express.Router();

router.post("/create-transaction", createTransaction);


export default router;
