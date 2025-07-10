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
            Dashboard[Dashboard Page]
            Repos[Repositories Page]
            BizApps[Business Applications Page]
            Analytics[Analytics Page]
        end
        
        subgraph "Components"
            Layout[Layout Component]
            Charts[Vulnerability Charts<br/>• TrendChart<br/>• OverviewChart<br/>• SecurityGauge<br/>• ApplicationRisk]
            Tables[Data Tables<br/>• RepositoryTable<br/>• VulnerabilityTable]
            Heatmap[Business App Heatmap]
        end
        
        APIService[API Service<br/>HTTP Client]
    end
    
    %% Backend Layer
    subgraph "Backend (Spring Boot)"
        subgraph "API Controllers"
            HealthCtrl[Health Controller<br/>/api/health]
            GitHubCtrl[GitHub Controller<br/>/api/github/*]
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
        DTOs[DTOs<br/>• GitHubRepositoryDto<br/>• VulnerabilityTrendDto<br/>• BusinessApplicationDto<br/>• CodeScanningAlertDto]
    end
    
    %% Connections
    Browser --> App
    App --> Auth
    App --> Router
    Router --> Login
    Router --> Dashboard
    Router --> Repos
    Router --> BizApps
    Router --> Analytics
    
    Dashboard --> Charts
    Dashboard --> Tables
    Repos --> Tables
    BizApps --> Heatmap
    Analytics --> Charts
    
    App --> Layout
    Layout --> APIService
    APIService --> HealthCtrl
    APIService --> GitHubCtrl
    APIService --> BizAppCtrl
    
    GitHubCtrl --> GitHubSvc
    GitHubCtrl --> VulnSvc
    BizAppCtrl --> BizAppSvc
    
    GitHubSvc --> GitHub
    
    BizAppSvc --> BizAppRepo
    BizAppSvc --> RepoMappingRepo
    
    BizAppRepo --> SQLite
    RepoMappingRepo --> SQLite
    
    BizAppRepo --> BizAppModel
    RepoMappingRepo --> RepoMappingModel
    
    GitHubSvc --> DTOs
    VulnSvc --> DTOs
    BizAppSvc --> DTOs
    
    Security -.-> GitHubCtrl
    Security -.-> BizAppCtrl
    Security -.-> HealthCtrl
    
    %% Styling
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef database fill:#fff3e0
    classDef external fill:#e8f5e8
    classDef config fill:#fce4ec
    
    class App,Auth,Router,Login,Dashboard,Repos,BizApps,Analytics,Layout,Charts,Tables,Heatmap,APIService frontend
    class HealthCtrl,GitHubCtrl,BizAppCtrl,GitHubSvc,VulnSvc,BizAppSvc,BizAppRepo,RepoMappingRepo backend
    class SQLite,BizAppModel,RepoMappingModel,DTOs database
    class GitHub,Browser external
    class Security,OpenAPI config
```

## Component Details

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **State Management**: Context API for authentication, React Query for server state
- **UI Framework**: Material-UI (MUI) 5
- **Charts**: Highcharts for data visualization
- **Routing**: React Router for navigation

### Backend Architecture
- **Framework**: Spring Boot 3.2.0 with Java 17
- **Architecture Pattern**: Layered Architecture (Controller → Service → Repository)
- **Security**: Spring Security with CORS support
- **API Documentation**: OpenAPI 3 (Swagger)
- **Caching**: Caffeine for GitHub API responses
- **HTTP Client**: WebFlux for reactive GitHub API integration

### Data Flow
1. **User Interaction**: User interacts with React components
2. **API Calls**: Frontend makes REST API calls via Axios
3. **Controller Processing**: Spring Boot controllers handle HTTP requests
4. **Service Layer**: Business logic processing and external API integration
5. **Data Persistence**: JPA repositories manage SQLite database operations
6. **External Integration**: GitHub API integration for vulnerability data

### Key Features
- **Single Page Application (SPA)**: React-based frontend
- **RESTful API**: Spring Boot backend with OpenAPI documentation
- **Real-time Data**: GitHub API integration for live vulnerability insights
- **Business Context**: Business application mapping and analytics
- **Security**: JWT-based authentication and CORS support
- **Responsive Design**: Mobile-friendly Material-UI components
