import axios, { AxiosInstance } from "axios";
import { config } from "../config";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/ApiError";

export interface AnytypeObject {
  id: string;
  type: string;
  spaceId: string;
  properties: Record<string, any>;
  createdDate: string;
  lastModifiedDate: string;
}

export interface CreateObjectParams {
  type: string;
  spaceId: string;
  properties: Record<string, any>;
}

export interface AnytypeSpace {
  id: string;
  name: string;
  description?: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface AnytypeType {
  id: string;
  name: string;
  spaceId: string;
  properties: Record<string, any>;
  createdDate: string;
  lastModifiedDate: string;
}

export interface AnytypeRelation {
  id: string;
  name: string;
  format: string;
  spaceId: string;
  options?: Record<string, any>;
  createdDate: string;
  lastModifiedDate: string;
}

export class AnytypeClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.anytype.apiUrl,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.anytype.apiKey}`,
      },
      timeout: 30000, // 30 seconds
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(
          `Response: ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status}`
        );
        return response;
      },
      (error) => {
        logger.error("Response error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  // Object operations
  async getObjects(spaceId?: string, type?: string): Promise<AnytypeObject[]> {
    try {
      const params: Record<string, any> = {};
      if (spaceId) params.spaceId = spaceId;
      if (type) params.type = type;

      const response = await this.client.get("/api/objects", { params });
      return response.data.objects || [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getObject(id: string): Promise<AnytypeObject | null> {
    try {
      const response = await this.client.get(`/api/objects/${id}`);
      return response.data.object || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw this.handleError(error);
    }
  }

  async createObject(params: CreateObjectParams): Promise<AnytypeObject> {
    try {
      const response = await this.client.post("/api/objects", {
        type: params.type,
        spaceId: params.spaceId,
        properties: params.properties,
      });
      return response.data.object;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateObject(id: string, properties: Record<string, any>): Promise<AnytypeObject> {
    try {
      const response = await this.client.patch(`/api/objects/${id}`, {
        properties,
      });
      return response.data.object;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteObject(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/objects/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async searchObjects(query: string, spaceId?: string, type?: string): Promise<AnytypeObject[]> {
    try {
      const response = await this.client.post("/api/objects/search", {
        query,
        spaceId,
        type,
      });
      return response.data.objects || [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getObjectRelations(objectId: string): Promise<AnytypeObject[]> {
    try {
      const response = await this.client.get(`/api/objects/${objectId}/relations`);
      return response.data.relations || [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Space operations
  async getSpaces(): Promise<AnytypeSpace[]> {
    try {
      const response = await this.client.get("/api/spaces");
      return response.data.spaces || [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getSpace(id: string): Promise<AnytypeSpace | null> {
    try {
      const response = await this.client.get(`/api/spaces/${id}`);
      return response.data.space || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw this.handleError(error);
    }
  }

  async createSpace(params: { name: string; description?: string }): Promise<AnytypeSpace> {
    try {
      const response = await this.client.post("/api/spaces", params);
      return response.data.space;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateSpace(id: string, params: { name?: string; description?: string }): Promise<AnytypeSpace> {
    try {
      const response = await this.client.patch(`/api/spaces/${id}`, params);
      return response.data.space;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteSpace(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/spaces/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Type operations
  async getTypes(spaceId?: string): Promise<AnytypeType[]> {
    try {
      const params: Record<string, any> = {};
      if (spaceId) params.spaceId = spaceId;

      const response = await this.client.get("/api/types", { params });
      return response.data.types || [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getType(id: string): Promise<AnytypeType | null> {
    try {
      const response = await this.client.get(`/api/types/${id}`);
      return response.data.type || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw this.handleError(error);
    }
  }

  async createType(params: { spaceId: string; name: string; properties?: Record<string, any> }): Promise<AnytypeType> {
    try {
      const response = await this.client.post("/api/types", params);
      return response.data.type;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateType(id: string, params: { name?: string; properties?: Record<string, any> }): Promise<AnytypeType> {
    try {
      const response = await this.client.patch(`/api/types/${id}`, params);
      return response.data.type;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteType(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/types/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Relation operations
  async getRelations(spaceId?: string): Promise<AnytypeRelation[]> {
    try {
      const params: Record<string, any> = {};
      if (spaceId) params.spaceId = spaceId;

      const response = await this.client.get("/api/relations", { params });
      return response.data.relations || [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getRelation(id: string): Promise<AnytypeRelation | null> {
    try {
      const response = await this.client.get(`/api/relations/${id}`);
      return response.data.relation || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw this.handleError(error);
    }
  }

  async createRelation(params: { spaceId: string; name: string; format: string; options?: Record<string, any> }): Promise<AnytypeRelation> {
    try {
      const response = await this.client.post("/api/relations", params);
      return response.data.relation;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateRelation(id: string, params: { name?: string; format?: string; options?: Record<string, any> }): Promise<AnytypeRelation> {
    try {
      const response = await this.client.patch(`/api/relations/${id}`, params);
      return response.data.relation;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteRelation(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/relations/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  private handleError(error: any): Error {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      const message = data?.message || error.message;

      if (status === 401) {
        return new ApiError(401, "Unauthorized - Invalid API key");
      } else if (status === 403) {
        return new ApiError(403, "Forbidden - Insufficient permissions");
      } else if (status === 404) {
        return new ApiError(404, "Resource not found");
      } else if (status === 429) {
        return new ApiError(429, "Too many requests - Rate limit exceeded");
      } else if (status >= 500) {
        return new ApiError(500, "Internal server error - Please try again later");
      } else {
        return new ApiError(status, message);
      }
    } else if (error.request) {
      // The request was made but no response was received
      return new Error("No response received from Anytype API");
    } else {
      // Something happened in setting up the request that triggered an Error
      return error;
    }
  }
}
