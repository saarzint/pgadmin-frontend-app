# PGAdmit Frontend Application - Complete Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture & Design Patterns](#architecture--design-patterns)
5. [Core Features](#core-features)
6. [Component Architecture](#component-architecture)
7. [API Integration](#api-integration)
8. [State Management](#state-management)
9. [Routing](#routing)
10. [Styling System](#styling-system)
11. [Build & Deployment](#build--deployment)
12. [Development Guidelines](#development-guidelines)

---

## Project Overview

**PGAdmit** is a comprehensive web application designed to assist graduate school applicants through their admission journey. The platform leverages AI-powered recommendations to match students with suitable universities and scholarships, while providing tools for profile management, essay writing, visa preparation, and AI-assisted counseling.

### Key Statistics
- **Total Files:** 63 TypeScript/React files
- **Source Size:** ~412KB
- **Build Time:** ~2.5s
- **Production Bundle:** ~402KB (JS), ~36KB (CSS)

---

## Tech Stack

### Core Framework & Runtime
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.1.1 | UI framework with latest concurrent features |
| **TypeScript** | 5.9.3 | Type-safe JavaScript development |
| **Vite** | 7.1.7 | Build tool and dev server |
| **Node.js** | 18+ | Runtime environment |

### Routing & Navigation
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Router DOM** | 7.9.5 | Client-side routing with BrowserRouter |

### Styling
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 4.1.16 | Utility-first CSS framework |
| **@tailwindcss/vite** | 4.1.16 | Vite integration for Tailwind |

### HTTP & API
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Axios** | 1.13.2 | Promise-based HTTP client |

### UI & Icons
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Lucide React** | 0.548.0 | Modern SVG icon library |

### Development Tools
| Technology | Version | Purpose |
|-----------|---------|---------|
| **ESLint** | 9.36.0 | Code linting and quality |
| **@vitejs/plugin-react** | 5.0.4 | React Fast Refresh support |

---

## Project Structure

```
pgadmin-frontend-app/
├── src/
│   ├── assets/                    # Static assets
│   │   ├── icons/                # SVG icons (logo, pg, ai-assistant)
│   │   └── images/               # Image assets
│   │
│   ├── components/               # Reusable UI components
│   │   ├── common/              # Shared components (Sidebar)
│   │   ├── Dashboard/           # Dashboard-specific components
│   │   ├── Universities/        # University listing components
│   │   │   ├── Header/
│   │   │   ├── UniversityCard/
│   │   │   ├── UniversitiesList/
│   │   │   └── FilterModal/
│   │   ├── Scholarships/        # Scholarship components
│   │   │   ├── Header/
│   │   │   ├── ScholarshipCard/
│   │   │   ├── ScholarshipsList/
│   │   │   ├── MetricCards/
│   │   │   ├── FilterModal/
│   │   │   └── AdditionalResources/
│   │   ├── Profile/             # Profile management components
│   │   ├── AIChat/              # AI Chat interface components
│   │   └── AdditionalResources/ # Resource page components
│   │       ├── ResourceCard/
│   │       └── CurrencyConverter/
│   │
│   ├── pages/                    # Page-level components (Route targets)
│   │   ├── Dashboard/
│   │   ├── Universities/
│   │   ├── Scholarships/
│   │   ├── Profile/
│   │   ├── AIChat/
│   │   ├── EssayCenter/
│   │   ├── VisaCenter/
│   │   └── AdditionalResources/
│   │
│   ├── services/                 # External service integrations
│   │   └── api/                 # API client and services
│   │       ├── client.ts        # Axios client with interceptors
│   │       ├── config.ts        # API configuration & endpoints
│   │       ├── types.ts         # TypeScript type definitions
│   │       ├── universityService.ts
│   │       ├── scholarshipService.ts
│   │       └── index.ts         # Barrel export
│   │
│   ├── utils/                    # Utility functions
│   │   └── errorHandler.ts     # Centralized error handling
│   │
│   ├── theme/                    # Theme configuration
│   │   └── colors.ts            # Color constants
│   │
│   ├── contants/                 # Application constants
│   │   └── menu.ts              # Navigation menu configuration
│   │
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles & Tailwind config
│
├── public/                       # Public static assets
├── dist/                         # Build output directory
│
└── Configuration Files
    ├── package.json              # Dependencies & scripts
    ├── tsconfig.json             # TypeScript configuration
    ├── vite.config.ts            # Vite build configuration
    ├── tailwind.config.ts        # Tailwind CSS configuration
    ├── eslint.config.js          # ESLint rules
    ├── vercel.json               # Vercel deployment config
    └── .env                      # Environment variables
```

---

## Architecture & Design Patterns

### 1. Component-Based Architecture

The application follows a **feature-based component organization** with clear separation of concerns:

```
Pages (Containers) → Components (Presentational) → Services (Data)
```

**Benefits:**
- Clear separation between data fetching (pages) and presentation (components)
- Reusable components across different pages
- Easy to test and maintain

### 2. Service Layer Pattern

All API interactions are abstracted into dedicated service classes:

```typescript
// Example: University Service
export class UniversityService {
  async searchUniversities(request: UniversitySearchRequest) { }
  async getResults(resultId: number) { }
  async pollResults(resultId: number, options: PollOptions) { }
  async searchAndWaitForResults(request, pollOptions) { }
}

export const universityService = new UniversityService(); // Singleton
```

**Key Features:**
- ✅ Singleton pattern for service instances
- ✅ Type-safe API calls with TypeScript
- ✅ Centralized error handling
- ✅ Automatic retry/polling mechanisms

### 3. Key Design Patterns Used

#### Singleton Pattern
```typescript
// API Client
export const apiClient = new ApiClient(API_CONFIG);

// Services
export const universityService = new UniversityService();
export const scholarshipService = new ScholarshipService();
```

#### Factory Pattern
```typescript
export const API_ENDPOINTS = {
  UNIVERSITIES: {
    SEARCH: '/search_universities',
    RESULTS: (id: number) => `/results/${id}`, // Factory function
  },
  SCHOLARSHIPS: {
    RESULTS: (userProfileId: number) => `/results/scholarships/${userProfileId}`,
  },
} as const;
```

#### Strategy Pattern
```typescript
// Configurable polling strategy
async pollResults(
  resultId: number,
  options: {
    maxAttempts?: number;    // Default: 60
    intervalMs?: number;     // Default: 5000ms
    onProgress?: (attempt, maxAttempts) => void;
  }
) { }
```

#### Observer Pattern (via React)
```typescript
// State updates trigger component re-renders
const [universities, setUniversities] = useState<UniversityData[]>([]);
useEffect(() => {
  fetchUniversities();
}, []); // Observe component mount
```

---

## Core Features

### 1. Dashboard (`/dashboard`)

**Purpose:** Central hub for overview and quick access to key metrics

**Components:**
- Welcome section with personalized greeting
- Metrics summary cards
- Applications tracking
- Deadlines management
- Scholarship recommendations preview
- University recommendations preview

**Key Functionality:**
- Real-time metrics display
- Quick navigation to detailed pages
- Summary statistics

---

### 2. University Search & Discovery (`/universities`)

**Purpose:** AI-powered university matching and recommendations

**Features:**

#### Search & Filtering
- **AI-Powered Search:** Real-time search with polling mechanism
- **Advanced Filters:**
  - University type (Public, Private, Research)
  - Country selection
  - Compatibility match threshold (0-100%)
  - Only open applications toggle

#### Sorting Options
- AI Match Score (default)
- Ranking (World/National)
- Tuition Fees (Low to High / High to Low)
- Acceptance Rate

#### University Cards Display
Each university card shows:
- University name and location
- World ranking badge
- Match percentage with visual progress bar
- Tuition fee per year
- Acceptance rate
- Program listings
- Detailed description ("Why This University Fits You")
- Requirements metadata (dynamically generated)
- Action buttons: "Apply Now" and "View Details"
- Favorite toggle

**Technical Implementation:**

```typescript
// API Integration with Polling
const fetchUniversities = async (userProfileId: number, searchRequest: string) => {
  setLoading(true);
  setLoadingProgress('Initiating search...');

  const resultsResponse = await universityService.searchAndWaitForResults(
    { user_profile_id: userProfileId, search_request: searchRequest },
    {
      maxAttempts: 60,        // Poll for 5 minutes max
      intervalMs: 5000,       // Check every 5 seconds
      onProgress: (attempt, maxAttempts) => {
        setLoadingProgress(`Fetching results... (${attempt}/${maxAttempts})`);
      },
    }
  );

  const transformedData = resultsResponse.results.map(transformUniversityData);
  setUniversities(transformedData);
};
```

**Data Transformation:**
```typescript
const transformUniversityData = (result: UniversityResult): UniversityData => {
  // Convert API format to UI format
  // - Build metadata from recommendation_metadata object
  // - Format tuition fees with localization
  // - Extract programs and requirements
  // - Calculate match percentage
};
```

---

### 3. Scholarship Search (`/scholarships`)

**Purpose:** Find and apply for scholarships with AI recommendations

**Features:**

#### Tabs Navigation
- Discover Scholarships (AI recommendations)
- My Saved (bookmarked scholarships)
- Loan Options

#### Search & Filtering
- Text search (by name or provider)
- Scholarship type filter
- Only open scholarships toggle
- Compatibility match threshold

#### Scholarship Cards Display
- Scholarship title and provider
- Tags (Merit-based, Need-based, Renewable, etc.)
- Amount awarded
- Deadline with expiry indicator
- Number of recipients
- Duration
- Eligibility criteria (multiple tags)
- Required documents checklist
- Match percentage (0-100%)
- Apply Now / View Details buttons
- Favorite toggle

**Technical Implementation:**

```typescript
// Scholarship API Integration
const fetchScholarships = async (userProfileId: number) => {
  const resultsResponse = await scholarshipService.searchAndWaitForResults(
    { user_profile_id: userProfileId },
    {
      maxAttempts: 60,
      intervalMs: 5000,
      onProgress: (attempt, maxAttempts) => {
        setLoadingProgress(`Fetching results... (${attempt}/${maxAttempts})`);
      },
    }
  );

  const transformedData = resultsResponse.results.map(transformScholarshipData);
  setScholarships(transformedData);
};
```

**Deadline Validation:**
```typescript
// Check if deadline has passed
const deadlineDate = new Date(result.deadline);
const now = new Date();
const deadlinePassed = deadlineDate < now;

// Disable "Apply Now" button if deadline passed
disabled={scholarship.deadlinePassed}
```

---

### 4. Profile Management (`/profile`)

**Purpose:** Comprehensive student profile management

**Sections:**

#### Personal Information
- Name, email, phone
- Date of birth, nationality
- Current location
- Editable profile header

#### Academic Information
- Current education level
- GPA (4.0 scale)
- Major/Field of study
- Institution name

#### Standardized Test Scores
- SAT, ACT
- TOEFL, IELTS
- GRE, GMAT
- Subject-specific tests

#### Extracurricular Activities
- Activity name and description
- Role/position
- Duration (start/end dates)
- CRUD operations (Create, Read, Update, Delete)

#### Awards & Honors
- Award title
- Issuing organization
- Date received
- Description
- CRUD operations

**Technical Features:**
- Local state management for each section
- Form validation with TypeScript types
- Edit mode toggling
- Optimistic UI updates

---

### 5. AI Chat Assistant (`/ai-chat`)

**Purpose:** Interactive AI counselor for admission guidance

**Features:**
- Real-time chat interface
- Conversation history
- Suggested questions/prompts
- File attachment support (UI ready)
- Voice input support (UI ready)
- Goal-based conversations
- Context-aware responses

**UI Components:**
- Chat message bubbles (user/assistant)
- Input field with send button
- Suggested prompts grid
- Conversation starter templates

---

### 6. Essay Center (`/essay-center`)

**Purpose:** AI-powered essay brainstorming and feedback

**Features:**

#### Essay Brainstorming
- Topic/theme input
- "Cogins" methodology support
- Tag-based idea generation
- AI-generated essay ideas

#### Essay Feedback & Analysis
- Multiple essay type support:
  - Common App essays
  - Supplemental essays
  - Scholarship essays
  - Personal statements
- AI-powered scoring (0-100)
- Categorized feedback:
  - ✅ Strengths
  - ⚠️ Areas for Improvement
  - 💡 Suggestions
  - 🎯 Key Insights

**Technical Features:**
- Real-time AI processing
- Score visualization
- Feedback categorization
- Essay version history (planned)

---

### 7. Visa Center (`/visa`)

**Purpose:** Visa application tracking and guidance

**Features:**
- Country-specific visa checklists
- Document requirement tracking
- Interview process management
- Visa application status tracking
- Deadline monitoring
- Progress visualization

**Components:**
- Checklist items with completion status
- Document upload placeholders
- Interview scheduling
- Status timeline

---

### 8. Additional Resources (`/resources`)

**Purpose:** External tools and partner services

**Resources:**

#### Document Translation
- **Provider:** RushTranslate
- **URL:** `https://rushtranslate.com?ref=pgadmit`
- **Purpose:** Professional translation services for academic documents

#### Student Loans
- **Provider:** MPower Financing
- **URL:** `https://app.mpowerfinancing.com/eligibility?utm_source=pgadmit&utm_medium=link`
- **Purpose:** Check eligibility for student financing options

#### Test Prep
- **Provider:** Affiliate partner
- **URL:** `https://imp.i384100.net/2aAenQ`
- **Purpose:** TOEFL, IELTS, GRE, GMAT preparation

#### Currency Converter
- **Provider:** Wise.com
- **Implementation:** Embedded iframe widget
- **Default:** INR → EUR conversion
- **Features:** Real-time exchange rates

**Technical Implementation:**
```typescript
// All links open in new tab with security
<a
  href={resource.url}
  target="_blank"
  rel="noopener noreferrer"
>
  {resource.title}
</a>

// Currency converter iframe
<iframe
  src="https://wise.com/gb/currency-converter/fx-widget/converter?sourceCurrency=INR&targetCurrency=EUR"
  height="490"
  width="340"
  frameBorder="0"
  allowTransparency={true}
/>
```

---

## Component Architecture

### Component Types

#### 1. Page Components (Containers)
**Location:** `/src/pages/`
**Responsibility:** Data fetching, state management, routing

**Pattern:**
```typescript
const PageComponent: React.FC = () => {
  // State management
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);

  // Data fetching
  useEffect(() => {
    fetchData();
  }, []);

  // Event handlers
  const handleAction = (id: string) => {
    // Handle action
  };

  // Render
  return (
    <div>
      {loading ? <LoadingSpinner /> : <ComponentList data={data} />}
    </div>
  );
};
```

#### 2. Feature Components
**Location:** `/src/components/[Feature]/`
**Responsibility:** Presentation, user interaction

**Pattern:**
```typescript
interface ComponentProps {
  data: DataType;
  onAction?: (id: string) => void;
}

const FeatureComponent: React.FC<ComponentProps> = ({ data, onAction }) => {
  return (
    <div className="component-container">
      {/* Render data */}
    </div>
  );
};

export default FeatureComponent;
```

#### 3. Common Components
**Location:** `/src/components/common/`
**Responsibility:** Shared UI elements

**Examples:**
- Sidebar (navigation)
- LoadingSpinner
- ErrorBoundary (planned)

### Component Organization Principles

1. **Single Responsibility:** Each component has one clear purpose
2. **Composition:** Complex components built from smaller ones
3. **Props Drilling:** Parent → Child data flow
4. **Type Safety:** All props defined with TypeScript interfaces
5. **Barrel Exports:** Clean imports via index files

**Example:**
```typescript
// /src/components/Universities/index.ts
export { default as Header } from './Header/Header';
export { default as UniversityCard } from './UniversityCard/UniversityCard';
export { default as UniversitiesList } from './UniversitiesList/UniversitiesList';
export { default as FilterModal } from './FilterModal/FilterModal';

// Usage in page
import { Header, UniversitiesList } from '../../components/Universities';
```

---

## API Integration

### API Client Architecture

**File:** `/src/services/api/client.ts`

#### ApiClient Class

```typescript
class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(config: typeof API_CONFIG) {
    this.axiosInstance = axios.create(config);
    this.setupInterceptors();
  }

  // Generic HTTP methods with type safety
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
}

export const apiClient = new ApiClient(API_CONFIG);
```

#### Request Interceptor

**Purpose:** Add authentication, logging, headers

```typescript
private setupRequestInterceptor() {
  this.axiosInstance.interceptors.request.use(
    (config) => {
      // Add auth token from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}
```

#### Response Interceptor

**Purpose:** Error handling, response transformation

```typescript
private setupResponseInterceptor() {
  this.axiosInstance.interceptors.response.use(
    (response) => response.data, // Unwrap data
    (error: AxiosError<ApiError>) => {
      // Timeout error
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout');
      }

      // Network error
      if (!error.response) {
        console.error('Network error');
      }

      // HTTP errors
      const status = error.response?.status;
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          // Redirect to login (if needed)
          break;
        case 403:
          console.error('Forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
      }

      return Promise.reject(error);
    }
  );
}
```

### Service Layer

#### University Service

**File:** `/src/services/api/universityService.ts`

```typescript
export class UniversityService {
  /**
   * Initiate university search
   */
  async searchUniversities(request: UniversitySearchRequest): Promise<UniversitySearchResponse> {
    return await apiClient.post<UniversitySearchResponse>(
      API_ENDPOINTS.UNIVERSITIES.SEARCH,
      request
    );
  }

  /**
   * Get search results by ID
   */
  async getResults(resultId: number): Promise<UniversityResultsResponse> {
    return await apiClient.get<UniversityResultsResponse>(
      API_ENDPOINTS.UNIVERSITIES.RESULTS(resultId)
    );
  }

  /**
   * Poll for results with automatic retry
   * - Polls every 5 seconds
   * - Maximum 60 attempts (5 minutes)
   * - Handles 404 errors (results not ready)
   * - Progress callback for UI updates
   */
  async pollResults(
    resultId: number,
    options: {
      maxAttempts?: number;
      intervalMs?: number;
      onProgress?: (attempt: number, maxAttempts: number) => void;
    } = {}
  ): Promise<UniversityResultsResponse> {
    const {
      maxAttempts = 60,
      intervalMs = 5000,
      onProgress,
    } = options;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        onProgress?.(attempt, maxAttempts);

        const results = await this.getResults(resultId);

        // Check if results are available
        if (results?.results?.length > 0) {
          return results;
        }

        // Wait before next poll
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
      } catch (error) {
        // 404 = results not ready yet, continue polling
        if ((error as any).status === 404 && attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, intervalMs));
          continue;
        }
        throw error;
      }
    }

    throw new Error('Polling timeout: Results not available');
  }

  /**
   * Convenience method: Search + Poll
   */
  async searchAndWaitForResults(
    request: UniversitySearchRequest,
    pollOptions?: Parameters<typeof this.pollResults>[1]
  ): Promise<UniversityResultsResponse> {
    const searchResponse = await this.searchUniversities(request);

    // Extract result ID from endpoint
    const resultId = parseInt(searchResponse.results_endpoint.split('/').pop() || '0');

    return await this.pollResults(resultId, pollOptions);
  }
}

export const universityService = new UniversityService();
```

#### Scholarship Service

**File:** `/src/services/api/scholarshipService.ts`

Similar pattern to UniversityService, but:
- Uses `user_profile_id` instead of `search_request`
- Results endpoint: `/results/scholarships/{userProfileId}`
- No `search_id` extraction needed

```typescript
async searchAndWaitForResults(
  request: ScholarshipSearchRequest,
  pollOptions?: Parameters<typeof this.pollResults>[1]
): Promise<ScholarshipResultsResponse> {
  // Initiate search
  await this.searchScholarships(request);

  // Poll using user_profile_id directly
  return await this.pollResults(request.user_profile_id, pollOptions);
}
```

### API Configuration

**File:** `/src/services/api/config.ts`

```typescript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL ||
           'https://pgadmit-232251258466.europe-west1.run.app',
  timeout: 0, // Infinite timeout for long-running AI operations
  withCredentials: false,
} as const;

export const API_ENDPOINTS = {
  UNIVERSITIES: {
    SEARCH: '/search_universities',
    RESULTS: (id: number) => `/results/${id}`,
  },
  SCHOLARSHIPS: {
    SEARCH: '/search_scholarships',
    RESULTS: (userProfileId: number) => `/results/scholarships/${userProfileId}`,
  },
} as const;
```

### Type Definitions

**File:** `/src/services/api/types.ts`

```typescript
// Request types
export interface UniversitySearchRequest {
  user_profile_id: number;
  search_request: string;
}

export interface ScholarshipSearchRequest {
  user_profile_id: number;
}

// Response types
export interface UniversityResult {
  id: number;
  university_name: string;
  location: string;
  tuition: number;
  acceptance_rate: number;
  programs: string[];
  rank_category: string;
  why_fit: string;
  search_id: number;
  user_profile_id: number;
  created_at: string;
  recommendation_metadata: {
    data_completeness: string;
    recommendation_confidence: string;
    preference_conflicts: string | null;
    search_broadened: boolean;
    missing_criteria: string | null;
  };
  source: {
    agent_output: string;
    stored_at: string;
  };
}

export interface UniversityResultsResponse {
  latest_search: {
    search_id: number;
    timestamp: string;
    has_profile_snapshot: boolean;
  };
  results: UniversityResult[];
}

// Similar patterns for Scholarship types...
```

---

## State Management

### Approach: Local State with React Hooks

**No global state library** (Redux, MobX, Zustand) is used. The application relies on:

1. **Component State** (`useState`)
2. **Side Effects** (`useEffect`)
3. **Props Drilling**
4. **URL State** (React Router)

### State Patterns

#### 1. Data Fetching State

```typescript
const Universities: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [universities, setUniversities] = useState<UniversityData[]>([]);

  const fetchUniversities = async (userProfileId: number) => {
    setLoading(true);
    setLoadingProgress('Initiating search...');

    try {
      const response = await universityService.searchAndWaitForResults(
        { user_profile_id: userProfileId },
        {
          onProgress: (attempt, maxAttempts) => {
            setLoadingProgress(`Fetching... (${attempt}/${maxAttempts})`);
          },
        }
      );

      setUniversities(response.results.map(transformData));
    } catch (error) {
      ErrorHandler.log(error, 'Universities - Fetch');
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  };

  useEffect(() => {
    fetchUniversities(1);
  }, []);

  return (
    <>
      {loading && <LoadingIndicator progress={loadingProgress} />}
      {!loading && <UniversitiesList universities={universities} />}
    </>
  );
};
```

#### 2. Form State

```typescript
const FilterModal: React.FC = () => {
  const [universityTypes, setUniversityTypes] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [compatibilityMatch, setCompatibilityMatch] = useState<number>(0);
  const [onlyOpenApplications, setOnlyOpenApplications] = useState<boolean>(false);

  const handleApplyFilters = () => {
    const filters = {
      universityTypes,
      countries,
      compatibilityMatch,
      onlyOpenApplications,
    };
    onApplyFilters(filters);
  };

  return (
    <form>
      <input
        type="checkbox"
        checked={onlyOpenApplications}
        onChange={(e) => setOnlyOpenApplications(e.target.checked)}
      />
      {/* More inputs... */}
    </form>
  );
};
```

#### 3. UI State

```typescript
const Component: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  };

  return (
    <>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
```

### State Lifting Pattern

```typescript
// Parent component manages shared state
const ParentComponent: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <ChildA onSelect={setSelectedId} />
      <ChildB selectedId={selectedId} />
    </>
  );
};

// Child A updates state
const ChildA: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  return <button onClick={() => onSelect('123')}>Select</button>;
};

// Child B reads state
const ChildB: React.FC<{ selectedId: string | null }> = ({ selectedId }) => {
  return <div>Selected: {selectedId}</div>;
};
```

---

## Routing

### Router Configuration

**File:** `/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Universities from './pages/Universities/Universities';
import Scholarships from './pages/Scholarships/Scholarships';
// ... other imports

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-white">
        {/* Persistent sidebar across all routes */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resources" element={<AdditionalResources />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/essay-center" element={<EssayCenter />} />
            <Route path="/visa" element={<VisaCenter />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
```

### Navigation with Active State

**File:** `/src/components/common/Sidebar/Sidebar.tsx`

```typescript
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <nav>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
```

### Route Guards (Planned)

```typescript
// Future implementation for protected routes
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Usage
<Route
  path="/profile"
  element={<ProtectedRoute><Profile /></ProtectedRoute>}
/>
```

---

## Styling System

### Tailwind CSS Configuration

**File:** `/src/index.css`

```css
@import "tailwindcss";

@theme {
  /* Primary Colors */
  --color-primary-darkest: #070529;
  --color-primary-dark: #030287;
  --color-primary: #5B6BFF;
  --color-primary-light: #A9C7FF;
  --color-primary-lightest: #F3F6FF;

  /* Secondary Colors */
  --color-secondary: #EF6B5C;
  --color-secondary-light: #FFC5BD;

  /* Neutral Colors */
  --color-neutral-darkest: #414141;
  --color-neutral-dark: #727272;
  --color-neutral-gray: #9E9E9E;
  --color-neutral-light: #BDBDBD;
  --color-neutral-lightest: #E0E0E0;

  /* Error States */
  --color-error-dark: #CE0B0B;
  --color-error: #FF3838;
  --color-error-light: #FFA4A4;

  /* Gradients */
  --color-gradient-blue: #A9C7FF;
  --color-gradient-cyan: #8DF8E7;
  --color-gradient-pink: #E8506A;
  --color-gradient-orange: #EF6B5C;
  --color-gradient-purple: #C682FB;
  --color-gradient-yellow: #F8E88D;
}

/* Custom utilities */
.gradient-primary {
  background: linear-gradient(135deg, var(--color-gradient-blue) 0%, var(--color-gradient-cyan) 100%);
}

.gradient-warm {
  background: linear-gradient(90deg, var(--color-gradient-orange) 0%, var(--color-gradient-pink) 100%);
}

/* Custom range slider */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
```

### Theme Constants (JavaScript)

**File:** `/src/theme/colors.ts`

```typescript
export const colors = {
  primary: {
    darkest: '#070529',
    dark: '#030287',
    default: '#5B6BFF',
    light: '#A9C7FF',
    lightest: '#F3F6FF',
  },
  secondary: {
    default: '#EF6B5C',
    light: '#FFC5BD',
  },
  neutral: {
    darkest: '#414141',
    dark: '#727272',
    gray: '#9E9E9E',
    light: '#BDBDBD',
    lightest: '#E0E0E0',
  },
  error: {
    dark: '#CE0B0B',
    default: '#FF3838',
    light: '#FFA4A4',
  },
  gradients: {
    blue: '#A9C7FF',
    cyan: '#8DF8E7',
    pink: '#E8506A',
    orange: '#EF6B5C',
    purple: '#C682FB',
    yellow: '#F8E88D',
  },
};
```

### Styling Patterns

#### 1. Responsive Design

```tsx
<div className="
  grid
  grid-cols-1          /* Mobile: 1 column */
  md:grid-cols-2       /* Tablet: 2 columns */
  lg:grid-cols-3       /* Desktop: 3 columns */
  gap-4
">
  {/* Content */}
</div>
```

#### 2. Conditional Styling

```tsx
<button
  className={`
    px-6 py-2 rounded-lg font-semibold
    ${isActive
      ? 'bg-primary text-white'
      : 'bg-gray-100 text-gray-700'
    }
    hover:shadow-lg transition-all
  `}
>
  {label}
</button>
```

#### 3. Dynamic Styles (Inline)

```tsx
<div
  style={{
    background: `linear-gradient(90deg, ${colors.gradients.orange} 0%, ${colors.gradients.pink} 100%)`,
    width: `${percentage}%`,
  }}
>
  {/* Content */}
</div>
```

#### 4. Tailwind Utilities

```tsx
{/* Spacing */}
className="p-4 m-2 space-y-4 gap-6"

{/* Layout */}
className="flex items-center justify-between"

{/* Typography */}
className="text-lg font-bold text-primary-darkest"

{/* Borders */}
className="border border-gray-200 rounded-xl"

{/* Shadows */}
className="shadow-sm hover:shadow-md"

{/* Transitions */}
className="transition-all duration-300 ease-in-out"

{/* Responsive */}
className="w-full lg:w-1/2"
```

---

## Build & Deployment

### Build Configuration

**Vite Config** (`vite.config.ts`):

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),        // React support with Fast Refresh
    tailwindcss(),  // Tailwind CSS integration
  ],
});
```

**TypeScript Config** (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### NPM Scripts

```json
{
  "scripts": {
    "dev": "vite",                    // Start dev server (port 5173)
    "build": "vite build",            // Production build
    "preview": "vite preview",        // Preview production build
    "lint": "eslint ."                // Lint code
  }
}
```

### Environment Variables

**File:** `.env`

```env
VITE_API_BASE_URL=https://pgadmit-232251258466.europe-west1.run.app
VITE_API_TIMEOUT=30000
VITE_APP_ENV=development
```

**Access in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

### Vercel Deployment

**File:** `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Purpose:** Enable SPA routing (all routes serve index.html)

### Build Output

```bash
npm run build

# Output:
vite v7.1.12 building for production...
✓ 1800 modules transformed.
✓ built in 2.49s

dist/
├── index.html                   0.47 kB
├── assets/
│   ├── logo-DWxw5cp5.svg       7.02 kB
│   ├── index-Bs3JKYIl.css     35.98 kB
│   └── index-DqZKLM_D.js     401.48 kB (gzip: 117.24 kB)
```

---

## Development Guidelines

### 1. Code Style

#### TypeScript
- ✅ Use strict mode
- ✅ Define interfaces for all props
- ✅ Avoid `any` type
- ✅ Use type inference when obvious
- ✅ Export interfaces for reusability

#### React
- ✅ Use functional components with `React.FC`
- ✅ Use hooks for state and effects
- ✅ Keep components focused (single responsibility)
- ✅ Extract reusable logic into custom hooks
- ✅ Use prop destructuring

#### File Organization
- ✅ One component per file
- ✅ Co-locate related files (Component + types + styles)
- ✅ Use index.ts for barrel exports
- ✅ Group by feature, not by type

### 2. Naming Conventions

```typescript
// Components: PascalCase
const UniversityCard: React.FC = () => {};

// Files: PascalCase for components, camelCase for utilities
UniversityCard.tsx
errorHandler.ts

// Interfaces: PascalCase, Props suffix
interface UniversityCardProps { }

// Functions: camelCase
const fetchUniversities = async () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = '...';

// CSS classes: kebab-case or Tailwind utilities
className="university-card"
className="flex items-center"
```

### 3. Error Handling

```typescript
// API calls
try {
  const data = await apiClient.get('/endpoint');
  // Process data
} catch (error) {
  ErrorHandler.log(error, 'Component - Action');
  // Show user-friendly message
}

// Error boundary (planned)
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    ErrorHandler.log(error, 'ErrorBoundary');
  }
}
```

### 4. Performance Best Practices

```typescript
// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Lazy load routes (future)
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
```

### 5. Testing (Planned)

```typescript
// Unit tests
describe('UniversityCard', () => {
  it('renders university name', () => {
    render(<UniversityCard university={mockUniversity} />);
    expect(screen.getByText('MIT')).toBeInTheDocument();
  });
});

// Integration tests
describe('Universities Page', () => {
  it('fetches and displays universities', async () => {
    render(<Universities />);
    await waitFor(() => {
      expect(screen.getByText('MIT')).toBeInTheDocument();
    });
  });
});
```

### 6. Git Workflow

```bash
# Feature development
git checkout -b feature/scholarship-api
# ... make changes ...
git add .
git commit -m "feat: integrate scholarship API with polling"

# Commit message format
# feat: new feature
# fix: bug fix
# refactor: code refactoring
# docs: documentation
# style: formatting
# test: tests
# chore: maintenance
```

### 7. Code Review Checklist

- [ ] TypeScript errors resolved
- [ ] No console.log statements (use ErrorHandler)
- [ ] Responsive design tested
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] Props validated with TypeScript
- [ ] Code follows naming conventions
- [ ] No hardcoded values (use constants)
- [ ] Comments for complex logic

---

## Recent Implementation Highlights

### 1. Scholarship API Integration (Latest)

**Commit:** `23feecd` - "Integrate scholarship APIs and update Additional Resources"

**Changes:**
- Created `ScholarshipService` with polling mechanism
- Added TypeScript types for scholarship data
- Integrated real API in Scholarships page
- Implemented loading states with progress tracking
- Added deadline validation logic
- Dynamic metadata transformation

**Technical Details:**
- Polling: 60 attempts × 5s = 5 minutes max wait
- Match score conversion: 0-1 → 0-100%
- Graceful 404 handling during result preparation

### 2. Additional Resources Updates

**Changes:**
- Updated partner links (RushTranslate, MPower, Test Prep)
- Integrated Wise.com currency converter iframe
- All links open in new tabs with `rel="noopener noreferrer"`
- Removed unused components

### 3. University API Integration (Previous)

**Changes:**
- Implemented polling for long-running searches
- Real-time progress indicators
- Dynamic metadata rendering
- Type-safe data transformation

---

## Future Enhancements

### Planned Features
1. **Authentication & Authorization**
   - User registration/login
   - JWT token management
   - Protected routes

2. **Profile API Integration**
   - Save profile data to backend
   - Profile completeness tracking
   - Profile snapshot for searches

3. **Application Tracking**
   - Track application status
   - Deadline reminders
   - Document upload

4. **AI Chat History**
   - Persist conversations
   - Export chat history
   - Multi-session support

5. **Essay Management**
   - Save essay drafts
   - Version history
   - Collaborative editing

### Technical Improvements
1. **Performance Optimization**
   - Code splitting with React.lazy
   - Route-based lazy loading
   - Image optimization
   - Bundle size reduction

2. **Testing**
   - Unit tests (Jest + React Testing Library)
   - Integration tests
   - E2E tests (Playwright)
   - Test coverage > 80%

3. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support
   - Color contrast improvements

4. **State Management**
   - Consider Zustand for global state
   - Persist user preferences
   - Offline support

5. **Error Handling**
   - Error boundary implementation
   - Sentry integration for error tracking
   - User-friendly error messages
   - Retry mechanisms

6. **Documentation**
   - Component Storybook
   - API documentation
   - Developer onboarding guide
   - User manual

---

## Conclusion

PGAdmit is a modern, well-architected React application built with best practices in mind. The codebase demonstrates:

✅ **Strong TypeScript usage** for type safety
✅ **Clean architecture** with clear separation of concerns
✅ **Reusable components** following atomic design principles
✅ **Robust API integration** with retry mechanisms
✅ **Responsive design** with Tailwind CSS
✅ **Performance** with Vite build tooling
✅ **Scalability** with feature-based organization

The project is production-ready and deployed on Vercel, serving real users seeking graduate school admission guidance.

---

**Generated:** 2025-11-17
**Version:** 1.0.0
**Author:** Development Team
**Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS
