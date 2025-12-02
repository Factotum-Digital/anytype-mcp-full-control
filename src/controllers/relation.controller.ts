import { Request, Response, NextFunction } from "express";
import { AnytypeClient } from "../services/anytype";
import { ApiError } from "../utils/ApiError";

export const relationController = {
  // Get all relations
  getAllRelations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId } = req.query;
      const anytype = new AnytypeClient();
      const relations = await anytype.getRelations(spaceId as string);
      res.json({ success: true, data: relations });
    } catch (error) {
      next(error);
    }
  },

  // Get relation by ID
  getRelationById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const anytype = new AnytypeClient();
      const relation = await anytype.getRelation(id);
      if (!relation) {
        throw new ApiError(404, "Relation not found");
      }
      res.json({ success: true, data: relation });
    } catch (error) {
      next(error);
    }
  },

  // Create new relation
  createRelation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId, name, format, options } = req.body;
      if (!spaceId || !name || !format) {
        throw new ApiError(400, "Space ID, name, and format are required");
      }
      const anytype = new AnytypeClient();
      const newRelation = await anytype.createRelation({ spaceId, name, format, options });
      res.status(201).json({ success: true, data: newRelation });
    } catch (error) {
      next(error);
    }
  },

  // Update relation
  updateRelation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, format, options } = req.body;
      const anytype = new AnytypeClient();
      const updatedRelation = await anytype.updateRelation(id, { name, format, options });
      res.json({ success: true, data: updatedRelation });
    } catch (error) {
      next(error);
    }
  },

  // Delete relation
  deleteRelation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const anytype = new AnytypeClient();
      await anytype.deleteRelation(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
