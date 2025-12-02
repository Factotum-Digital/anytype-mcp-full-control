import { Router } from "express";
import { spaceController } from "../../controllers/space.controller";

export const spaceRouter = Router();

// Get all spaces
spaceRouter.get("/", spaceController.getAllSpaces);

// Get space by ID
spaceRouter.get("/:id", spaceController.getSpaceById);

// Create new space
spaceRouter.post("/", spaceController.createSpace);

// Update space
spaceRouter.patch("/:id", spaceController.updateSpace);

// Delete space
spaceRouter.delete("/:id", spaceController.deleteSpace);
