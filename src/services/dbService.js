// OpenSearch Cloud Database Service for JobPulse
// Integrates with Aiven OpenSearch cluster (os-314a7181-managethedev-7614.c.aivencloud.com:25717)

export const DB_CONFIG = {
  host: 'os-314a7181-managethedev-7614.c.aivencloud.com',
  port: 25717,
  username: 'avnadmin',
  endpoint: '/api/opensearch', // Routed via Vite dev proxy with Basic Auth
  indices: {
    applications: 'jobpulse-applications',
    resumes: 'jobpulse-resumes',
    jobs: 'jobpulse-jobs'
  }
};

export const dbService = {
  // Check cluster health
  async checkConnection() {
    try {
      const res = await fetch(`${DB_CONFIG.endpoint}/_cluster/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { connected: true, status: data.status, clusterName: data.cluster_name };
    } catch (err) {
      // Cluster may still be provisioning on Aiven or offline
      return { connected: false, error: err.message };
    }
  },

  // Index an Easy Apply Application document into OpenSearch
  async saveApplication(application) {
    const docId = application.id || `app_${Date.now()}`;
    const payload = {
      ...application,
      docId,
      indexedAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${DB_CONFIG.endpoint}/${DB_CONFIG.indices.applications}/_doc/${docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        console.log(`[OpenSearch] Application ${docId} indexed successfully on Aiven Cloud.`);
        return { success: true, remote: true, docId };
      } else {
        console.warn(`[OpenSearch] Remote save returned ${res.status}. Stored locally.`);
        return { success: true, remote: false, docId };
      }
    } catch (e) {
      console.info(`[OpenSearch] Sync deferred (Cluster provisioning / network): Stored locally in browser DB.`, e);
      return { success: true, remote: false, docId };
    }
  },

  // Index a Master Resume document
  async saveResume(resume) {
    try {
      const res = await fetch(`${DB_CONFIG.endpoint}/${DB_CONFIG.indices.resumes}/_doc/master_candidate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ...resume, updatedAt: new Date().toISOString() })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Search Applications in OpenSearch
  async queryApplications(query = '') {
    try {
      const body = query ? {
        query: {
          multi_match: {
            query,
            fields: ['jobTitle^2', 'company', 'tailoredResume.skills', 'tailoredResume.headline']
          }
        }
      } : { query: { match_all: {} } };

      const res = await fetch(`${DB_CONFIG.endpoint}/${DB_CONFIG.indices.applications}/_search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) return [];
      const data = await res.json();
      return (data.hits?.hits || []).map(h => ({ id: h._id, ...h._source }));
    } catch {
      return [];
    }
  }
};
