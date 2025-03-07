# Instruções

1.  Define password in each /secrets file

2.  to build and run the containers use: `make`

3.  Browser: https://ft-transcendence.com

# Endpoints

## Users

### Listing and updating

https://192.168.20.111/api/users (list users except current user)

https://192.168.20.111/api/users/<uuid> (retrieve user <uuid>, if it exists)

https://192.168.20.111/api/users/whoami (retrieves current user)

https://192.168.20.111/api/users/1/edit (update/destroy user1, if user 1 is current user, else show 404) - 'username', 'email', 'old_password', 'password', 'confirm_password', 'first_name', 'last_name'

https://192.168.20.111/api/users/1/add_avatar (add or update avatar) - 'avatar'

### Friends

https://192.168.20.111/api/users/1/invite_friend (send friend request from user 1)

https://192.168.20.111/api/users/1/accept_friend (accept friend requests)

https://192.168.20.111/api/users/1/remove_friend (remove friend)

https://192.168.20.111/api/users/1/remove_friend_request (remove friend request)

https://192.168.20.111/api/users/1/block (block user)

https://192.168.20.111/api/users/1/unblock (unblock user)

## Images

https://192.168.20.111/api/users/<uuid:pk>/add_avatar/ (add user avatar)

https://192.168.20.111/api/users/<uuid:pk>/get_avatar/ (get user avatar)

## Auth

https://192.168.20.111/api/auth/login/ (login)

https://192.168.20.111/api/auth/logout/ (logout)

https://192.168.20.111/api/auth/signup/ (signup)

https://ft-transcende.com/api/auth/check_otp/ (confirm user's one-time password)

### Signup instructions

On signup, a 6-digit one time password is sent to the user email. That password must be then sent to https://192.168.20.111/api/auth/check_otp/ as 'otp'. If the OTP is valid, the page will return 200: OTP OK and the user is created.

### TFA instructions

If the user's tfa option is active, when the user logs in, a 6-digit one time password is sent to the user email. That password must be then sent to https://192.168.20.111/api/auth/check_otp/ as 'otp'. If the OTP is valid, the page will return the JWT tokens.


# ELK

## Import dashboard to Kibana:

`curl -X POST kibana:5601/api/saved_objects/_import?createNewCopies=true -H "kbn-xsrf: true" -u "${ELASTIC_USER}:$(cat $ELASTIC_PASSWORD_FILE)" --form file=@dashboard.ndjson`

## Export dashboard from Kibana:

`curl --request POST "http://kibana:5601/api/saved_objects/_export" --header "Content-Type: application/json; Elastic-Api-Version=2023-10-31" --header "kbn-xsrf: string" -u "${ELASTIC_USER}:$(cat $ELASTIC_PASSWORD_FILE)" -d '{ "objects": [ { "type": "dashboard", "id": "c9c34bef-c32f-4870-95d3-288c00170cea" } ] }' -o /usr/share/kibana/config/dashboards/dashboard.ndjson`

## Secrets

-   django_secret_key.txt
-   elasticsearch_password.txt
-   kibana_password.txt
-   kibana_security_key.txt
-   django_superuser_password.txt
-   email_host_password.txt
-   kibana_encryption_key.txt
-   kibana_reporting_key.txt
-   postgres_password.txt