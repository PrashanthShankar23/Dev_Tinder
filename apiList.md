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

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter

- GET /connections
- GET /requests/received
- GET /feed
