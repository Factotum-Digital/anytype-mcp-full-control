import { Request, Response, NextFunction } from "express";
import { AnytypeClient } from "../services/anytype";
import { ApiError } from "../utils/ApiError";

export const typeController = {
  // Get all types
  getAllTypes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId } = req.query;
      const anytype = new AnytypeClient();
      const types = await anytype.getTypes(spaceId as string);
      res.json({ success: true, data: types });
    } catch (error) {
      next(error);
    }
  },

  // Get type by ID
  getTypeById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const anytype = new AnytypeClient();
      const type = await anytype.getType(id);
      if (!type) {
        throw new ApiError(404, "Type not found");
      }
      res.json({ success: true, data: type });
    } catch (error) {
      next(error);
    }
  },

  // Create new type
  createType: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId, name, properties } = req.body;
      if (!spaceId || !name) {
        throw new ApiError(400, "Space ID and type name are required");
      }
      const anytype = new AnytypeClient();
      const newType = await anytype.createType({ spaceId, name, properties });
      res.status(201).json({ success: true, data: newType });
    } catch (error) {
      next(error);
    }
  },

  // Update type
  updateType: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, properties } = req.body;
      const anytype = new AnytypeClient();
      const updatedType = await anytype.updateType(id, { name, properties });
      res.json({ success: true, data: updatedType });
    } catch (error) {
      next(error);
    }
  },

  // Delete type
  deleteType: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const anytype = new AnytypeClient();
      await anytype.deleteType(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
