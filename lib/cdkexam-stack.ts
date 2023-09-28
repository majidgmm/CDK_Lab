import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkexamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    //Create VPC
    
  const vpc = new ec2.Vpc(this, 'Vpc', {
    ipAddresses: ec2.IpAddresses.cidr('10.30.0.0/16')
  });    

    //Create EC2 in public Subnet
  const instance1 = new ec2.Instance(this, 'Exam-Lab-EC2', {
    vpc: vpc,
    //securityGroup: securityGroup,
    instanceName: 'public-EC2',
    instanceType: ec2.InstanceType.of( 
      ec2.InstanceClass.T2,
      ec2.InstanceSize.MICRO
    ),
    machineImage: ec2.MachineImage.latestAmazonLinux({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    }),

  })  
  
  //Create SQL Queue
  
  new sqs.Queue(this, 'Queue');
  
  //Create SNS Topic
  
  const topic = new sns.Topic(this, 'MyTopic');
  
  //Create a Secret
  
  const masterUserSecret = new Secret(this, "metrodb-secrets", {
    secretName: "metrodb-secrets",
    description: "User credentials",
    generateSecretString: {
      secretStringTemplate: JSON.stringify({ username: "admin" }),
      generateStringKey: "password",
      passwordLength: 16,
      excludePunctuation: true,
    },
  });  
  
  }
}
