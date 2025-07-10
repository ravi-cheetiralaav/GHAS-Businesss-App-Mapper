#!/bin/bash

echo "🔍 GHAS Vulnerability Insights - Swagger Configuration Checker"
echo "============================================================="
echo "📅 Updated: July 9, 2025 - Fixed 403 Forbidden Issues"
echo ""

# Check if we're in the backend directory
if [ ! -f "pom.xml" ]; then
    echo "❌ Not in backend directory. Please run from /backend directory"
    exit 1
fi

echo "✅ Found pom.xml"

# Check SpringDoc dependency
if grep -q "springdoc-openapi-starter-webmvc-ui" pom.xml; then
    echo "✅ SpringDoc OpenAPI dependency found"
    SPRINGDOC_VERSION=$(grep -A 1 "springdoc-openapi-starter-webmvc-ui" pom.xml | grep "version" | sed 's/.*<version>\(.*\)<\/version>.*/\1/' | tr -d ' ')
    echo "   Version: $SPRINGDOC_VERSION"
else
    echo "❌ SpringDoc OpenAPI dependency not found"
fi

# Check application.properties
if [ -f "src/main/resources/application.properties" ]; then
    echo "✅ Found application.properties"
    
    if grep -q "springdoc.swagger-ui.path" src/main/resources/application.properties; then
        SWAGGER_PATH=$(grep "springdoc.swagger-ui.path" src/main/resources/application.properties | cut -d'=' -f2)
        echo "✅ Swagger UI path configured: $SWAGGER_PATH"
    else
        echo "⚠️  Swagger UI path not explicitly configured (will use default)"
    fi
    
    if grep -q "springdoc.api-docs.path" src/main/resources/application.properties; then
        API_DOCS_PATH=$(grep "springdoc.api-docs.path" src/main/resources/application.properties | cut -d'=' -f2)
        echo "✅ API docs path configured: $API_DOCS_PATH"
    else
        echo "⚠️  API docs path not explicitly configured (will use default)"
    fi
else
    echo "❌ application.properties not found"
fi

# Check Security Configuration
if [ -f "src/main/java/com/ghas/vulnerabilityinsights/config/SecurityConfig.java" ]; then
    echo "✅ Found SecurityConfig.java"
    
    if grep -q "swagger-ui" src/main/java/com/ghas/vulnerabilityinsights/config/SecurityConfig.java; then
        echo "✅ Swagger UI endpoints permitted in security configuration"
    else
        echo "❌ Swagger UI endpoints not found in security configuration"
    fi
    
    if grep -q "v3/api-docs" src/main/java/com/ghas/vulnerabilityinsights/config/SecurityConfig.java; then
        echo "✅ API docs endpoints permitted in security configuration"
    else
        echo "❌ API docs endpoints not found in security configuration"
    fi
else
    echo "❌ SecurityConfig.java not found"
fi

# Check Controllers for Swagger annotations
echo ""
echo "📋 Checking Controllers for Swagger annotations:"
CONTROLLERS_DIR="src/main/java/com/ghas/vulnerabilityinsights/controller"
if [ -d "$CONTROLLERS_DIR" ]; then
    for controller in $CONTROLLERS_DIR/*.java; do
        if [ -f "$controller" ]; then
            CONTROLLER_NAME=$(basename "$controller" .java)
            echo "   📄 $CONTROLLER_NAME:"
            
            if grep -q "@Tag" "$controller"; then
                TAG_NAME=$(grep "@Tag" "$controller" | sed 's/.*name = "\([^"]*\)".*/\1/')
                echo "      ✅ @Tag annotation found: $TAG_NAME"
            else
                echo "      ⚠️  @Tag annotation not found"
            fi
            
            OPERATION_COUNT=$(grep -c "@Operation" "$controller")
            if [ $OPERATION_COUNT -gt 0 ]; then
                echo "      ✅ $OPERATION_COUNT @Operation annotations found"
            else
                echo "      ⚠️  No @Operation annotations found"
            fi
        fi
    done
else
    echo "❌ Controllers directory not found"
fi

echo ""
echo "� Recent Fixes Applied (July 9, 2025):"
echo "   • Fixed 403 Forbidden errors for Swagger UI"
echo "   • Added comprehensive security matchers for all Swagger paths"
echo "   • Disabled frame options for proper UI rendering"
echo "   • Added OpenAPI configuration with security schemes"
echo "   • Enhanced SpringDoc properties for better functionality"
echo ""
echo "�🚀 To test Swagger:"
echo "1. Start the application: mvn spring-boot:run"
echo "2. Wait for startup (look for 'Started VulnerabilityInsightsApplication')"
echo "3. Visit: http://localhost:8080/swagger-ui.html"
echo "4. Or check API docs: http://localhost:8080/v3/api-docs"
echo ""
echo "📊 Expected Swagger UI Features:"
echo "   • GitHub API endpoints"
echo "   • Business Application endpoints"
echo "   • Health check endpoint"
echo "   • Interactive API testing"
echo "   • GitHub PAT authentication support"
echo "   • OpenAPI specification download"
