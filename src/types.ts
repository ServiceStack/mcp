/**
 * TypeScript definitions for ServiceStack app.json metadata
 */

export interface Property {
  name: string;
  type: string;
  namespace: string;
  isValueType?: boolean;
  isPrimaryKey?: boolean;
  isEnum?: boolean;
  isRequired?: boolean;
  genericArgs?: string[];
}

export interface TypeReference {
  name: string;
  namespace: string;
  genericArgs?: string[];
}

export interface RequestDto {
  name: string;
  namespace: string;
  implements: TypeReference[];
  properties: Property[];
}

export interface ResponseDto {
  name: string;
  namespace: string;
  implements: TypeReference[];
  properties: Property[];
}

export interface Route {
  path: string;
  verbs: string;
}

export interface Operation {
  request: RequestDto;
  response: ResponseDto;
  actions: string[];
  method: string;
  returnType: TypeReference;
  routes: Route[];
  requiresAuth?: boolean;
  tags?: string[];
}

export interface TypeDefinition {
  name: string;
  namespace: string;
  genericArgs?: string[];
  implements: TypeReference[];
  isInterface?: boolean;
  isAbstract?: boolean;
  isGenericTypeDef?: boolean;
  isEnum?: boolean;
  properties?: Property[];
  enumValues?: Array<{ name: string; value?: string | number }>;
}

export interface ApiMetadata {
  namespaces: string[];
  types: TypeDefinition[];
  operations: Operation[];
}

export interface AppConfig {
  baseUrl: string;
  serviceStackVersion?: string;
  serviceName?: string;
  apiVersion?: string;
}

export interface AppMetadata {
  date?: string;
  app: AppConfig;
  api: ApiMetadata;
}

export interface CliOptions {
  configPath: string;
  tag?: string;
  apis?: string[];
}
