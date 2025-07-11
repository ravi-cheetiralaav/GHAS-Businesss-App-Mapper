export interface EnterpriseVulnerability {
    organization: string;
    dependabotAlerts: number;
    codeScanningAlerts: number;
    secretScanningAlerts: number;
    totalAlerts: number;
}

// Individual vulnerability alert interfaces for the new Enterprise dashboard
export interface CodeScanningAlert {
    number: number;
    created_at: string;
    updated_at: string;
    url: string;
    html_url: string;
    state: 'open' | 'fixed' | 'dismissed';
    dismissed_reason?: string;
    rule: {
        id: string;
        name: string;
        description: string;
        severity: 'error' | 'warning' | 'note';
        security_severity_level?: 'low' | 'medium' | 'high' | 'critical';
    };
    tool: {
        name: string;
        version: string;
    };
    most_recent_instance: {
        ref: string;
        analysis_key: string;
        category: string;
        environment: string;
        location: {
            path: string;
            start_line: number;
            end_line: number;
            start_column: number;
            end_column: number;
        };
        message: {
            text: string;
        };
    };
    repository: {
        id: number;
        name: string;
        full_name: string;
        html_url: string;
        private: boolean;
    };
}

export interface SecretScanningAlert {
    number: number;
    created_at: string;
    updated_at: string;
    url: string;
    html_url: string;
    state: 'open' | 'resolved';
    resolution?: 'false_positive' | 'wont_fix' | 'revoked' | 'used_in_tests';
    secret_type: string;
    secret_type_display_name: string;
    secret: string;
    repository: {
        id: number;
        name: string;
        full_name: string;
        html_url: string;
        private: boolean;
    };
    push_protection_bypassed?: boolean;
    push_protection_bypassed_by?: {
        login: string;
        id: number;
        html_url: string;
    };
    push_protection_bypassed_at?: string;
}

export interface DependabotAlert {
    number: number;
    state: 'auto_dismissed' | 'dismissed' | 'fixed' | 'open';
    dependency: {
        package: {
            ecosystem: string;
            name: string;
        };
        manifest_path: string;
        scope: 'development' | 'runtime';
    };
    security_advisory: {
        ghsa_id: string;
        cve_id?: string;
        summary: string;
        description: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        identifiers: Array<{
            value: string;
            type: string;
        }>;
        references: Array<{
            url: string;
        }>;
        published_at: string;
        updated_at: string;
        withdrawn_at?: string;
    };
    security_vulnerability: {
        package: {
            ecosystem: string;
            name: string;
        };
        severity: 'low' | 'medium' | 'high' | 'critical';
        vulnerable_version_range: string;
        first_patched_version?: {
            identifier: string;
        };
    };
    url: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    dismissed_at?: string;
    dismissed_by?: {
        login: string;
        id: number;
        html_url: string;
    };
    dismissed_reason?: 'fix_started' | 'inaccurate' | 'no_bandwidth' | 'not_used' | 'tolerable_risk';
    dismissed_comment?: string;
    fixed_at?: string;
    repository: {
        id: number;
        name: string;
        full_name: string;
        html_url: string;
        private: boolean;
    };
}

export interface EnterpriseVulnerabilityDashboard {
    codeScanningAlerts: CodeScanningAlert[];
    secretScanningAlerts: SecretScanningAlert[];
    dependabotAlerts: DependabotAlert[];
    totalAlerts: number;
    summary: {
        codeScanning: {
            total: number;
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
        secretScanning: {
            total: number;
            byType: Record<string, number>;
        };
        dependabot: {
            total: number;
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
    };
}
