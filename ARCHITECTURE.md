# GHAS Vulnerability Insights - Architecture Diagram

## System Architecture Overview

```mermaid
graph TB
    %% External Systems
    GitHub[GitHub API<br/>GHAS Data Source]
    Browser[Web Browser<br/>User Interface]
    
    %% Frontend Layer
    subgraph "Frontend (React TypeScript)"
        App[App.tsx<br/>Main Application]
        Auth[AuthContext<br/>Authentication State]
        Router[React Router<br/>Navigation]
        
        subgraph "Pages"
            Login[Login Page]
            Dashboard[Organization Dashboard]
            EnterpriseDashboard[Enterprise Dashboard]
            Repos[Repositories Page]
            BizApps[Business Applications Page]
            Analytics[Analytics Page]
        end
        
        subgraph "Components"
            Layout[Layout Component]
            Charts[Vulnerability Charts<br/>• TrendChart<br/>• OverviewChart<br/>• SecurityGauge<br/>• ApplicationRisk]
            Tables[Data Tables<br/>• RepositoryTable<br/>• VulnerabilityTable<br/>• EnterpriseVulnerabilityTable]
            Heatmap[Business App Heatmap]
        end
        
        APIService[API Service<br/>HTTP Client]
    end
    
    %% Backend Layer
    subgraph "Backend (Spring Boot)"
        subgraph "API Controllers"
            HealthCtrl[Health Controller<br/>/api/health]
            GitHubCtrl[GitHub Controller<br/>/api/github/organizations/*]
            EnterpriseCtrl[Enterprise Controller<br/>/api/enterprise/*]
            BizAppCtrl[Business App Controller<br/>/api/business-applications/*]
        end
        
        subgraph "Services"
            GitHubSvc[GitHub API Service<br/>External API Integration]
            VulnSvc[Vulnerability Analysis Service<br/>Data Processing]
            BizAppSvc[Business Application Service<br/>Business Logic]
        end
        
        subgraph "Data Layer"
            BizAppRepo[Business Application Repository]
            RepoMappingRepo[Repository Mapping Repository]
        end
        
        subgraph "Configuration"
            Security[Security Config<br/>CORS & Authentication]
            OpenAPI[OpenAPI Config<br/>Swagger Documentation]
        end
    end
    
    %% Data Storage
    SQLite[(SQLite Database<br/>github_org_manager.db)]
    
    %% Data Models
    subgraph "Data Models"
        BizAppModel[Business Application<br/>Entity]
        RepoMappingModel[Repository Mapping<br/>Entity]
        DTOs[DTOs<br/>• GitHubRepositoryDto<br/>• VulnerabilityTrendDto<br/>• BusinessApplicationDto<br/>• EnterpriseDashboardDto]
    end
    
    %% Connections
    Browser --> App
    App --> Auth
    App --> Router
    Router --> Login
    Router --> Dashboard
    Router --> EnterpriseDashboard
    Router --> Repos
    Router --> BizApps
    Router --> Analytics
    
    Dashboard --> Charts
    Dashboard --> Tables
    EnterpriseDashboard --> Tables
    Repos --> Tables
    BizApps --> Heatmap
    Analytics --> Charts
    
    App --> Layout
    Layout --> APIService
    APIService --> HealthCtrl
    APIService --> GitHubCtrl
    APIService --> EnterpriseCtrl
    APIService --> BizAppCtrl
    
    GitHubCtrl --> GitHubSvc
    EnterpriseCtrl --> GitHubSvc
    GitHubCtrl --> VulnSvc
    BizAppCtrl --> BizAppSvc
    
    GitHubSvc --> GitHub
    
    BizAppSvc --> BizAppRepo
    BizAppSvc --> RepoMappingRepo
    
    BizAppRepo --> SQLite
    RepoMappingRepo --> SQLite
    
    BizAppSvc --> DTOs
    GitHubSvc --> DTOs
    VulnSvc --> DTOs
    
    BizAppModel --> BizAppRepo
    RepoMappingModel --> RepoMappingRepo
end
```

## Key Components & Data Flow

### Frontend
- **React & TypeScript**: For building a type-safe, component-based UI.
- **React Router**: Handles client-side routing and navigation.
- **Material-UI (MUI)**: Provides a rich set of UI components for a consistent look and feel.
- **Recharts**: Used for rendering interactive and responsive charts.
- **Axios**: A promise-based HTTP client for making API requests to the backend.
- **AuthContext**: Manages the application's authentication state, storing the GitHub PAT securely.

### Backend
- **Spring Boot**: Provides a robust framework for building the REST API.
- **Spring Security**: Manages authentication and authorization, securing the API endpoints.
- **Spring Data JPA**: Simplifies data access and management with the SQLite database.
- **GitHub API Client**: A dedicated service for interacting with the GitHub REST API to fetch repository and vulnerability data.
- **Controllers**: Expose REST endpoints for the frontend to consume.
  - `GitHubController`: Handles requests related to GitHub data (repositories, vulnerabilities).
  - `EnterpriseController`: Provides endpoints for enterprise-level data aggregation.
  - `BusinessApplicationController`: Manages CRUD operations for business applications.
- **Services**: Contain the core business logic.
  - `GitHubApiService`: Fetches and processes data from the GitHub API.
  - `BusinessApplicationService`: Manages the logic for business applications and their repository mappings.
- **SQLite Database**: A lightweight, file-based SQL database for storing business application mappings.

### Authentication
1. The user provides a GitHub Personal Access Token (PAT) on the login page.
2. The token is sent to the backend's `/api/github/validate-token` endpoint.
3. The backend validates the token by making a test call to the GitHub API.
4. If valid, the token is stored in the browser's local storage and included in the `Authorization` header for all subsequent API requests.

### Data Flow
1. **Dashboard Load**:
   - The frontend calls the `/api/github/organizations/{org}/vulnerability-stats` endpoint to get aggregated vulnerability data for the specified organization.
   - It also fetches the list of business applications from `/api/business-applications`.
   - This data is used to render the main dashboard, including charts and tables.
2. **Enterprise View**:
   - The frontend calls `/api/enterprise/{enterprise}/dashboard` to get a consolidated view of vulnerabilities across all organizations in the enterprise.
3. **Business Application Management**:
   - Users can create, read, update, and delete business applications.
   - These operations are handled by the `BusinessApplicationController`, which interacts with the `BusinessApplicationService` and the SQLite database.
   - When a business application is created or updated, repositories are mapped to it, allowing for risk assessment based on the vulnerabilities in those repositories.
