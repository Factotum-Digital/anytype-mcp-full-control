import { Router } from "express";
import { objectController } from "../../controllers/object.controller";

export const objectRouter = Router();

// Get all objects
objectRouter.get("/", objectController.getAllObjects);

// Get object by ID
objectRouter.get("/:id", objectController.getObjectById);

// Create new object
objectRouter.post("/", objectController.createObject);

// Update object
objectRouter.patch("/:id", objectController.updateObject);

// Delete object
objectRouter.delete("/:id", objectController.deleteObject);

// Search objects
objectRouter.post("/search", objectController.searchObjects);

// Get object relations
objectRouter.get("/:id/relations", objectController.getObjectRelations);
