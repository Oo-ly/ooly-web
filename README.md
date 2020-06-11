# Ooly Web

## Requirements
- Node.js v12.0 or above - [https://nodejs.org/](https://nodejs.org/)

## Setup

The project is using node and some npm packages, to install some packages like Webpack.

## Workflow

![Schema](./schema.jpg)

## Commands

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Start the development environment              |
| `npm run build`         | Build the projects and compile source files    |

## URLs

Once you run Webpack development server is running, this URLs become available:
|URL|
|--|
|http://localhost:9001

## Coding guidelines

### Git

We use **Gitflow** as our Git workflow. [More explanation here.](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

### Code style & format

#### Styles

- We use **Prettier** ([https://prettier.io/](https://prettier.io/)) as code formatting tool. The configuration is written in `.prettierrc` at the root of the project. **You must NOT edit this file.**
- We use **2 _(two)_ spaces** for indentation.

#### Naming

- We use **camelCase** for `variables`, `properties`, `functions` and `methods`.
- We use **PascalCase** for `classes`.

#### Comments

- We use **apiDoc** ([https://apidocjs.com/](https://apidocjs.com/)) for functions documentation.

### Rules

Before pushing code, please make sure to :

- Include **unit tests** to test every function you've added.
- Add comments, and regenerate the documentation : `npm run api`.
- **Clean and refactor** code.
