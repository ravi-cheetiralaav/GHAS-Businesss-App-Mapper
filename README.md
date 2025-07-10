# GHAS Vulnerability Insights

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17+-blue.svg)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)

A modern, comprehensive GitHub Advanced Security (GHAS) vulnerability insights application built with Java Spring Boot backend and React TypeScript frontend. This application provides organizations with powerful tools to manage repositories, track security vulnerabilities, and gain insights into their application security posture.

## 🚀 Features

### 🔐 Authentication & Security
- Secure GitHub Personal Access Token authentication
- JWT-based session management
- CORS-enabled API with security headers
- Environment-specific configuration support

### 📊 Repository Management
- View all organization repositories with comprehensive details
- Repository visibility indicators (Public, Private, Internal) with icons
- Real-time repository statistics (stars, forks, language)
- Direct links to GitHub repositories
- Advanced filtering and search capabilities

### 🏢 Business Application Management
- Create and manage business applications
- Map repositories to business applications
- Track business ownership and responsibility
- Comprehensive business application analytics

### 📈 Security Analytics Dashboard
- Interactive vulnerability trend analysis using Highcharts
- Security metrics visualization with multiple chart types
- Real-time vulnerability alerts and advisories
- Historical security data tracking
- Export capabilities for reports and presentations

### 🎨 Modern User Interface
- Responsive Material-UI design
- Dark/light theme support
- Mobile-friendly interface
- Intuitive navigation and user experience
- Real-time backend connectivity status

## 🏗️ Architecture

### Backend (Spring Boot)
```
├── Java 17 + Spring Boot 3.2.0
├── RESTful API with OpenAPI/Swagger documentation
├── SQLite Database for data persistence
├── Spring Security with CORS support
├── Caffeine caching for GitHub API responses
├── WebFlux for reactive GitHub API integration
└── Comprehensive error handling and logging
```

### Frontend (React TypeScript)
```
├── React 18 with TypeScript
├── Material-UI (MUI) 5 for components
├── React Query for server state management
├── React Router for navigation
├── Highcharts for advanced data visualization
├── Axios for HTTP client
└── Context API for authentication state
```

## 📋 Prerequisites

- **Java**: 17 or higher
- **Maven**: 3.6+ 
- **Node.js**: 16+ and npm
- **GitHub PAT**: Personal Access Token with `repo` and `read:org` scopes

## 💾 Database

The application uses **SQLite** as its database, which provides:
- **Zero Configuration**: No database server setup required
- **Portable**: Database file (`github_org_manager.db`) is created automatically
- **Persistent**: Data is stored on disk and survives application restarts
- **Lightweight**: Perfect for single-user or small team deployments

The SQLite database file will be created automatically when the application starts for the first time.

## 🚀 Building and Running the Application

This project includes a convenient script to build both the frontend and backend into a single, executable JAR file. This is the recommended way to run the application for production or standalone deployment.

### Building with the Script

1.  **Ensure Prerequisites are Met**: Make sure you have Java 17+ and Node.js 16+ installed on your system.
2.  **Make the Script Executable** (if you haven't already):
    ```bash
    chmod +x build-all.sh
    ```
3.  **Run the Build Script**:
    ```bash
    ./build-all.sh
    ```
    This script will perform the following steps:
    - Install frontend dependencies (`npm install`).
    - Create a production build of the React frontend.
    - Copy the frontend assets into the backend's resources.
    - Build a single executable "fat jar" using Maven.

### Running the Packaged Application

Once the build script is finished, you can run the entire application with a single command:

```bash
java -jar backend/target/ghas-vulnerability-insights-0.0.1-SNAPSHOT.jar
```

The application will start, and you can access it at **http://localhost:8080**.

---

## 🛠️ Development Setup (Manual)

If you prefer to run the frontend and backend servers separately for development, follow these steps.

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd GHASVulnerabilityInsights

# Start backend
cd backend
mvn clean install
mvn spring-boot:run

# In a new terminal, start frontend
cd frontend
npm install
npm start
```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies and run:**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. **Access points:**
   - API: `http://localhost:8080`
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
   - Database: SQLite file (`github_org_manager.db`)

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Access application:**
   - Frontend: `http://localhost:3000`

##  GitHub Personal Access Token Setup

Generate a GitHub Personal Access Token to authenticate with the GitHub API. The application supports both **Personal Access Token (Classic)** and **Fine-grained personal access tokens**.

### Token Types Supported:

#### Personal Access Token (Classic)
- Traditional tokens with organization-wide access
- Easier to set up for organization-wide access
- Recommended for most use cases

#### Fine-grained Personal Access Tokens
- More granular permissions control
- Can be scoped to specific repositories or organizations
- Enhanced security with limited access scope
- Requires organization approval for organization-owned resources

### Required Scopes/Permissions:

#### For Classic Tokens:
- `repo` - Full control of private repositories
- `read:org` - Read organization and team membership
- `read:user` - Read user profile data
- `user:email` - Access user email addresses

#### For Fine-grained Tokens:
- **Repository permissions:**
  - Contents: Read
  - Metadata: Read
  - Vulnerability alerts: Read
  - Secret scanning alerts: Read
  - Code scanning alerts: Read
- **Organization permissions:**
  - Members: Read
  - Administration: Read (if accessing organization-level data)

### Token Generation:

#### Classic Token:
1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select the required scopes listed above
4. Generate and copy the token
5. Use the token in the application login

#### Fine-grained Token:
1. Go to [GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/personal-access-tokens/new)
2. Select resource owner (your account or organization)
3. Choose repository access (selected repositories or all repositories)
4. Configure the required permissions listed above
5. Generate and copy the token
6. Use the token in the application login

**Note:** Fine-grained tokens may require approval from organization owners before they can access organization-owned repositories.

## 🌐 API Documentation

### Authentication Endpoints
```http
POST /api/github/validate-token
```

### Repository Endpoints
```http
GET /api/github/organizations/{orgName}/repositories
GET /api/github/organizations/{orgName}/repositories/{repoName}/vulnerability-alerts
GET /api/github/organizations/{orgName}/repositories/{repoName}/security-advisories
```

### Business Application Endpoints
```http
GET    /api/business-applications
POST   /api/business-applications
GET    /api/business-applications/{id}
PUT    /api/business-applications/{id}
DELETE /api/business-applications/{id}
GET    /api/business-applications/stats
```

### Health Check
```http
GET /api/health
```

Full API documentation is available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## 🗄️ Database Schema

### Business Applications Table
```sql
CREATE TABLE business_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    organization VARCHAR(255) NOT NULL,
    business_owner_email VARCHAR(255),
    created_at TIMESTAMP NOT NULL
);
```

### Repository Mappings Table
```sql
CREATE TABLE repository_mappings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    business_app_id BIGINT NOT NULL,
    repository_name VARCHAR(255) NOT NULL,
    repository_url VARCHAR(500) NOT NULL,
    repository_full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (business_app_id) REFERENCES business_applications(id)
);
```

## ⚙️ Configuration

### Backend Configuration (`application.properties`)
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# Database Configuration (SQLite)
spring.datasource.url=jdbc:sqlite:github_org_manager.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.datasource.username=
spring.datasource.password=

# JPA Configuration
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Application Configuration
spring.application.name=ghas-vulnerability-insights

# GitHub API Configuration
github.api.base-url=https://api.github.com

# Cache Configuration
spring.cache.cache-names=orgRepositories
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=600s

# Logging Configuration
logging.level.com.ghas.vulnerabilityinsights=INFO
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.security=DEBUG

# Actuator Configuration
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always

# OpenAPI Configuration
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.enabled=true
springdoc.api-docs.enabled=true
springdoc.swagger-ui.tryItOutEnabled=true
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_VERSION=1.0.0
```

## 🏃‍♂️ Development

### Backend Development
- **IDE Support**: IntelliJ IDEA, Eclipse, VS Code with Java extensions
- **Hot Reload**: `mvn spring-boot:run` with automatic restart
- **Database**: SQLite persistent database
- **API Testing**: Swagger UI at `/swagger-ui.html`
- **Debugging**: Standard Java debugging support

### Frontend Development
- **Hot Reload**: `npm start` with automatic browser refresh
- **Type Safety**: Full TypeScript support with strict mode
- **Component Library**: Material-UI with custom theming
- **State Management**: React Query for server state, Context API for app state
- **Code Quality**: ESLint and Prettier configuration

### Key Development Scripts

#### Backend
```bash
mvn clean compile          # Compile only
mvn clean install         # Full build with dependencies
mvn spring-boot:run        # Start development server
mvn clean package         # Build JAR for deployment
```

#### Frontend
```bash
npm start                  # Start development server
npm run build              # Production build
npm run eject              # Eject from Create React App (use with caution)
```

## 🎨 UI Components & Features

### Repository Status Indicators
The application includes enhanced repository visibility indicators:

- **🌍 Public**: Green chip with globe icon
- **🔒 Private**: Red chip with lock icon  
- **🏢 Internal**: Orange chip with business icon

These indicators automatically detect repository visibility from the GitHub API and provide visual clarity for repository access levels.

### Interactive Charts
- **Highcharts Integration**: Professional-grade charts for vulnerability trends
- **Multiple Chart Types**: Line charts, bar charts, heatmaps, and pie charts
- **Export Functionality**: Save charts as PNG, JPEG, PDF, or SVG
- **Responsive Design**: Charts adapt to different screen sizes

### Modern UI Elements
- **Material-UI Components**: Consistent, accessible design system
- **Loading States**: Skeleton loaders and progress indicators
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Responsive Tables**: Sortable, filterable data tables

## 🚀 Deployment

### Backend Deployment
```bash
# Build the application
mvn clean package -DskipTests

# Run the JAR file
java -jar target/vulnerability-insights-1.0.0.jar

# Or with production profile
java -jar -Dspring.profiles.active=prod target/vulnerability-insights-1.0.0.jar
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy the build/ directory to your web server
# Example with nginx:
cp -r build/* /var/www/html/
```

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile
FROM openjdk:17-jre-slim
COPY target/vulnerability-insights-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]

# Frontend Dockerfile  
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
```

## 🔧 Troubleshooting

### Common Issues

#### Backend Issues
1. **Port 8080 already in use**
   ```bash
   # Check what's using the port
   lsof -i :8080
   # Kill the process or change the port in application.properties
   ```

2. **Database connection errors**
   - Check SQLite database file (`github_org_manager.db`) exists and is accessible
   - Verify database URL and dialect in `application.properties`
   - Ensure SQLite JDBC driver is properly configured

3. **GitHub API rate limiting**
   - Ensure your PAT is valid and has required scopes
   - Check rate limit headers in API responses

#### Frontend Issues
1. **CORS errors**
   - Verify backend CORS configuration
   - Check that backend is running on correct port

2. **Build failures**
   ```bash
   # Clear npm cache
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**
   - Check TypeScript version compatibility
   - Verify all type definitions are installed

#### macOS DNS Resolution Warning
If you see DNS resolution warnings on macOS:
```
ERROR i.n.r.d.DnsServerAddressStreamProviders - Unable to load io.netty.resolver.dns.macos.MacOSDnsServerAddressStreamProvider
```

This has been fixed by adding native macOS DNS resolver dependencies to the backend.

### Performance Optimization
- Enable caching for GitHub API responses
- Use pagination for large repository lists
- Implement lazy loading for charts and heavy components
- Optimize bundle size with code splitting

## 🧪 Testing

The application has been designed with a focus on production readiness. All test-related code and configuration have been removed to maintain a clean, production-focused codebase.

### Manual Testing
1. **Backend Health Check**: `curl http://localhost:8080/api/health`
2. **API Documentation**: Visit `http://localhost:8080/swagger-ui.html`
3. **Frontend Connectivity**: Check the backend status indicator on the login page

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow Java coding standards and Spring Boot best practices
- Use TypeScript strict mode for frontend development
- Write meaningful commit messages
- Update documentation as needed
- Ensure compatibility with existing API contracts

## 📦 Project Structure

```
GHASVulnerabilityInsights/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/         # Java source code
│   │   └── com/ghas/vulnerabilityinsights/
│   │       ├── controller/    # REST controllers
│   │       ├── service/       # Business logic
│   │       ├── dto/          # Data transfer objects
│   │       └── config/       # Configuration classes
│   ├── src/main/resources/   # Application resources
│   │   ├── application.properties
│   │   └── schema.sql
│   ├── pom.xml              # Maven configuration
│   └── target/              # Compiled output
├── frontend/                 # React TypeScript frontend
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   ├── package.json        # NPM configuration
│   └── build/              # Production build
├── assets/                 # Shared assets
└── README.md              # This file
```

##  License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgments

- **Spring Boot**: For the excellent backend framework
- **React**: For the powerful frontend library
- **Material-UI**: For the beautiful component library
- **Highcharts**: For professional data visualization
- **GitHub**: For the comprehensive API

## 📞 Support

For support, please create an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for better application security insights**
