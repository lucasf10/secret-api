# Secret

An app inspired on the legacy Secret application, where you can share your secrets within your region.

This repo is the implementation of the backend and API of the application.

For the React Native application that consumes this API, you should check the [secret_app repo](https://github.com/lucasf10/secret_app). 

## How to run this API

1. Create your own **.env** file based on **.env.example**

2. Configure a firebase account and place the firebase.json file in:
```bash
src/config
```

3. Install all dependencies with yarn:

```bash
yarn
```

4. Start docker:

```bash
make up
```

To stop docker:

```bash
make down
```

To see logs on docker:

```bash
make logs
```

## Technologies used

- Node
- Yarn
- Docker
- Typescript
- Express
- JWT Authentication
- MongoDB
- Firebase (FCM)
- Jest

## Features included

- Authentication (create account/login)
- Register firebase token (to send out push notifications)
- Posts (list, get specific, create, delete, like and dislike)
- Comments (list, like and delete)
- Unit tests to ensure code quality and stability.
