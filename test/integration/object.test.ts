import request from "supertest";
import { app } from "../../src/app";
import { AnytypeClient } from "../../src/services/anytype";

// Mock the AnytypeClient
jest.mock("../../src/services/anytype");

describe("Object API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/objects", () => {
    it("should return all objects", async () => {
      const mockObjects = [
        { id: "1", type: "note", spaceId: "space1", properties: { title: "Test Note" } },
        { id: "2", type: "task", spaceId: "space1", properties: { title: "Test Task" } },
      ];

      (AnytypeClient.prototype.getObjects as jest.Mock).mockResolvedValue(mockObjects);

      const res = await request(app)
        .get("/api/objects")
        .set("Authorization", "Bearer test-api-key");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockObjects);
    });
  });

  describe("POST /api/objects", () => {
    it("should create a new object", async () => {
      const newObject = { id: "3", type: "note", spaceId: "space1", properties: { title: "New Note" } };
      const createData = { type: "note", spaceId: "space1", properties: { title: "New Note" } };

      (AnytypeClient.prototype.createObject as jest.Mock).mockResolvedValue(newObject);

      const res = await request(app)
        .post("/api/objects")
        .set("Authorization", "Bearer test-api-key")
        .send(createData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(newObject);
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/objects")
        .set("Authorization", "Bearer test-api-key")
        .send({ type: "note" }); // Missing spaceId and properties

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("required");
    });
  });

  describe("GET /api/objects/:id", () => {
    it("should return an object by ID", async () => {
      const mockObject = { id: "1", type: "note", spaceId: "space1", properties: { title: "Test Note" } };

      (AnytypeClient.prototype.getObject as jest.Mock).mockResolvedValue(mockObject);

      const res = await request(app)
        .get("/api/objects/1")
        .set("Authorization", "Bearer test-api-key");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockObject);
    });

    it("should return 404 if object not found", async () => {
      (AnytypeClient.prototype.getObject as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .get("/api/objects/nonexistent")
        .set("Authorization", "Bearer test-api-key");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("not found");
    });
  });

  describe("PATCH /api/objects/:id", () => {
    it("should update an object", async () => {
      const updatedObject = { id: "1", type: "note", spaceId: "space1", properties: { title: "Updated Note" } };
      const updateData = { properties: { title: "Updated Note" } };

      (AnytypeClient.prototype.updateObject as jest.Mock).mockResolvedValue(updatedObject);

      const res = await request(app)
        .patch("/api/objects/1")
        .set("Authorization", "Bearer test-api-key")
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(updatedObject);
    });
  });

  describe("DELETE /api/objects/:id", () => {
    it("should delete an object", async () => {
      (AnytypeClient.prototype.deleteObject as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .delete("/api/objects/1")
        .set("Authorization", "Bearer test-api-key");

      expect(res.status).toBe(204);
    });
  });
});
