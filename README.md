# fastapi-mysql-app
rootCloud-1

Search: EC2
Click Launch Instance

Choose a name

✅ Step 3 — Choose OS (AMI)
Pick:
🟢 Ubuntu (recommended)
👉 Ubuntu Server

✅ Step 4 — Choose instance type
Pick:
t2.micro

✅ Step 5 — Create key pair 🔑 (IMPORTANT)
Click Create new key pair
Name it:
my-key

✅ Step 6 — Network settings
Create / select a Security Group
Allow:
SSH → port 22 (your IP)
HTTP → port 80 (optional)
HTTPS → port 443 (optional)

👉 If you plan FastAPI:

Add custom port:
8000

Connect to your server

























ssh -i my-key.pem ubuntu@13.60.83.241

sudo apt update && sudo apt upgrade -y
sudo apt install docker.io -y

sudo systemctl start docker
sudo systemctl enable docker

sudo usermod -aG docker $USER

newgrp docker
docker --version

......................................................................
sudo apt install docker-compose -y
docker-compose --version
.....................................................................
.....................................................................
ssh-keygen -t ed25519 -C "aws-server"
cat ~/.ssh/id_ed25519.pub
ssh -T git@github.com
git clone ----
....................................................................

docker-compose up -d --build

=====================================================================================

docker system prune -a --volumes
docker system prune -a --volumes -f

This is the all-in-one version.

It deletes containers, images, volumes, and networks that are not in use.

=====================================================================================
3️⃣ CPU information   -----------   lscpu
4️⃣ Memory (RAM) usage   ----- free -h
5️⃣ Disk usage    ----------  df -h


.............................
Once inside: =======   mysql -u root -p
............................



fastapi-mysql-app/
├─ backend/
│  ├─ main.py
│  ├─ requirements.txt
│  └─ Dockerfile
├─ frontend/
│  ├─ index.html
│  └─ script.js
├─ docker-compose.yml
└─ Caddyfile


...........................
...........................
credentials.py
================================
import mysql
import boto3
def mySqlConnection():
    connection = mysql.connector.connect(
        # host="",
        # user="",
        # password="",
        # database=""
    )
    return connection

def awsS3Connection():
    s3 = boto3.client(
        "s3",
        aws_access_key_id="",
        aws_secret_access_key="",
        region_name=""
    )
    return s3

def awsBucketName():
    return ""
..................................................


Open EC2 Dashboard
Click Launch Instance --> (without wolkthrough)
Configure:
Name: my-project-server
AMI: Ubuntu Server (latest LTS)
Instance type: t2.micro (free tier) or t3.micro
Key pair: create/download .pem
Firewall (Security Group):
✅ SSH (22)
✅ HTTP (80)
✅ HTTPS (443)
Click Launch

.....................................................

Steps:
Click Create bucket
Configure:
Bucket name: must be unique globally
👉 e.g. nicolai-project-assets-123
Region: SAME as EC2 (important ⚠️)
Keep default settings (for now)
Create bucket


Steps:
Go to IAM → Roles
Click Create Role
Choose:
Trusted entity: AWS service
Use case: EC2
Attach policy:
AmazonS3FullAccess (easy start)
later you can restrict it
Name it:
EC2-S3-Access-Role


Attach role to your EC2:
EC2 → Instances
Select instance
Actions → Security → Modify IAM Role
Attach your role

🧪 4. Test from your VM

SSH into EC2 and run:

aws s3 ls
................................................

⚙️ Step 1: Allocate Elastic IP
Go to EC2 Dashboard
Left menu → Elastic IPs
Click Allocate Elastic IP
Leave defaults
Click Allocate
🔗 Step 2: Attach to your instance
Select the new Elastic IP
Click Actions → Associate Elastic IP
Choose:
Resource type: Instance
Select your EC2 instance (ip-172-31-15-11)
Click Associate

......................................................

✅ Launch flow summary

When you launch an EC2 instance, the order doesn’t really matter in AWS console, but logically:

Decide the IAM Role → what AWS services your EC2 can access (e.g., S3)
Create / attach Security Group → control who can reach your instance
Assign Elastic IP → give it a static public address if needed
