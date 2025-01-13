# Instruções

1.  Define password in each /secrets file

2.  make

3.  Browser: https://192.168.20.111

# Endpoints

## Users

### Listing and updating

http://192.168.20.111/api/users (list users except current user)

http://192.168.20.111/api/users/<uuid> (retrieve user <uuid>, if it exists)

http://192.168.20.111/api/users/whoami (retrieves current user)

http://192.168.20.111/api/users/1/edit (update/destroy user1, if user 1 is current user, else show 404) - 'username', 'email', 'old_password', 'password', 'confirm_password', 'first_name', 'last_name'

### Friends

http://192.168.20.111/api/users/1/invite_friend (send friend request from user 1)

http://192.168.20.111/api/users/1/accept_friend (accept friend requests)

http://192.168.20.111/api/users/1/remove_friend (remove friend)

http://192.168.20.111/api/users/1/remove_friend_request (remove friend request)

http://192.168.20.111/api/users/1/block (block user)

http://192.168.20.111/api/users/1/unblock (unblock user)

## Images

http://192.168.20.111/api/users/<uuid:pk>/add_avatar/ (add user avatar)

http://192.168.20.111/api/users/<uuid:pk>/get_avatar/ (get user avatar)

## Auth

http://192.168.20.111/api/auth/login/ (login)

http://192.168.20.111/api/auth/logout/ (logout)

http://192.168.20.111/api/auth/signup/ (signup)

http://192.168.20.111/api/auth/get_otp/ (send one-time password to user's email)

https://ft-transcende.com/api/auth/check_otp/ (confirm user's one-time password)