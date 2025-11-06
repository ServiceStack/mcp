/**
 * Utilities for loading and filtering ServiceStack API metadata
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';
import type { AppMetadata, Operation, CliOptions } from './types.js';

/**
 * Load and parse the app.json metadata file
 */
export async function loadAppMetadata(configPath: string): Promise<AppMetadata> {
  const fullPath = resolve(configPath);
  const content = await readFile(fullPath, 'utf-8');
  const metadata = JSON.parse(content) as AppMetadata;

  if (!metadata.app || !metadata.app.baseUrl) {
    throw new Error('Invalid app.json: missing app.baseUrl');
  }

  if (!metadata.api || !metadata.api.operations) {
    throw new Error('Invalid app.json: missing api.operations');
  }

  return metadata;
}

/**
 * Filter operations based on CLI options (tag or specific API names)
 */
export function filterOperations(
  operations: Operation[],
  options: CliOptions
): Operation[] {
  let filtered = operations;

  // Filter by tag if specified
  if (options.tag) {
    filtered = filtered.filter(op =>
      op.tags && op.tags.some(tag =>
        tag.toLowerCase() === options.tag!.toLowerCase()
      )
    );
  }

  // Filter by specific API names if specified
  if (options.apis && options.apis.length > 0) {
    const apiNamesLower = options.apis.map(name => name.toLowerCase());
    filtered = filtered.filter(op =>
      apiNamesLower.includes(op.request.name.toLowerCase())
    );
  }

  return filtered;
}

/**
 * Parse command line arguments
 */
export function parseCliArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    configPath: '',
  };

  // First positional argument is the config path
  const positionalArgs = args.filter(arg => !arg.startsWith('--'));
  if (positionalArgs.length === 0) {
    throw new Error('Missing required argument: config file path');
  }
  options.configPath = positionalArgs[0];

  // Parse named arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--tag' && i + 1 < args.length) {
      options.tag = args[i + 1];
      i++;
    } else if (arg === '--apis' && i + 1 < args.length) {
      options.apis = args[i + 1].split(',').map(s => s.trim());
      i++;
    }
  }

  return options;
}

/**
 * Convert ServiceStack type to JSON Schema type
 */
export function typeToJsonSchema(typeName: string): string {
  const lowerType = typeName.toLowerCase();

  if (lowerType === 'string') return 'string';
  if (lowerType === 'int32' || lowerType === 'int64' || lowerType === 'int16' ||
      lowerType === 'byte' || lowerType === 'long' || lowerType === 'short') return 'integer';
  if (lowerType === 'double' || lowerType === 'float' || lowerType === 'decimal') return 'number';
  if (lowerType === 'boolean' || lowerType === 'bool') return 'boolean';
  if (typeName.endsWith('[]') || lowerType.startsWith('list') ||
      lowerType.startsWith('ienumerable') || lowerType.startsWith('icollection')) return 'array';
  if (lowerType.startsWith('dictionary') || lowerType.startsWith('idictionary')) return 'object';

  // Default to string for enums and unknown types
  return 'string';
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => query.append(key, String(v)));
      } else {
        query.append(key, String(value));
      }
    }
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}
