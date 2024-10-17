# Installation

Install all necessary dependencies by running:

```sh
  npm install
```

# Development mode

## Prerequisites

In order to make the code more consistent we use Prettier code formatter with configuration provided in the `.prettierrc` file.

Moreover, we integrated ESLint to help with the development process, clean code and to follow the good React and Typescript practices.

## Formatting process

In VSCode set:

- Default Formatter: Prettier _(firstly install necessary VSCode extension)_
- Format On Save: on
- Format On Save Mode: modifications _(we don't want to format code of other collaborators)_

## Linting process

Install VSCode extension: __ESLint__. It should work out of the box with the ESLint configuration in `.eslintrc.json`.

## Running app in development mode

To run app in the development mode you just have to use:

```sh
  npm run serve
```

It will run `webpack` in the server mode with watching changes and then open electron app on each file save.

# Production mode

To run app in the production mode you have to firstly build it:

```sh
  npm run build
```

and then start electron app:

```sh
  npm run electron-start
```

# Example forest configurations

There are example forest configurations located in the `assets` directory. To easily insert them into the `fire-configurations` database, you have to replace every `"` with `\"` and then surround the text with `"`. Next, you have to run the project, create forest configuration in the application, go to `http://localhost:31415/docs#/default/get_nodes_api_v1_nodes__get`, find node IDs associated with those configuraitons and go to `http://localhost:31415/docs#/default/update_node_api_v1_nodes__node_id__put` and update the __data__ property for each node ID with the data from the example files.