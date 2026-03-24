# fastapi-mysql-app
rootCloud-1
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

