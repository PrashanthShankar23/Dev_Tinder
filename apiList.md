# Dev-Tinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

## requestsRouter

- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /connections
- GET /requests/received
- GET /feed
