/**
 * ServiceStack API client
 */

import type { Operation } from './types.js';
import { buildQueryString } from './utils.js';

export interface ApiCallOptions {
  baseUrl: string;
  operation: Operation;
  parameters: Record<string, any>;
  bearerToken?: string;
}

/**
 * Call a ServiceStack API operation
 */
export async function callServiceStackApi(
  options: ApiCallOptions
): Promise<any> {
  const { baseUrl, operation, parameters, bearerToken } = options;
  const method = operation.method.toUpperCase();
  const requestName = operation.request.name;

  // Build the URL
  let url = `${baseUrl.replace(/\/$/, '')}/api/${requestName}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add bearer token if provided
  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }

  let fetchOptions: RequestInit = {
    method,
    headers,
  };

  // For GET and DELETE, add parameters as query string
  if (method === 'GET' || method === 'DELETE') {
    const queryString = buildQueryString(parameters);
    url += queryString;
  }
  // For POST, PUT, PATCH, send parameters in the body
  else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    fetchOptions.body = JSON.stringify(parameters);
  }

  try {
    const response = await fetch(url, fetchOptions);

    // Get response text first
    const responseText = await response.text();

    // If response is not ok, throw an error with details
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      // Try to parse error response as JSON
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.responseStatus) {
          const rs = errorData.responseStatus;
          errorMessage = rs.message || rs.errorCode || errorMessage;
          if (rs.errors && rs.errors.length > 0) {
            errorMessage += '\n' + rs.errors.map((e: any) =>
              `${e.fieldName}: ${e.message}`
            ).join('\n');
          }
        }
      } catch {
        // If not JSON, use the text as error message
        if (responseText) {
          errorMessage += `\n${responseText}`;
        }
      }

      throw new Error(errorMessage);
    }

    // Parse successful response
    if (responseText) {
      try {
        return JSON.parse(responseText);
      } catch {
        // If response is not JSON, return as text
        return responseText;
      }
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`API call failed: ${String(error)}`);
  }
}
