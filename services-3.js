// ML, Management, Cost, Migration, Front-end, Dev tools, Media
(function () {
  const O = window.OPT, d = window.defSvc;

  // Machine learning
  d('sagemaker', 'Amazon SageMaker AI', 'SM', 'ml', [O.select('inference', 'Inference', ['Real-time', 'Serverless', 'Batch transform', 'Asynchronous'], 'Real-time')]);
  d('comprehend', 'Amazon Comprehend', 'CMP', 'ml');
  d('lex', 'Amazon Lex', 'LEX', 'ml');
  d('polly', 'Amazon Polly', 'PLY', 'ml');
  d('rekognition', 'Amazon Rekognition', 'REK', 'ml');
  d('textract', 'Amazon Textract', 'TXT', 'ml');
  d('transcribe', 'Amazon Transcribe', 'TRN', 'ml');
  d('translate', 'Amazon Translate', 'TLR', 'ml');

  // Management & governance
  d('cloudwatch', 'Amazon CloudWatch', 'CW', 'mgmt', [O.select('part', 'Component', ['Metrics & alarms', 'Logs', 'Events', 'Dashboards', 'Synthetics'], 'Metrics & alarms')]);
  d('cloudtrail', 'AWS CloudTrail', 'CT', 'mgmt', [O.toggle('org', 'Organization trail', false), O.toggle('validation', 'Log file validation', true)], 'Records API calls for audit.');
  d('config', 'AWS Config', 'CFG', 'mgmt');
  d('cloudformation', 'AWS CloudFormation', 'CFN', 'mgmt', [O.toggle('stackset', 'StackSets (multi-account)', false)]);
  d('organizations', 'AWS Organizations', 'ORG', 'mgmt', [O.toggle('scp', 'Service control policies', true)]);
  d('controltower', 'AWS Control Tower', 'CTW', 'mgmt');
  d('ssm', 'AWS Systems Manager', 'SSM', 'mgmt', [O.select('part', 'Component', ['Session Manager', 'Parameter Store', 'Patch Manager', 'Run Command', 'Automation'], 'Session Manager')]);
  d('autoscaling', 'AWS Auto Scaling', 'AS', 'mgmt');
  d('computeoptimizer', 'AWS Compute Optimizer', 'CO', 'mgmt');
  d('health', 'AWS Health Dashboard', 'HLT', 'mgmt');
  d('licensemgr', 'AWS License Manager', 'LM', 'mgmt');
  d('grafana', 'Amazon Managed Grafana', 'GRF', 'mgmt');
  d('prometheus', 'Amazon Managed Service for Prometheus', 'AMP', 'mgmt');
  d('console', 'AWS Management Console', 'CON', 'mgmt');
  d('cli', 'AWS CLI', 'CLI', 'mgmt');
  d('proton', 'AWS Proton', 'PRO', 'mgmt');
  d('servicecatalog', 'AWS Service Catalog', 'SC', 'mgmt');
  d('wellarchitected', 'AWS Well-Architected Tool', 'WA', 'mgmt');

  // Cost management
  d('budgets', 'AWS Budgets', 'BUD', 'cost');
  d('cur', 'AWS Cost and Usage Report', 'CUR', 'cost');
  d('costexplorer', 'AWS Cost Explorer', 'CE', 'cost');
  d('savingsplans', 'Savings Plans', 'SP', 'cost', [O.select('type', 'Type', ['Compute', 'EC2 Instance', 'SageMaker'], 'Compute'), O.select('term', 'Term', ['1 year', '3 years'], '1 year'), O.select('pay', 'Payment', ['No upfront', 'Partial upfront', 'All upfront'], 'No upfront')]);

  // Migration & transfer
  d('discovery', 'AWS Application Discovery Service', 'ADS', 'migration');
  d('mgn', 'AWS Application Migration Service', 'MGN', 'migration');
  d('datasync', 'AWS DataSync', 'DS', 'migration');
  d('dms', 'AWS DMS', 'DMS', 'migration', [O.toggle('cdc', 'Ongoing replication (CDC)', true), O.toggle('sct', 'Schema Conversion Tool', false), O.multiAz(false)]);
  d('snow', 'AWS Snow Family', 'SNW', 'migration', [O.select('device', 'Device', ['Snowcone', 'Snowball Edge Storage', 'Snowball Edge Compute', 'Snowmobile'], 'Snowball Edge Storage')]);
  d('transfer', 'AWS Transfer Family', 'TF', 'migration', [O.select('protocol', 'Protocol', ['SFTP', 'FTPS', 'FTP', 'AS2'], 'SFTP'), O.select('backend', 'Storage', ['S3', 'EFS'], 'S3')]);

  // Front-end web & mobile
  d('amplify', 'AWS Amplify', 'AMP', 'frontend');
  d('apigateway', 'Amazon API Gateway', 'APIG', 'frontend', [
    O.select('type', 'API type', ['REST', 'HTTP', 'WebSocket'], 'REST'),
    O.select('endpoint', 'Endpoint', ['Edge-optimized', 'Regional', 'Private'], 'Regional'),
    O.toggle('cache', 'Caching', false),
    O.toggle('throttle', 'Throttling / usage plans', true)
  ]);
  d('devicefarm', 'AWS Device Farm', 'DF', 'frontend');

  // Developer tools
  d('xray', 'AWS X-Ray', 'XR', 'devtools');

  // Media
  d('kvs', 'Amazon Kinesis Video Streams', 'KVS', 'media');
})();

// Extra generic items every design needs.
window.defSvc('users', 'Users / Clients', 'USR', 'network', [window.OPT.select('kind', 'Type', ['Web users', 'Mobile users', 'IoT devices', 'Corporate network', 'Third-party system'], 'Web users')], 'The people or systems that call your architecture.');
window.defSvc('onprem', 'On-premises data centre', 'DC', 'network', [window.OPT.select('kind', 'Contains', ['Servers', 'Database', 'File storage', 'Mixed'], 'Mixed')]);
