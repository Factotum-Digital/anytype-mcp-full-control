import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/ApiError";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Get API key from header
    const apiKey = req.headers["x-api-key"] || req.headers.authorization?.split(" ")[1];
    
    if (!apiKey) {
      throw new ApiError(401, "API key is required");
    }

    // Verify API key
    if (apiKey !== config.anytype.apiKey) {
      throw new ApiError(403, "Invalid API key");
    }

    // Add user to request object if needed
    // req.user = { id: "system" };

    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    next(error);
  }
};
