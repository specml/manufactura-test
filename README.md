# manufactura-test
This project is the fulfillment of the task (https://github.com/vanuwa/test-database/blob/master/TEST_TASK_DATABASE.md)
---
## Used technologies:
* NodeJS
* DB - PostgreSQL
* ORM - Sequelize
* HTTP Api - Express.js
---
## Using
### Before starting
The startup requires the following dependencies
* node.js 6.3.1 or above
* PostgreSQL

Before starting, you need to create a database and a user in postgres.
* createdb (databaseName)
* createuser (userName) -W

And fill in the required data in the ***./config/db.json***. Structure of the config file is as follows:

    {
        "development": {
            "username": "user",
            "password": "pass",
            "database": "DBname",
            "host": "127.0.0.1",
            "dialect": "postgres"
        },
        "test": {
            "username": "name",
            "password": "pass",
            "database": "DBname",
            "host": "127.0.0.1",
            "dialect": "postgres"
        }
    }

Next, set **npm** dependencies
    npm install

Then run the command
    npm run server
---
Logs are written to a file ***logs.log***. You can change the settings of the logger(level) in the file ***./config/log.json***.
### API
In this project is implemented HTTP Api. Application is listening 8000 port. You can use API as follows:
* initializing DB
        send GET request on **/initDB**
* create records
        send POST request on **/(table name)**, write data in body, ex.:

        code    : "VS"
        name    : "Vitalii Spivak"
        phone   : "+380638708296"
        address : "Bucha, Vokzalna st."

* read record
        send GET request on **/(table name)/(record ID)** or **/(table name)/(field)/(value)** to read record by ID or by query
* update record
        send PUT request on **/(table name)/(record ID)** or **/(table name)/(field)/(value)** to update record by ID or by query, write data to update in body
* delete record
        send DELETE request on **/(table name)/(record ID)** or **/(table name)/(field)/(value)** to delete record by ID or by query
* show all records of table
        send GET request on **/(table name)** to get list of records
### Backup storage
If there are no connection to DB app save incoming request (create, update, delete) in dump file ***tmp/dump.json*** and after restoring connection this info will be saved to DB.
