# Registration

#Run project with below commands
npm install
npm start

Add below details in application.properties file under AUTH API in order to connect to login page
#okta issuer and client id details also USER API details
OKTA_CLIENT_ORGURL
OKTA_CLIENT_TOKEN
USER_API=http://localhost:8088/ppms

Update AUTH_URL in api-config.json file
