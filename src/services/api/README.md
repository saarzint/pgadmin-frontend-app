# API Network Layer

This directory contains the network layer for communicating with the backend API.

## Structure

```
api/
├── client.ts              # Axios instance with interceptors
├── config.ts             # API configuration and endpoints
├── types.ts              # TypeScript types for API
├── universityService.ts  # University search service
├── index.ts              # Exports
└── README.md             # This file
```

## Configuration

Update the [.env](.env) file in the project root:

```env
VITE_API_BASE_URL=https://pgadmit-232251258466.europe-west1.run.app
```

## Usage Example

### Searching Universities

```typescript
import { universityService, ErrorHandler } from '@/services/api';

// Search for universities
try {
  const response = await universityService.searchUniversities({
    user_profile_id: 1,
    search_request: "Find universities that match my profile"
  });

  console.log('Search initiated, result ID:', response.result_id);

  // Get the results
  const results = await universityService.getResults(response.result_id);
  console.log('Universities:', results.results);

} catch (error) {
  ErrorHandler.handle(error, {
    context: 'University Search',
    onError: (message) => {
      // Show error to user (e.g., toast notification)
      console.error(message);
    }
  });
}
```

### Using in React Component

```typescript
import { useState } from 'react';
import { universityService, UniversityResult } from '@/services/api';
import { ErrorHandler } from '@/utils/errorHandler';

function UniversitySearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UniversityResult[]>([]);
  const [error, setError] = useState<string>('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const searchResponse = await universityService.searchUniversities({
        user_profile_id: 1,
        search_request: "Computer Science programs in USA"
      });

      const resultsData = await universityService.getResults(searchResponse.result_id);
      setResults(resultsData.results);

    } catch (err) {
      const errorMessage = ErrorHandler.getUserMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search Universities'}
      </button>

      {error && <div className="error">{error}</div>}

      <div>
        {results.map(university => (
          <div key={university.id}>{university.name}</div>
        ))}
      </div>
    </div>
  );
}
```

## Features

### API Client
- Automatic request/response interceptors
- Authorization token handling
- Error handling and transformation
- Request/response logging in development
- No timeout - waits indefinitely for API response

### Error Handling
- User-friendly error messages
- Automatic token cleanup on 401
- Network error detection
- Detailed error logging in development

### Type Safety
- Full TypeScript support
- Type-safe API endpoints
- Type-safe request/response data
- Runtime type checking

## Testing with cURL

```bash
# Test university search
curl -X POST "https://pgadmit-232251258466.europe-west1.run.app/search_universities" \
  -H "Content-Type: application/json" \
  -d '{"user_profile_id": 1, "search_request": "Find universities that match my profile"}'

# Get results
curl -X GET "https://pgadmit-232251258466.europe-west1.run.app/results/1"
```

## Adding New Endpoints

1. Add endpoint to [config.ts](config.ts):
```typescript
export const API_ENDPOINTS = {
  NEW_RESOURCE: {
    LIST: '/new-resource',
    DETAIL: (id: string) => `/new-resource/${id}`,
  },
};
```

2. Add types to [types.ts](types.ts):
```typescript
export interface NewResourceRequest {
  // fields
}

export interface NewResourceResponse {
  // fields
}
```

3. Create service file:
```typescript
import apiClient from './client';
import { API_ENDPOINTS } from './config';

export class NewResourceService {
  async list() {
    return await apiClient.get(API_ENDPOINTS.NEW_RESOURCE.LIST);
  }
}

export const newResourceService = new NewResourceService();
```

4. Export from [index.ts](index.ts):
```typescript
export { newResourceService } from './newResourceService';
```
