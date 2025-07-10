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
    participant GitHub API Service
    participant Business App Controller
    participant Business App Service
    participant SQLite Database
    participant GitHub API

    %% Authentication Flow
    rect rgb(240, 248, 255)
    Note over User, GitHub API: Authentication & Initial Load
    User->>Browser: Navigate to http://localhost:8080
    Browser->>React Frontend: Load Application
    React Frontend->>Spring Security: Check Authentication Status
    Spring Security-->>React Frontend: Not Authenticated
    React Frontend-->>Browser: Display Login Page
    Browser-->>User: Show Login Form
    
    User->>Browser: Enter GitHub PAT
    Browser->>React Frontend: Submit Credentials
    React Frontend->>Spring Security: Authenticate with PAT
    Spring Security->>GitHub Controller: Validate Token
    GitHub Controller->>GitHub API Service: Test GitHub API Access
    GitHub API Service->>GitHub API: Validate Token
    GitHub API-->>GitHub API Service: Token Valid
    GitHub API Service-->>GitHub Controller: Authentication Success
    GitHub Controller-->>Spring Security: Token Validated
    Spring Security-->>React Frontend: Authentication Success
    React Frontend-->>Browser: Redirect to Dashboard
    end

    %% Dashboard Load
    rect rgb(245, 255, 245)
    Note over User, GitHub API: Dashboard Data Loading
    React Frontend->>GitHub Controller: GET /api/github/repositories
    activate GitHub Controller
    GitHub Controller->>GitHub API Service: fetchOrganizationRepositories()
    activate GitHub API Service
    GitHub API Service->>GitHub API: GET /orgs/{org}/repos
    GitHub API-->>GitHub API Service: Repository List
    GitHub API Service-->>GitHub Controller: Repository DTOs
    deactivate GitHub API Service
    GitHub Controller-->>React Frontend: Repository Data
    deactivate GitHub Controller
    
    par Load Vulnerability Data
        React Frontend->>GitHub Controller: GET /api/github/vulnerabilities
        activate GitHub Controller
        GitHub Controller->>GitHub API Service: fetchVulnerabilityData()
        activate GitHub API Service
        GitHub API Service->>GitHub API: GET /repos/{repo}/code-scanning/alerts
        GitHub API-->>GitHub API Service: Vulnerability Alerts
        GitHub API Service-->>GitHub Controller: Vulnerability DTOs
        deactivate GitHub API Service
        GitHub Controller-->>React Frontend: Vulnerability Trends
        deactivate GitHub Controller
    and Load Business Applications
        React Frontend->>Business App Controller: GET /api/business-applications
        activate Business App Controller
        Business App Controller->>Business App Service: getAllBusinessApplications()
        activate Business App Service
        Business App Service->>SQLite Database: SELECT * FROM business_applications
        SQLite Database-->>Business App Service: Business App Records
        Business App Service-->>Business App Controller: Business App DTOs
        deactivate Business App Service
        Business App Controller-->>React Frontend: Business Applications
        deactivate Business App Controller
    end
    
    React Frontend-->>Browser: Render Dashboard with Charts
    Browser-->>User: Display Analytics Dashboard
    end

    %% User Interaction - Create Business Application
    rect rgb(255, 248, 240)
    Note over User, SQLite Database: Business Application Management
    User->>Browser: Click "Create Business Application"
    Browser->>React Frontend: Navigate to Business Apps Page
    React Frontend-->>Browser: Show Business App Form
    Browser-->>User: Display Form
    
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
    Business App Controller-->>React Frontend: Business App Created
    deactivate Business App Controller
    React Frontend-->>Browser: Update UI
    Browser-->>User: Show Success Message
    end

    %% Repository Mapping
    rect rgb(248, 240, 255)
    Note over User, SQLite Database: Repository to Business App Mapping
    User->>Browser: Map Repository to Business App
    Browser->>React Frontend: Select Repository & Business App
    React Frontend->>Business App Controller: POST /api/business-applications/{id}/repositories
    activate Business App Controller
    Business App Controller->>Business App Service: mapRepositoryToBusinessApp()
    activate Business App Service
    Business App Service->>SQLite Database: INSERT INTO repository_mappings
    SQLite Database-->>Business App Service: Mapping Created
    Business App Service-->>Business App Controller: Mapping Success
    deactivate Business App Service
    Business App Controller-->>React Frontend: Mapping Confirmed
    deactivate Business App Controller
    React Frontend-->>Browser: Update Heatmap/Charts
    Browser-->>User: Show Updated Analytics
    end

    %% Real-time Updates
    rect rgb(255, 245, 240)
    Note over User, GitHub API: Periodic Data Refresh
    loop Every 5 minutes
        React Frontend->>GitHub Controller: GET /api/github/vulnerabilities/latest
        GitHub Controller->>GitHub API Service: fetchLatestVulnerabilities()
        GitHub API Service->>GitHub API: GET /repos/{repo}/code-scanning/alerts (updated)
        GitHub API-->>GitHub API Service: Latest Alerts
        GitHub API Service-->>GitHub Controller: Updated Vulnerability Data
        GitHub Controller-->>React Frontend: Real-time Updates
        React Frontend-->>Browser: Update Charts & Notifications
        opt New Vulnerabilities Found
            Browser-->>User: Show Alert Notification
        end
    end
    end

    %% Error Handling
    rect rgb(255, 240, 240)
    Note over User, GitHub API: Error Handling Scenario
    User->>Browser: Request Sensitive Data
    Browser->>React Frontend: API Call
    React Frontend->>GitHub Controller: GET /api/github/restricted-data
    GitHub Controller->>Spring Security: Check Permissions
    Spring Security-->>GitHub Controller: Access Denied
    GitHub Controller-->>React Frontend: 403 Forbidden
    React Frontend-->>Browser: Show Error Message
    Browser-->>User: Display "Access Denied" Error
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
