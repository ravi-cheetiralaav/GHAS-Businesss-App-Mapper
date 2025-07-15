# GHAS Vulnerability Insights - Sequence Diagram

This sequence diagram illustrates the typical user interactions and data flow in the GHAS Vulnerability Insights application.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant React Frontend
    participant Spring Security
    participant GitHub Controller
    participant Enterprise Controller
    participant Business App Controller
    participant GitHub API Service
    participant Business App Service
    participant SQLite Database
    participant GitHub API

    %% Authentication Flow
    rect rgb(240, 248, 255)
    Note over User, GitHub API: Authentication
    User->>Browser: Navigate to application
    Browser->>React Frontend: Load application
    React Frontend->>Spring Security: Check authentication status
    Spring Security-->>React Frontend: Not authenticated
    React Frontend-->>Browser: Display Login Page
    
    User->>Browser: Enter GitHub PAT and organization
    Browser->>React Frontend: Submit credentials
    React Frontend->>Spring Security: Authenticate with PAT
    Spring Security->>GitHub Controller: POST /api/github/validate-token
    activate GitHub Controller
    GitHub Controller->>GitHub API Service: testGitHubApiAccess()
    activate GitHub API Service
    GitHub API Service->>GitHub API: Validate token
    GitHub API-->>GitHub API Service: Token valid
    GitHub API Service-->>GitHub Controller: Authentication success
    deactivate GitHub API Service
    GitHub Controller-->>Spring Security: Token validated
    deactivate GitHub Controller
    Spring Security-->>React Frontend: Authentication success
    React Frontend-->>Browser: Redirect to Dashboard
    end

    %% Organization Dashboard Load
    rect rgb(245, 255, 245)
    Note over User, GitHub API: Organization Dashboard Data Loading
    
    par Load Repositories and Vulnerability Stats
        React Frontend->>GitHub Controller: GET /api/github/organizations/{org}/repositories-with-languages
        activate GitHub Controller
        GitHub Controller->>GitHub API Service: fetchOrganizationRepositoriesWithLanguages()
        activate GitHub API Service
        GitHub API Service->>GitHub API: GET /orgs/{org}/repos
        GitHub API-->>GitHub API Service: Repository List
        GitHub API Service-->>GitHub Controller: Repository DTOs
        deactivate GitHub API Service
        GitHub Controller-->>React Frontend: Repository Data
        deactivate GitHub Controller
    and
        React Frontend->>GitHub Controller: GET /api/github/organizations/{org}/vulnerability-stats
        activate GitHub Controller
        GitHub Controller->>GitHub API Service: fetchOrganizationVulnerabilityStats()
        activate GitHub API Service
        GitHub API Service->>GitHub API: Fetch alerts (Code Scanning, Dependabot, Secret Scanning)
        GitHub API-->>GitHub API Service: Vulnerability Alerts
        GitHub API Service-->>GitHub Controller: Aggregated Stats DTO
        deactivate GitHub API Service
        GitHub Controller-->>React Frontend: Vulnerability Stats
        deactivate GitHub Controller
    and Load Business Applications
        React Frontend->>Business App Controller: GET /api/business-applications?organization={org}
        activate Business App Controller
        Business App Controller->>Business App Service: getAllBusinessApplications()
        activate Business App Service
        Business App Service->>SQLite Database: SELECT * FROM business_applications WHERE org = ?
        SQLite Database-->>Business App Service: Business App Records
        Business App Service-->>Business App Controller: Business App DTOs
        deactivate Business App Service
        Business App Controller-->>React Frontend: Business Applications
        deactivate Business App Controller
    end
    
    React Frontend-->>Browser: Render Organization Dashboard
    Browser-->>User: Display Analytics Dashboard
    end

    %% Enterprise Dashboard Load
    rect rgb(255, 250, 240)
    Note over User, GitHub API: Enterprise Dashboard Data Loading
    User->>Browser: Navigate to Enterprise Dashboard
    Browser->>React Frontend: Request enterprise data
    React Frontend->>Enterprise Controller: GET /api/enterprise/{enterprise}/dashboard
    activate Enterprise Controller
    Enterprise Controller->>GitHub API Service: getEnterpriseDashboardData()
    activate GitHub API Service
    GitHub API Service->>GitHub API: Fetch all enterprise alerts (Code Scanning, Dependabot, Secret Scanning)
    GitHub API-->>GitHub API Service: Alerts from all organizations
    GitHub API Service-->>Enterprise Controller: Consolidated Dashboard DTO
    deactivate GitHub API Service
    Enterprise Controller-->>React Frontend: Enterprise Dashboard Data
    deactivate Enterprise Controller
    React Frontend-->>Browser: Render Enterprise Dashboard
    Browser-->>User: Display Enterprise-wide Vulnerability View
    end

    %% Business Application Management
    rect rgb(255, 248, 240)
    Note over User, SQLite Database: Business Application Management (CRUD)
    
    User->>Browser: Click "Create Business Application"
    Browser->>React Frontend: Show Business App Form
    
    User->>Browser: Fill Form & Submit
    Browser->>React Frontend: POST Business Application Data
    React Frontend->>Business App Controller: POST /api/business-applications
    activate Business App Controller
    Business App Controller->>Business App Service: createBusinessApplication(dto)
    activate Business App Service
    Business App Service->>SQLite Database: INSERT INTO business_applications
    SQLite Database-->>Business App Service: Record Created
    Business App Service-->>Business App Controller: Success Response
    deactivate Business App Service
    Business App Controller-->>React Frontend: New Business App
    deactivate Business App Controller

    User->>Browser: Edit an existing Business Application
    Browser->>React Frontend: PUT updated data
    React Frontend->>Business App Controller: PUT /api/business-applications/{id}
    activate Business App Controller
    Business App Controller->>Business App Service: updateBusinessApplication(id, dto)
    activate Business App Service
    Business App Service->>SQLite Database: UPDATE business_applications WHERE id = ?
    SQLite Database-->>Business App Service: Record Updated
    Business App Service-->>Business App Controller: Success Response
    deactivate Business App Service
    Business App Controller-->>React Frontend: Updated Business App
    deactivate Business App Controller

    User->>Browser: Delete a Business Application
    Browser->>React Frontend: Send delete request
    React Frontend->>Business App Controller: DELETE /api/business-applications/{id}
    activate Business App Controller
    Business App Controller->>Business App Service: deleteBusinessApplication(id)
    activate Business App Service
    Business App Service->>SQLite Database: DELETE FROM business_applications WHERE id = ?
    SQLite Database-->>Business App Service: Record Deleted
    Business App Service-->>Business App Controller: Success Response
    deactivate Business App Service
    Business App Controller-->>React Frontend: Confirmation
    deactivate Business App Controller
    end
```

## Key Interaction Patterns

### 1. Authentication Flow
- User provides GitHub Personal Access Token
- Spring Security validates token via GitHub API
- JWT session established for subsequent requests

### 2. Data Loading Strategy
- Parallel loading of repositories and vulnerability data
- Local business applications loaded from SQLite
- Cached GitHub API responses to reduce API calls

### 3. Real-time Updates
- Periodic polling for latest vulnerability data
- WebSocket-like behavior through scheduled API calls
- User notifications for new security alerts

### 4. Business Logic Integration
- Repository-to-business-application mapping
- Local persistence for business context
- Analytics combining GitHub data with business metadata

### 5. Error Handling
- Graceful degradation for API failures
- User-friendly error messages
- Automatic retry mechanisms for transient failures

This sequence diagram demonstrates the full lifecycle of user interactions, from authentication through data visualization, highlighting the integration between the React frontend, Spring Boot backend, and external GitHub API services.
