// Compute, Containers, Serverless, Storage, Database
(function () {
  const O = window.OPT, d = window.defSvc;

  // Compute
  d('ec2', 'Amazon EC2', 'EC2', 'compute', [
    O.select('purchase', 'Purchase option', ['On-Demand', 'Reserved', 'Spot', 'Savings Plan', 'Dedicated Host'], 'On-Demand'),
    O.select('family', 'Instance family', ['General purpose (M)', 'Compute optimized (C)', 'Memory optimized (R)', 'Storage optimized (I)', 'Burstable (T)', 'GPU (G/P)'], 'General purpose (M)'),
    O.toggle('asg', 'Part of an Auto Scaling group', false),
    O.toggle('publicIp', 'Public IP', false)
  ], 'Virtual servers. Spot is up to ~90% cheaper but can be interrupted.');
  d('asg', 'EC2 Auto Scaling', 'ASG', 'compute', [
    O.select('policy', 'Scaling policy', ['Target tracking', 'Step', 'Scheduled', 'Predictive'], 'Target tracking'),
    O.toggle('multiAz', 'Spans multiple AZs', true)
  ], 'Adds or removes instances to follow demand.');
  d('beanstalk', 'AWS Elastic Beanstalk', 'EB', 'compute', [
    O.select('env', 'Environment type', ['Web server', 'Worker'], 'Web server'),
    O.toggle('lb', 'Load balanced', true)
  ]);
  d('batch', 'AWS Batch', 'BAT', 'compute', [O.select('compute', 'Compute', ['EC2', 'EC2 Spot', 'Fargate'], 'EC2 Spot')]);
  d('outposts', 'AWS Outposts', 'OUT', 'compute', [O.select('form', 'Form factor', ['Rack', 'Server'], 'Rack')], 'AWS hardware running in your own data centre.');
  d('sar', 'Serverless Application Repository', 'SAR', 'compute');
  d('vmware', 'VMware Cloud on AWS', 'VMW', 'compute');
  d('wavelength', 'AWS Wavelength', 'WVL', 'compute', [], 'Compute at 5G network edges for ultra-low latency.');

  // Containers
  d('ecr', 'Amazon ECR', 'ECR', 'containers', [O.toggle('scan', 'Scan on push', true), O.toggle('replication', 'Cross-region replication', false)]);
  d('ecs', 'Amazon ECS', 'ECS', 'containers', [
    O.select('launch', 'Launch type', ['Fargate', 'EC2'], 'Fargate'),
    O.toggle('multiAz', 'Tasks across multiple AZs', true)
  ]);
  d('ecsanywhere', 'Amazon ECS Anywhere', 'ECA', 'containers');
  d('eks', 'Amazon EKS', 'EKS', 'containers', [
    O.select('nodes', 'Nodes', ['Managed node groups', 'Fargate', 'Self-managed'], 'Managed node groups'),
    O.toggle('multiAz', 'Nodes across multiple AZs', true)
  ]);
  d('eksanywhere', 'Amazon EKS Anywhere', 'EKA', 'containers');
  d('eksdistro', 'Amazon EKS Distro', 'EKD', 'containers');
  d('fargate', 'AWS Fargate', 'FG', 'serverless', [
    O.select('arch', 'CPU architecture', ['x86', 'Graviton (ARM)'], 'x86'),
    O.toggle('spot', 'Fargate Spot', false)
  ], 'Serverless compute for containers.');

  // Serverless
  d('lambda', 'AWS Lambda', 'λ', 'serverless', [
    O.select('invoke', 'Invocation', ['Synchronous', 'Asynchronous', 'Event source mapping'], 'Synchronous'),
    O.toggle('provisioned', 'Provisioned concurrency', false),
    O.toggle('vpc', 'Attached to a VPC', false),
    O.select('arch', 'Architecture', ['x86', 'Graviton (ARM)'], 'x86')
  ], 'Runs code on events. Max 15 min per invocation.');

  // Storage
  d('s3', 'Amazon S3', 'S3', 'storage', [
    O.select('class', 'Storage class', ['Standard', 'Intelligent-Tiering', 'Standard-IA', 'One Zone-IA', 'Glacier Instant', 'Glacier Flexible', 'Glacier Deep Archive'], 'Standard'),
    O.toggle('versioning', 'Versioning', false),
    O.toggle('crr', 'Cross-region replication', false),
    O.toggle('lifecycle', 'Lifecycle rules', false),
    O.toggle('block', 'Block public access', true),
    O.enc()
  ], 'Object storage with 11 nines of durability.');
  d('glacier', 'Amazon S3 Glacier', 'GLC', 'storage', [O.select('tier', 'Retrieval', ['Expedited', 'Standard', 'Bulk'], 'Standard'), O.toggle('vaultLock', 'Vault Lock (WORM)', false)]);
  d('ebs', 'Amazon EBS', 'EBS', 'storage', [
    O.select('type', 'Volume type', ['gp3 (SSD)', 'io2 (Provisioned IOPS)', 'st1 (Throughput HDD)', 'sc1 (Cold HDD)'], 'gp3 (SSD)'),
    O.toggle('snapshots', 'Scheduled snapshots', false),
    O.enc()
  ], 'Block storage tied to one AZ.');
  d('efs', 'Amazon EFS', 'EFS', 'storage', [
    O.select('mode', 'Performance mode', ['General purpose', 'Max I/O'], 'General purpose'),
    O.select('class', 'Storage class', ['Standard (multi-AZ)', 'One Zone'], 'Standard (multi-AZ)'),
    O.enc()
  ], 'Shared NFS file system for Linux.');
  d('fsx', 'Amazon FSx', 'FSx', 'storage', [
    O.select('type', 'File system', ['Windows File Server', 'Lustre', 'NetApp ONTAP', 'OpenZFS'], 'Windows File Server'),
    O.multiAz(false)
  ]);
  d('backup', 'AWS Backup', 'BKP', 'storage', [O.toggle('crossRegion', 'Cross-region copy', false), O.toggle('vaultLock', 'Vault Lock', false)]);
  d('storagegw', 'AWS Storage Gateway', 'SGW', 'storage', [O.select('type', 'Gateway type', ['S3 File', 'FSx File', 'Volume', 'Tape'], 'S3 File')]);

  // Database
  d('rds', 'Amazon RDS', 'RDS', 'database', [
    O.select('engine', 'Engine', ['MySQL', 'PostgreSQL', 'MariaDB', 'Oracle', 'SQL Server'], 'PostgreSQL'),
    O.multiAz(false),
    O.toggle('replica', 'Read replica', false),
    O.backup(true),
    O.enc()
  ], 'Managed relational database. Multi-AZ gives a standby for failover.');
  d('aurora', 'Amazon Aurora', 'AUR', 'database', [
    O.select('engine', 'Compatibility', ['MySQL', 'PostgreSQL'], 'PostgreSQL'),
    O.toggle('multiAz', 'Replicas in multiple AZs', true),
    O.toggle('global', 'Global Database', false),
    O.enc()
  ], 'Cloud-native relational DB with 6 copies across 3 AZs.');
  d('auroraserverless', 'Amazon Aurora Serverless', 'AUS', 'database', [
    O.select('engine', 'Compatibility', ['MySQL', 'PostgreSQL'], 'PostgreSQL'),
    O.toggle('scaleToZero', 'Scale to zero', false)
  ]);
  d('dynamodb', 'Amazon DynamoDB', 'DDB', 'database', [
    O.select('capacity', 'Capacity mode', ['On-demand', 'Provisioned', 'Provisioned + auto scaling'], 'On-demand'),
    O.toggle('global', 'Global tables', false),
    O.toggle('dax', 'DAX cache', false),
    O.toggle('pitr', 'Point-in-time recovery', false),
    O.toggle('ttl', 'TTL', false)
  ], 'Serverless key-value and document store, single-digit ms.');
  d('documentdb', 'Amazon DocumentDB', 'DOC', 'database', [O.multiAz(true), O.enc()]);
  d('elasticache', 'Amazon ElastiCache', 'EC', 'database', [
    O.select('engine', 'Engine', ['Redis', 'Memcached', 'Valkey'], 'Redis'),
    O.toggle('multiAz', 'Multi-AZ replicas', false),
    O.toggle('cluster', 'Cluster mode', false)
  ], 'In-memory cache. Redis supports persistence and replication; Memcached does not.');
  d('keyspaces', 'Amazon Keyspaces', 'KS', 'database', [O.select('capacity', 'Capacity mode', ['On-demand', 'Provisioned'], 'On-demand')]);
  d('neptune', 'Amazon Neptune', 'NEP', 'database', [O.multiAz(true)], 'Graph database.');
  d('redshift', 'Amazon Redshift', 'RS', 'analytics', [
    O.select('mode', 'Deployment', ['Provisioned', 'Serverless'], 'Provisioned'),
    O.toggle('spectrum', 'Spectrum (query S3)', false),
    O.toggle('multiAz', 'Multi-AZ', false)
  ], 'Data warehouse.');
})();
