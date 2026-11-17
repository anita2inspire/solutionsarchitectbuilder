// Shared definitions: categories, reusable options, containers.
window.AWS_SERVICES = [];

window.AWS_CATEGORIES = [
  { id: 'compute',    name: 'Compute',                    color: '#c2570c' },
  { id: 'containers', name: 'Containers',                 color: '#b4492a' },
  { id: 'serverless', name: 'Serverless',                 color: '#a8640a' },
  { id: 'storage',    name: 'Storage',                    color: '#2f8f3f' },
  { id: 'database',   name: 'Database',                   color: '#3b5bdb' },
  { id: 'network',    name: 'Networking & Content',       color: '#7a3fd1' },
  { id: 'security',   name: 'Security & Identity',        color: '#c92a4a' },
  { id: 'integration',name: 'Application Integration',    color: '#c2257a' },
  { id: 'analytics',  name: 'Analytics',                  color: '#0b7f8c' },
  { id: 'ml',         name: 'Machine Learning',           color: '#1c8a62' },
  { id: 'mgmt',       name: 'Management & Governance',    color: '#a3278f' },
  { id: 'cost',       name: 'Cost Management',            color: '#6b7a0f' },
  { id: 'migration',  name: 'Migration & Transfer',       color: '#4c6ef5' },
  { id: 'frontend',   name: 'Front-End Web & Mobile',     color: '#d6336c' },
  { id: 'devtools',   name: 'Developer Tools',            color: '#5c6b7a' },
  { id: 'media',      name: 'Media Services',             color: '#9c36b5' }
];

// Containers nest: Region > VPC > AZ > Subnet. Others (Account, Edge) are free-standing.
window.AWS_CONTAINERS = [
  { id: 'c-region', name: 'Region',          abbr: 'RG', parents: [null],            w: 900, h: 560, color: '#5c6b7a',
    options: [{ key: 'name', label: 'Region', type: 'select', choices: ['us-east-1','us-west-2','eu-west-1','eu-central-1','ap-southeast-1','ap-northeast-1','ca-central-1'], default: 'us-east-1' }] },
  { id: 'c-vpc',    name: 'VPC',             abbr: 'VPC', parents: ['c-region'],     w: 820, h: 460, color: '#7a3fd1',
    options: [{ key: 'cidr', label: 'CIDR block', type: 'select', choices: ['10.0.0.0/16','172.16.0.0/16','192.168.0.0/16'], default: '10.0.0.0/16' },
              { key: 'dns', label: 'DNS hostnames', type: 'toggle', default: true }] },
  { id: 'c-az',     name: 'Availability Zone', abbr: 'AZ', parents: ['c-vpc'],       w: 380, h: 380, color: '#2f8f3f',
    options: [{ key: 'name', label: 'Zone', type: 'select', choices: ['a','b','c'], default: 'a' }] },
  { id: 'c-public', name: 'Public subnet',   abbr: 'PUB', parents: ['c-az'],         w: 340, h: 150, color: '#2f8f3f',
    options: [{ key: 'igw', label: 'Route to Internet Gateway', type: 'toggle', default: true }] },
  { id: 'c-private',name: 'Private subnet',  abbr: 'PRV', parents: ['c-az'],         w: 340, h: 150, color: '#3b5bdb',
    options: [{ key: 'nat', label: 'Outbound via NAT Gateway', type: 'toggle', default: true }] },
  { id: 'c-account',name: 'AWS account',     abbr: 'ACC', parents: [null],            w: 960, h: 620, color: '#c2570c',
    options: [{ key: 'env', label: 'Environment', type: 'select', choices: ['Production','Staging','Development','Shared services'], default: 'Production' }] },
  { id: 'c-edge',   name: 'Edge / Internet', abbr: 'EDG', parents: [null],            w: 300, h: 200, color: '#5c6b7a', options: [] }
];

// Helpers for building option lists.
window.OPT = {
  toggle: (key, label, def) => ({ key, label, type: 'toggle', default: !!def }),
  select: (key, label, choices, def) => ({ key, label, type: 'select', choices, default: def || choices[0] }),
  multiAz: (def) => ({ key: 'multiAz', label: 'Multi-AZ', type: 'toggle', default: !!def }),
  enc: (def) => ({ key: 'encrypted', label: 'Encryption at rest (KMS)', type: 'toggle', default: def !== false }),
  backup: (def) => ({ key: 'backup', label: 'Automated backups', type: 'toggle', default: !!def })
};

window.defSvc = function (id, name, abbr, cat, options, tip) {
  window.AWS_SERVICES.push({ id, name, abbr, cat, options: options || [], tip: tip || '' });
};
