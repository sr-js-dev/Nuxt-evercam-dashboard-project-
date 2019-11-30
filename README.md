# Static dashboard

> Evercam User dashboard (Nuxt.js)

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## AWS Amplify deploy Setup

1. Create GitHub repository and push your nuxt.js app.
2. Connect your repository to [AWS Amplify](https://aws.amazon.com/amplify/) and specifies the branch to use in production (master).
3. Configure build settings. Your static site will be configured by AWS Amplify through `amplify.yml` file:

```
version: 0.1
frontend:
  phases:
    preBuild:
      commands:
        - yarn install
    build:
      commands:
        - yarn generate
  artifacts:
    baseDirectory: /dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*

```

First, we should install all dependencies with the command `yarn install` in the `preBuild` phase. Next, we will build our app with the command `yarn generate` and finally we will tell to Amplify where are the generated files with `baseDirectory: /dist`.

5. Set environment variables. We should establish the `API_URL` and the `SOCKET_URL`. To manage them with Amplify, we will go to `App settings` > `Environment variables`.

6. Configure redirects for static generated application. Go to `App settings` > `Rewrites and redirects`, remove all existing redirects and create a new one with the following configuration:

| Source address | Target address | Type | Country code |
| ---------------| -------------- | ---- | ------------ |
| `</^[^.]+$\|\.(?!(css\|gif\|ico\|jpg\|js\|png\|txt\|svg\|woff\|ttf\|map\|json)$)([^.]+$)/>` | `/index.html` | 200 (Rewrite) | - |

7. When Amplify detect changes on branch master of your repository, it will automatically deploy your app.
