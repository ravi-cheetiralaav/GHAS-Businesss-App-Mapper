import React, { useState, useEffect } from 'react';
import { getEnterpriseVulnerabilities } from '../services/api';
import { EnterpriseVulnerability } from '../types';
import EnterpriseVulnerabilityTable from '../components/EnterpriseVulnerabilityTable';

const Enterprise: React.FC = () => {
    const [vulnerabilities, setVulnerabilities] = useState<EnterpriseVulnerability[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVulnerabilities = async () => {
            try {
                const data = await getEnterpriseVulnerabilities('YOUR_ENTERPRISE_NAME'); // Replace with your enterprise name
                setVulnerabilities(data);
            } catch (err) {
                setError('Failed to fetch enterprise vulnerabilities');
            } finally {
                setLoading(false);
            }
        };

        fetchVulnerabilities();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Enterprise Vulnerability View</h1>
            <EnterpriseVulnerabilityTable vulnerabilities={vulnerabilities} />
        </div>
    );
};

export default Enterprise;
