# Node Authentication

## Requirements

 * node js: v15.3.0+
 * mongodb: either on your local machine or on mongo atlas

## Installation
 * clone this repo to your local machine and navigate to the folder
 * add the following with the required values to your path or to a .env file in the root folder of the project
 ```
    DB_URL = "<mongo_db_url>"
    DB_USER = '<mongo_db_username>'
    DB_PASS = '<mongo_db_password>'

    TOKEN_SECRET = '<jwt_token_secret>'
    TOKEN_EXPIRY = '<jwt_token_expiry eg: 1h / 1d>'
    PORT = '<server_port>'
```
 * then on command prompt navigate to the project directory
 ```
    npm install
    npm start
 ```