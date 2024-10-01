# online market app.


this app is meant to be a market app for a freelance job


## Frontend Folder
it contains the react code for the front end and the pages.


## Backend folder
it contains the Laravel code for the backend


## Admin dashboard folder
contains the front end code for the admin pages.

## instructions
first run 'PHP artisan migrate' to create the local database for the application, don't forget to configure your '.env' folder.\
run php artisan user:set-admin {username} to set a user as admin.\
### frontend:
in /frontend/constants/URL.ts:\
update BASE_URL to your backend server path(hosting).\
in /frontend/constants/Constants.ts:\
update APP_name to your chosen name.\
