import { Router } from "express";
import { typeController } from "../../controllers/type.controller";

export const typeRouter = Router();

// Get all types
typeRouter.get("/", typeController.getAllTypes);

// Get type by ID
typeRouter.get("/:id", typeController.getTypeById);

// Create new type
typeRouter.post("/", typeController.createType);

// Update type
typeRouter.patch("/:id", typeController.updateType);

// Delete type
typeRouter.delete("/:id", typeController.deleteType);
