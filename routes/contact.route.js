import express from "express";
const router = express.Router();

import { getAllContact, deleteContact } from "../controllers/contact.controller.js";

router.get("/all", getAllContact);
 router.delete("/:id", deleteContact);

export default router;
