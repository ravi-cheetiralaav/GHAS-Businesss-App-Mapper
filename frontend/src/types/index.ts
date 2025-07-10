export interface EnterpriseVulnerability {
    organization: string;
    dependabotAlerts: number;
    codeScanningAlerts: number;
    secretScanningAlerts: number;
    totalAlerts: number;
}
