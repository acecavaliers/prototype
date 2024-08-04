# prototype
 
navigate to my_rest_api directory
cd my_rest_api

Install 

Steps to install project
User can buy and sell their project online

Environment Variables
To run this project, you will need to add the following environment variables to your .env file

Step 1 create .env file in my_rest_api root directory.

Step 2 Paste the codes below:

        NODE_ENV=development
        APP_PORT=5000

        DB_USERNAME=root
        DB_PASSWORD=''
        DB_NAME=my_rest_api
        DB_HOST=localhost
        DB_PORT=3306

        JWT_SECRET_KEY=random-key
        JWT_EXPIRES_IN=5d

Step 3 Install my_rest_api with npm

        npm run install
        npm run migrate

Step 4 Open New terminal and navigate to my_front_end_app directory

        cd my_front_end_app

        npm run install