// Networking, Security, Integration, Analytics
(function () {
  const O = window.OPT, d = window.defSvc;

  // Networking & content delivery
  d('vpc', 'Amazon VPC (endpoints, gateways)', 'VPC', 'network', [
    O.select('kind', 'Component', ['Internet Gateway', 'NAT Gateway', 'Gateway endpoint (S3/DynamoDB)', 'Interface endpoint', 'Peering connection', 'Egress-only IGW'], 'Internet Gateway'),
    O.toggle('multiAz', 'One per AZ (NAT only)', false)
  ], 'Use the Component setting to turn this into an IGW, NAT, or endpoint.');
  d('elb', 'Elastic Load Balancing', 'ELB', 'network', [
    O.select('type', 'Type', ['Application (ALB)', 'Network (NLB)', 'Gateway (GWLB)', 'Classic'], 'Application (ALB)'),
    O.select('scheme', 'Scheme', ['Internet-facing', 'Internal'], 'Internet-facing'),
    O.toggle('crossZone', 'Cross-zone load balancing', true),
    O.toggle('sticky', 'Sticky sessions', false)
  ], 'ALB is layer 7 (HTTP). NLB is layer 4 with static IPs and extreme throughput.');
  d('cloudfront', 'Amazon CloudFront', 'CF', 'network', [
    O.toggle('oac', 'Origin Access Control (S3)', true),
    O.toggle('waf', 'Protected by WAF', false),
    O.select('price', 'Price class', ['All edge locations', 'North America + Europe', 'Lowest cost'], 'All edge locations'),
    O.toggle('https', 'Redirect HTTP to HTTPS', true)
  ], 'CDN. Caches content at edge locations.');
  d('route53', 'Amazon Route 53', 'R53', 'network', [
    O.select('policy', 'Routing policy', ['Simple', 'Weighted', 'Latency', 'Failover', 'Geolocation', 'Geoproximity', 'Multivalue'], 'Simple'),
    O.toggle('healthChecks', 'Health checks', false),
    O.select('zone', 'Hosted zone', ['Public', 'Private'], 'Public')
  ]);
  d('globalaccel', 'AWS Global Accelerator', 'GA', 'network', [O.toggle('endpointGroups', 'Multi-region endpoints', true)], 'Static anycast IPs over the AWS backbone.');
  d('privatelink', 'AWS PrivateLink', 'PL', 'network');
  d('tgw', 'AWS Transit Gateway', 'TGW', 'network', [O.toggle('multicast', 'Multicast', false), O.toggle('peering', 'Inter-region peering', false)], 'Hub connecting many VPCs and on-premises networks.');
  d('directconnect', 'AWS Direct Connect', 'DX', 'network', [
    O.select('capacity', 'Connection', ['1 Gbps', '10 Gbps', '100 Gbps', 'Hosted (50 Mbps - 10 Gbps)'], '1 Gbps'),
    O.toggle('vpnBackup', 'Site-to-Site VPN as backup', false),
    O.toggle('macsec', 'MACsec encryption', false)
  ], 'Private dedicated link. Not encrypted by default.');
  d('s2svpn', 'AWS Site-to-Site VPN', 'VPN', 'network', [O.toggle('acceleration', 'Accelerated (Global Accelerator)', false), O.select('routing', 'Routing', ['Dynamic (BGP)', 'Static'], 'Dynamic (BGP)')]);
  d('clientvpn', 'AWS Client VPN', 'CVPN', 'network');

  // Security, identity, compliance
  d('iam', 'AWS IAM', 'IAM', 'security', [
    O.select('kind', 'Component', ['Role', 'User', 'Group', 'Policy', 'Permission boundary'], 'Role'),
    O.toggle('mfa', 'MFA required', false)
  ], 'Prefer roles with temporary credentials over long-lived keys.');
  d('identitycenter', 'AWS IAM Identity Center', 'SSO', 'security');
  d('cognito', 'Amazon Cognito', 'COG', 'security', [O.select('pool', 'Type', ['User pool', 'Identity pool'], 'User pool'), O.toggle('mfa', 'MFA', false), O.toggle('social', 'Social identity providers', false)]);
  d('kms', 'AWS KMS', 'KMS', 'security', [O.select('key', 'Key type', ['AWS managed', 'Customer managed', 'Multi-Region key'], 'Customer managed'), O.toggle('rotation', 'Automatic rotation', true)]);
  d('secrets', 'AWS Secrets Manager', 'SM', 'security', [O.toggle('rotation', 'Automatic rotation', true), O.toggle('replication', 'Multi-Region replication', false)]);
  d('acm', 'AWS Certificate Manager', 'ACM', 'security');
  d('cloudhsm', 'AWS CloudHSM', 'HSM', 'security', [O.toggle('multiAz', 'Cluster across AZs', true)]);
  d('waf', 'AWS WAF', 'WAF', 'security', [O.select('attach', 'Attached to', ['CloudFront', 'ALB', 'API Gateway', 'AppSync'], 'CloudFront'), O.toggle('managedRules', 'Managed rule groups', true), O.toggle('rateLimit', 'Rate-based rule', false)]);
  d('shield', 'AWS Shield', 'SHD', 'security', [O.select('tier', 'Tier', ['Standard', 'Advanced'], 'Standard')]);
  d('firewallmgr', 'AWS Firewall Manager', 'FWM', 'security');
  d('networkfw', 'AWS Network Firewall', 'NFW', 'security', [O.toggle('multiAz', 'Endpoint per AZ', true)]);
  d('guardduty', 'Amazon GuardDuty', 'GD', 'security');
  d('inspector', 'Amazon Inspector', 'INS', 'security');
  d('macie', 'Amazon Macie', 'MAC', 'security');
  d('detective', 'Amazon Detective', 'DET', 'security');
  d('securityhub', 'AWS Security Hub', 'SH', 'security');
  d('directory', 'AWS Directory Service', 'DIR', 'security', [O.select('type', 'Type', ['AWS Managed Microsoft AD', 'AD Connector', 'Simple AD'], 'AWS Managed Microsoft AD')]);
  d('ram', 'AWS Resource Access Manager', 'RAM', 'security');
  d('artifact', 'AWS Artifact', 'ART', 'security');

  // Application integration
  d('sqs', 'Amazon SQS', 'SQS', 'integration', [
    O.select('type', 'Queue type', ['Standard', 'FIFO'], 'Standard'),
    O.toggle('dlq', 'Dead-letter queue', false),
    O.enc()
  ], 'Decouples producers and consumers. FIFO preserves order.');
  d('sns', 'Amazon SNS', 'SNS', 'integration', [O.select('type', 'Topic type', ['Standard', 'FIFO'], 'Standard'), O.toggle('fanout', 'Fan-out to multiple subscribers', true)]);
  d('eventbridge', 'Amazon EventBridge', 'EB', 'integration', [O.select('source', 'Event source', ['AWS services', 'SaaS partner', 'Custom app', 'Schedule'], 'AWS services')]);
  d('stepfunctions', 'AWS Step Functions', 'SFN', 'integration', [O.select('type', 'Workflow', ['Standard', 'Express'], 'Standard')]);
  d('mq', 'Amazon MQ', 'MQ', 'integration', [O.select('engine', 'Engine', ['ActiveMQ', 'RabbitMQ'], 'ActiveMQ'), O.multiAz(true)]);
  d('appflow', 'Amazon AppFlow', 'AF', 'integration');

  // Analytics
  d('athena', 'Amazon Athena', 'ATH', 'analytics', [], 'Serverless SQL over S3.');
  d('dataexchange', 'AWS Data Exchange', 'ADX', 'analytics');
  d('datapipeline', 'AWS Data Pipeline', 'DPL', 'analytics');
  d('emr', 'Amazon EMR', 'EMR', 'analytics', [O.select('mode', 'Deployment', ['On EC2', 'On EKS', 'Serverless'], 'On EC2'), O.toggle('spot', 'Spot task nodes', true)]);
  d('glue', 'AWS Glue', 'GLU', 'analytics', [O.select('part', 'Component', ['ETL job', 'Crawler', 'Data Catalog'], 'ETL job')]);
  d('kinesis', 'Amazon Kinesis', 'KIN', 'analytics', [O.select('kind', 'Service', ['Data Streams', 'Data Firehose', 'Data Analytics'], 'Data Streams'), O.select('mode', 'Capacity', ['On-demand', 'Provisioned'], 'On-demand')]);
  d('lakeformation', 'AWS Lake Formation', 'LF', 'analytics');
  d('msk', 'Amazon MSK', 'MSK', 'analytics', [O.multiAz(true), O.toggle('serverless', 'Serverless', false)], 'Managed Apache Kafka.');
  d('opensearch', 'Amazon OpenSearch Service', 'OS', 'analytics', [O.toggle('multiAz', 'Multi-AZ with standby', false), O.toggle('ultrawarm', 'UltraWarm storage', false)]);
  d('quick', 'Amazon Quick', 'QS', 'analytics');
})();
