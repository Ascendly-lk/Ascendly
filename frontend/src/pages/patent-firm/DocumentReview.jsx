<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import { useState } from 'react';
>>>>>>> parent of ae17c912 (Update by deleting some files)
import {
  Lock,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Eye,
  Search,
  Filter,
  FolderOpen,
  Shield,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import TopBar from '../../components/dashboard/TopBar';
<<<<<<< HEAD
import { fetchDocuments } from '../../utils/patent-api';
import './DocumentReview.css';
import '../dashboard/StartupDashboard.css';

=======
import './DocumentReview.css';
import '../dashboard/StartupDashboard.css';

const mockDocuments = [
  {
    id: '1',
    name: 'Technical Specifications - AI Engine.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedDate: 'March 1, 2026',
    client: 'TechCo AI',
    applicationId: 'PAT-2026-001',
    status: 'reviewed',
    reviewer: 'Dr. Sarah Chen',
  },
  {
    id: '2',
    name: 'System Architecture Diagram.png',
    type: 'image',
    size: '1.1 MB',
    uploadedDate: 'March 1, 2026',
    client: 'TechCo AI',
    applicationId: 'PAT-2026-001',
    status: 'approved',
    reviewer: 'Dr. Sarah Chen',
  },
  {
    id: '3',
    name: 'IoT Sensor Schematics.pdf',
    type: 'pdf',
    size: '3.2 MB',
    uploadedDate: 'March 3, 2026',
    client: 'IoT Innovations',
    applicationId: 'PAT-2026-002',
    status: 'reviewed',
    reviewer: 'Michael Rodriguez',
  },
  {
    id: '4',
    name: 'Gene Editing Documentation.pdf',
    type: 'pdf',
    size: '5.8 MB',
    uploadedDate: 'March 6, 2026',
    client: 'BioTech Labs',
    applicationId: 'PAT-2026-004',
    status: 'pending',
  },
  {
    id: '5',
    name: 'Solar Panel Design.pdf',
    type: 'pdf',
    size: '2.1 MB',
    uploadedDate: 'March 6, 2026',
    client: 'GreenEnergy Co',
    applicationId: 'PAT-2026-005',
    status: 'pending',
  },
];

>>>>>>> parent of ae17c912 (Update by deleting some files)
const getFileIcon = (type) => {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'image':
      return ImageIcon;
    default:
      return File;
  }
};

const statusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'dr-status dr-status-pending';
    case 'reviewed':
      return 'dr-status dr-status-reviewed';
    case 'approved':
      return 'dr-status dr-status-approved';
    default:
      return 'dr-status';
  }
};

const DocumentReview = () => {
<<<<<<< HEAD
  const [mockDocuments, setMockDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments()
        .then(data => {
            setMockDocuments(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Failed to fetch documents", err);
            setLoading(false);
        });
  }, []);
=======
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState('all');
>>>>>>> parent of ae17c912 (Update by deleting some files)

  const filteredDocuments = mockDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.applicationId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingDocs = mockDocuments.filter((d) => d.status === 'pending');
  const reviewedDocs = mockDocuments.filter((d) => d.status === 'reviewed' || d.status === 'approved');

  const currentDocuments = tab === 'pending' ? pendingDocs : tab === 'reviewed' ? reviewedDocs : filteredDocuments;

  return (
    <div className="startup-dashboard">
      <TopBar />
      <div className="dashboard-content">
        <div className="dashboard-row dashboard-stats" style={{ marginBottom: '20px' }}>
          <div className="pf-card">
            <div className="pf-card-header">
              <AlertCircle />
              <h3>Pending Review</h3>
            </div>
            <div className="pf-card-desc" style={{ fontSize: '28px', marginTop: '8px' }}>{pendingDocs.length}</div>
          </div>
          <div className="pf-card">
            <div className="pf-card-header">
              <CheckCircle2 />
              <h3>Reviewed</h3>
            </div>
            <div className="pf-card-desc" style={{ fontSize: '28px', marginTop: '8px' }}>{reviewedDocs.length}</div>
          </div>
          <div className="pf-card">
            <div className="pf-card-header">
              <Shield />
              <h3>Encryption</h3>
            </div>
            <div className="pf-card-desc" style={{ fontSize: '28px', marginTop: '8px' }}>AES-256</div>
          </div>
        </div>

        <div className="dr-tools-bar">
          <div className="dr-search-box">
            <Search className="dr-icon" />
            <input
              type="text"
              value={searchQuery}
              placeholder="Search documents..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="dr-btn-outline"><Filter className="dr-icon" /> Filter</button>
        </div>

        <div className="dr-tabs">
          <button className={tab === 'all' ? 'dr-tab active' : 'dr-tab'} onClick={() => setTab('all')}>
            All Documents ({mockDocuments.length})
          </button>
          <button className={tab === 'pending' ? 'dr-tab active' : 'dr-tab'} onClick={() => setTab('pending')}>
            Pending Review ({pendingDocs.length})
          </button>
          <button className={tab === 'reviewed' ? 'dr-tab active' : 'dr-tab'} onClick={() => setTab('reviewed')}>
            Reviewed ({reviewedDocs.length})
          </button>
        </div>

        <div className="dr-list">
          {currentDocuments.length === 0 ? (
            <div className="dr-empty">
              <FolderOpen className="dr-empty-icon" />
              <p>No documents found</p>
            </div>
          ) : (
            currentDocuments.map((doc) => {
              const FileIcon = getFileIcon(doc.type);
              return (
                <div key={doc.id} className="dr-row">
                  <div className="dr-row-left">
                    <div className="dr-file-icon"><FileIcon /></div>
                    <div className="dr-row-info">
                      <div className="dr-title">{doc.name}</div>
                      <div className="dr-meta">
                        <span>{doc.client}</span>
                        <span>•</span>
                        <span>{doc.applicationId}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="dr-row-right">
                    <span className={statusClass(doc.status)}>{doc.status}</span>
                    <div className="dr-actions">
                      <button className="dr-icon-btn"><Eye /></button>
                      <button className="dr-icon-btn"><Download /></button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentReview;
