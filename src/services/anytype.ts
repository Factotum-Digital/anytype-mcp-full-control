import fs from 'fs';
import path from 'path';
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
  private anytypeDataPath: string;
  private spaceStorePath: string;
  private objectStorePath: string;

  constructor() {
    this.anytypeDataPath = '/Users/wilfredy/Library/Application Support/anytype/data';
    
    const walletDirs = fs.readdirSync(this.anytypeDataPath).filter(d => 
      fs.statSync(path.join(this.anytypeDataPath, d)).isDirectory() && 
      d.length > 20
    );
    
    if (walletDirs.length === 0) {
      throw new Error('No se encontró el directorio del wallet de Anytype');
    }
    
    const walletPath = path.join(this.anytypeDataPath, walletDirs[0]);
    this.spaceStorePath = path.join(walletPath, 'spaceStoreNew');
    this.objectStorePath = path.join(walletPath, 'objectstore');
    
    logger.info(`Anytype data path: ${this.anytypeDataPath}`);
    logger.info(`Wallet path: ${walletPath}`);
  }

  async getSpaces(): Promise<AnytypeSpace[]> {
    try {
      if (!fs.existsSync(this.spaceStorePath)) {
        throw new Error('SpaceStore no encontrado');
      }

      const spaceDirs = fs.readdirSync(this.spaceStorePath);
      const spaces: AnytypeSpace[] = [];

      for (const spaceId of spaceDirs) {
        const spacePath = path.join(this.spaceStorePath, spaceId);
        if (fs.statSync(spacePath).isDirectory()) {
          const spaceInfo = this.readSpaceMetadata(spacePath);
          spaces.push({
            id: spaceId,
            name: spaceInfo.name || spaceId,
            description: spaceInfo.description,
            createdDate: spaceInfo.createdDate || new Date().toISOString(),
            lastModifiedDate: spaceInfo.lastModifiedDate || new Date().toISOString()
          });
        }
      }

      return spaces;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private readSpaceMetadata(spacePath: string): any {
    try {
      const files = fs.readdirSync(spacePath);
      const dbFile = files.find(f => f === 'store.db');
      
      if (dbFile) {
        const stats = fs.statSync(path.join(spacePath, dbFile));
        return {
          name: path.basename(spacePath),
          createdDate: stats.birthtime.toISOString(),
          lastModifiedDate: stats.mtime.toISOString()
        };
      }
    } catch (error) {
      // Ignorar errores de lectura
    }
    
    return {};
  }

  async getSpace(id: string): Promise<AnytypeSpace | null> {
    try {
      const spacePath = path.join(this.spaceStorePath, id);
      if (!fs.existsSync(spacePath)) {
        return null;
      }

      const spaceInfo = this.readSpaceMetadata(spacePath);
      return {
        id,
        name: spaceInfo.name || id,
        description: spaceInfo.description,
        createdDate: spaceInfo.createdDate || new Date().toISOString(),
        lastModifiedDate: spaceInfo.lastModifiedDate || new Date().toISOString()
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteSpace(id: string): Promise<void> {
    try {
      const spacePath = path.join(this.spaceStorePath, id);
      if (fs.existsSync(spacePath)) {
        fs.rmSync(spacePath, { recursive: true, force: true });
        logger.info(`Espacio ${id} eliminado`);
      }

      const objectPath = path.join(this.objectStorePath, id);
      if (fs.existsSync(objectPath)) {
        fs.rmSync(objectPath, { recursive: true, force: true });
        logger.info(`Objetos del espacio ${id} eliminados`);
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async clearSpaceContent(id: string): Promise<void> {
    try {
      const spacePath = path.join(this.spaceStorePath, id);
      if (fs.existsSync(spacePath)) {
        const files = fs.readdirSync(spacePath);
        files.forEach(file => {
          const filePath = path.join(spacePath, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        });
        logger.info(`Contenido del espacio ${id} eliminado`);
      }

      const objectPath = path.join(this.objectStorePath, id);
      if (fs.existsSync(objectPath)) {
        fs.rmSync(objectPath, { recursive: true, force: true });
        logger.info(`Objetos del espacio ${id} eliminados`);
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getObjects(spaceId?: string, type?: string): Promise<AnytypeObject[]> {
    try {
      if (!fs.existsSync(this.objectStorePath)) {
        return [];
      }

      const objectDirs = fs.readdirSync(this.objectStorePath);
      const objects: AnytypeObject[] = [];

      for (const objectId of objectDirs) {
        const objectPath = path.join(this.objectStorePath, objectId);
        if (fs.statSync(objectPath).isDirectory()) {
          if (spaceId && objectId !== spaceId) {
            continue;
          }

          objects.push({
            id: objectId,
            type: 'object',
            spaceId: spaceId || 'unknown',
            properties: {},
            createdDate: new Date().toISOString(),
            lastModifiedDate: new Date().toISOString()
          });
        }
      }

      return objects;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getObject(id: string): Promise<AnytypeObject | null> {
    try {
      const objectPath = path.join(this.objectStorePath, id);
      if (!fs.existsSync(objectPath)) {
        return null;
      }

      return {
        id,
        type: 'object',
        spaceId: 'unknown',
        properties: {},
        createdDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString()
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async createObject(params: CreateObjectParams): Promise<AnytypeObject> {
    throw new Error('createObject no implementado para acceso directo');
  }

  async updateObject(id: string, properties: Record<string, any>): Promise<AnytypeObject> {
    throw new Error('updateObject no implementado para acceso directo');
  }

  async deleteObject(id: string): Promise<void> {
    try {
      const objectPath = path.join(this.objectStorePath, id);
      if (fs.existsSync(objectPath)) {
        fs.rmSync(objectPath, { recursive: true, force: true });
        logger.info(`Objeto ${id} eliminado`);
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async searchObjects(query: string, spaceId?: string, type?: string): Promise<AnytypeObject[]> {
    return this.getObjects(spaceId, type);
  }

  async getObjectRelations(objectId: string): Promise<AnytypeObject[]> {
    return [];
  }

  async getTypes(spaceId?: string): Promise<AnytypeType[]> {
    try {
      return [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getType(id: string): Promise<AnytypeType | null> {
    try {
      return null;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async createType(params: { spaceId: string; name: string; properties?: Record<string, any> }): Promise<AnytypeType> {
    throw new Error('createType no implementado para acceso directo');
  }

  async updateType(id: string, params: { name?: string; properties?: Record<string, any> }): Promise<AnytypeType> {
    throw new Error('updateType no implementado para acceso directo');
  }

  async deleteType(id: string): Promise<void> {
    throw new Error('deleteType no implementado para acceso directo');
  }

  async getRelations(spaceId?: string): Promise<AnytypeRelation[]> {
    try {
      return [];
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getRelation(id: string): Promise<AnytypeRelation | null> {
    try {
      return null;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async createRelation(params: { spaceId: string; name: string; format: string; options?: Record<string, any> }): Promise<AnytypeRelation> {
    throw new Error('createRelation no implementado para acceso directo');
  }

  async updateRelation(id: string, params: { name?: string; format?: string; options?: Record<string, any> }): Promise<AnytypeRelation> {
    throw new Error('updateRelation no implementado para acceso directo');
  }

  async deleteRelation(id: string): Promise<void> {
    throw new Error('deleteRelation no implementado para acceso directo');
  }

  private handleError(error: any): Error {
    if (error.code === 'ENOENT') {
      return new ApiError(404, 'File not found', error.message);
    }
    if (error.code === 'EACCES') {
      return new ApiError(403, 'Permission denied', error.message);
    }
    
    logger.error('Anytype client error:', error);
    return new ApiError(500, 'Internal server error', error.message);
  }
}
