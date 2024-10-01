# online market app.


this app is meant to be a market app for a freelance job


## Frontend Folder
it contains the react code for the front end and the pages.


## Backend folder
it contains the Laravel code for the backend


## Admin dashboard folder
contains the front end code for the admin pages.

## Prerequisites 

PHP 7.4 or higher.\
Composer.\
Node.js.\
npm.\
MySQL or compatible database.\

## Installation instructions

### Backend Setup

first run 'PHP artisan migrate' to create the local database for the application, don't forget to configure your '.env' folder.\
run php artisan user:set-admin {username} to set a user as admin.\

### frontend Setup:
in /frontend/constants/URL.ts:\
update BASE_URL to your backend server path(hosting).\
run npm install to install nodejs dependencies.\
start the frontend development server by running npm run dev.\

in /frontend/constants/Constants.ts:\
update APP_name to your chosen name.\


### Usage

Frontend: users can buy and sell at the same time.\

### Contribution 

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or features.



