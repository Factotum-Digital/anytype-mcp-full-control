import { Request, Response, NextFunction } from "express";
import { AnytypeClient } from "../services/anytype";
import { ApiError } from "../utils/ApiError";

export const objectController = {
  // Get all objects
  getAllObjects: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId, type } = req.query;
      const anytype = new AnytypeClient();
      
      const objects = await anytype.getObjects(spaceId as string, type as string);
      res.json({ success: true, data: objects });
    } catch (error) {
      next(error);
    }
  },

  // Get object by ID
  getObjectById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const anytype = new AnytypeClient();
      
      const object = await anytype.getObject(id);
      if (!object) {
        throw new ApiError(404, "Object not found");
      }
      
      res.json({ success: true, data: object });
    } catch (error) {
      next(error);
    }
  },

  // Create new object
  createObject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, spaceId, properties } = req.body;
      
      if (!type || !spaceId || !properties) {
        throw new ApiError(400, "Type, spaceId, and properties are required");
      }
      
      const anytype = new AnytypeClient();
      const newObject = await anytype.createObject({
        type,
        spaceId,
        properties,
      });
      
      res.status(201).json({ success: true, data: newObject });
    } catch (error) {
      next(error);
    }
  },

  // Update object
  updateObject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { properties } = req.body;
      
      if (!properties) {
        throw new ApiError(400, "Properties are required for update");
      }
      
      const anytype = new AnytypeClient();
      const updatedObject = await anytype.updateObject(id, properties);
      
      res.json({ success: true, data: updatedObject });
    } catch (error) {
      next(error);
    }
  },

  // Delete object
  deleteObject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const anytype = new AnytypeClient();
      
      await anytype.deleteObject(id);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // Search objects
  searchObjects: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query, spaceId, type } = req.body;
      const anytype = new AnytypeClient();
      
      const results = await anytype.searchObjects(query, spaceId, type);
      
      res.json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  },

  // Get object relations
  getObjectRelations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const anytype = new AnytypeClient();
      
      const relations = await anytype.getObjectRelations(id);
      
      res.json({ success: true, data: relations });
    } catch (error) {
      next(error);
    }
  },
};
