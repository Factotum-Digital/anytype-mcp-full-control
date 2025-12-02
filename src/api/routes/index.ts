import { Router } from "express";
import { objectRouter } from "./object.routes";
import { spaceRouter } from "./space.routes";
import { typeRouter } from "./type.routes";
import { relationRouter } from "./relation.routes";
import { authMiddleware } from "../../middleware/auth";

export const apiRouter = Router();

// Apply auth middleware to all API routes
apiRouter.use(authMiddleware);

// API routes
apiRouter.use("/objects", objectRouter);
apiRouter.use("/spaces", spaceRouter);
apiRouter.use("/types", typeRouter);
apiRouter.use("/relations", relationRouter);

// API documentation route
apiRouter.get("/docs", (_req, res) => {
  res.json({
    message: "API Documentation",
    endpoints: {
      objects: {
        GET: "/api/objects",
        POST: "/api/objects",
        GET_ONE: "/api/objects/:id",
        UPDATE: "/api/objects/:id",
        DELETE: "/api/objects/:id",
      },
      spaces: {
        GET: "/api/spaces",
        GET_ONE: "/api/spaces/:id",
      },
      types: {
        GET: "/api/types",
        GET_ONE: "/api/types/:id",
      },
      relations: {
        GET: "/api/relations",
        GET_ONE: "/api/relations/:id",
      },
    },
  });
});
