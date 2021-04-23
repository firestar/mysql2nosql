# MySQL 2 NoSQL

This project lets you convert relational data stored in MySQL to JSON documents. You can specify table relations and one to one or one to many relations between tables. This 

# Configuration

Open `./docker-compose.yml` and specify the MySQL server connection details and database.

## Running
This project requires docker/docker-compose installed.

To start up the process and start converting run the following command. `docker-compose up`
When it finishes building and starting up you can access it in the browser at `http://localhost:8080/`

## Previews

![alt text](https://github.com/firestar/mysql2nosql/blob/main/examples/overall.png?raw=true)

![alt text](https://github.com/firestar/mysql2nosql/blob/main/examples/sql.png?raw=true)
