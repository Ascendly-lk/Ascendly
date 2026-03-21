/**
 * Patent Firm API utility
 * Provides data-fetching functions for the patent firm dashboard.
 * Currently returns mock data; replace fetch calls with real API endpoints as needed.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CLIENTS = [
  {
    id: 'CLT-001',
    name: 'TechCo AI',
    logo: '🤖',
    industry: 'Artificial Intelligence',
    tier: 'Tier 1',
    activeApplications: 4,
    revenue: '$128,000',
    since: 'Jan 2024',
    contact: 'david.kim@techcoai.com',
  },
  {
    id: 'CLT-002',
    name: 'BioGen Labs',
    logo: '🧬',
    industry: 'Biotechnology',
    tier: 'Tier 2',
    activeApplications: 2,
    revenue: '$64,500',
    since: 'Mar 2024',
    contact: 'sarah.chen@biogenlabs.com',
  },
  {
    id: 'CLT-003',
    name: 'GreenEnergy Inc.',
    logo: '⚡',
    industry: 'Renewable Energy',
    tier: 'Tier 3',
    activeApplications: 1,
    revenue: '$32,000',
    since: 'Jun 2024',
    contact: 'michael.torres@greenenergy.com',
  },
  {
    id: 'CLT-004',
    name: 'AutoDrive Systems',
    logo: '🚗',
    industry: 'Automotive Technology',
    tier: 'Tier 1',
    activeApplications: 3,
    revenue: '$95,000',
    since: 'Feb 2024',
    contact: 'alex.johnson@autodrive.com',
  },
];

const MOCK_APPLICATIONS = [
  {
    id: 'PAT-2026-001',
    title: 'AI-Powered Task Automation Engine',
    client: 'TechCo AI',
    type: 'Utility Patent',
    filingType: 'US Filing',
    status: 'Expert Review',
    priority: 'urgent',
    tier: 'Tier 1',
    progress: 65,
    assignedTo: 'Dr. Emily Park',
    lastUpdated: '2026-03-15',
  },
  {
    id: 'PAT-2026-002',
    title: 'CRISPR Gene Editing Improvement',
    client: 'BioGen Labs',
    type: 'Utility Patent',
    filingType: 'PCT Filing',
    status: 'Pending Review',
    priority: 'normal',
    tier: 'Tier 2',
    progress: 20,
    assignedTo: 'Unassigned',
    lastUpdated: '2026-03-12',
  },
  {
    id: 'PAT-2026-003',
    title: 'Solar Panel Efficiency Coating',
    client: 'GreenEnergy Inc.',
    type: 'Design Patent',
    filingType: 'US Filing',
    status: 'Drafting',
    priority: 'normal',
    tier: 'Tier 3',
    progress: 40,
    assignedTo: 'James Liu',
    lastUpdated: '2026-03-10',
  },
  {
    id: 'PAT-2026-004',
    title: 'Autonomous Vehicle Lane Detection Algorithm',
    client: 'AutoDrive Systems',
    type: 'Utility Patent',
    filingType: 'PCT Filing',
    status: 'Filing',
    priority: 'high',
    tier: 'Tier 1',
    progress: 90,
    assignedTo: 'Dr. Emily Park',
    lastUpdated: '2026-03-16',
  },
  {
    id: 'PAT-2026-005',
    title: 'Neural Interface Haptic Feedback System',
    client: 'TechCo AI',
    type: 'Utility Patent',
    filingType: 'US Filing',
    status: 'Pending Review',
    priority: 'normal',
    tier: 'Tier 1',
    progress: 10,
    assignedTo: 'Unassigned',
    lastUpdated: '2026-03-17',
  },
];

// ─── Exported API functions ───────────────────────────────────────────────────

/**
 * Fetch all patent firm clients.
 * @returns {Promise<Array>}
 */
export async function fetchClients() {
  // Uncomment below to use a real backend endpoint:
  // const response = await fetch(`${API_URL}/patent-firm/clients`);
  // if (!response.ok) throw new Error('Failed to fetch clients');
  // return response.json();

  // Mock: simulate a brief network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_CLIENTS;
}

/**
 * Fetch all patent applications.
 * @returns {Promise<Array>}
 */
export async function fetchApplications() {
  // Uncomment below to use a real backend endpoint:
  // const response = await fetch(`${API_URL}/patent-firm/applications`);
  // if (!response.ok) throw new Error('Failed to fetch applications');
  // return response.json();

  // Mock: simulate a brief network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_APPLICATIONS;
}

/**
 * Fetch a single patent application by ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function fetchApplicationById(id) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const app = MOCK_APPLICATIONS.find((a) => a.id === id);
  if (!app) throw new Error(`Application ${id} not found`);
  return app;
}
