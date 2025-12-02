import { Router } from "express";
import { relationController } from "../../controllers/relation.controller";

export const relationRouter = Router();

// Get all relations
relationRouter.get("/", relationController.getAllRelations);

// Get relation by ID
relationRouter.get("/:id", relationController.getRelationById);

// Create new relation
relationRouter.post("/", relationController.createRelation);

// Update relation
relationRouter.patch("/:id", relationController.updateRelation);

// Delete relation
relationRouter.delete("/:id", relationController.deleteRelation);
