import { Request, Response, NextFunction } from "express";
import { AnytypeClient } from "../services/anytype";
import { ApiError } from "../utils/ApiError";

export const spaceController = {
  // Get all spaces
  getAllSpaces: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const anytype = new AnytypeClient();
      const spaces = await anytype.getSpaces();
      res.json({ success: true, data: spaces });
    } catch (error) {
      next(error);
    }
  },

  // Get space by ID
  getSpaceById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const anytype = new AnytypeClient();
      const space = await anytype.getSpace(id);
      if (!space) {
        throw new ApiError(404, "Space not found");
      }
      res.json({ success: true, data: space });
    } catch (error) {
      next(error);
    }
  },

  // Create new space
  createSpace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        throw new ApiError(400, "Space name is required");
      }
      const anytype = new AnytypeClient();
      throw new ApiError(501, "createSpace no implementado para acceso directo");
    } catch (error) {
      next(error);
    }
  },

  // Update space
  updateSpace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const anytype = new AnytypeClient();
      throw new ApiError(501, "updateSpace no implementado para acceso directo");
    } catch (error) {
      next(error);
    }
  },

  // Delete space
  deleteSpace: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const anytype = new AnytypeClient();
      await anytype.deleteSpace(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
