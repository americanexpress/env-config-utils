<h1>
  <center>
    <br />
    <img src="./env-config-utils.png" alt="env-config-utils - One App" width="50%" />
    <br /><br />
  </center>
</h1>

> This contains utilities for configuring environment variables including functions for preprocessing.

## 👩‍💻 Hiring 👨‍💻

Want to get paid for your contributions to `env-config-utils`?
> Send your resume to oneamex.careers@aexp.com


## 📖 Table of Contents

* [Features](#-features)
* [Usage](#-usage)
* [API](#-api)
* [Available Scripts](#-available-scripts)
* [contributing](#-contributing)

## ✨ Features

* Validate environment variables.
* Normalize any environment variables.
* Set default value for the environment variables.
* Provide valid environment variables options.

## 🤹‍ Usage

### Installation

```bash
npm i @americanexpress/env-config-utils
```

Checkout the different parameters you can use under the [API](#api) section.

```js
const { preprocessEnvVar } = require('@americanexpress/env-config-utils');
  const config = {
      name: 'HTTP_PORT',
      normalize: (input) => {
        const parsed = parseInt(input, 10);
        if (Number.isNaN(parsed) || parsed != input) {
          throw new Error(`env var HTTP_PORT needs to be a valid integer, given "${input}"`);
        } else {
          return parsed;
        }
      },
      defaultValue: () => 3000,
  }

  preprocessEnvVar(config);

const isFetchableUrlInNode = require('@americanexpress/env-config-utils/isFetchableUrlInNode');
// throws if not a valid url
isFetchableUrlInNode('https://example.aexp.com/path');

```

## 🎛️ API

## preprocessEnvVar( [config] )

Loads the local module map and remote module map for local development.

### config( you can give this any name)

Type: `object`

provide an object that can be given any name with the below parameters.

#### name

Type: `string`

This is the name of the environment variable and refers to process.env[name] **REQUIRED**

#### normalize

Type: `function`

This is a function that takes a value an performs preprocessing on it before the value is set on the environment variable.

#### valid

Type: `array`

An optional array of valid values.

#### defaultValue

Type: `string/function`

An optional value to use if none is defined

#### validate

Type: `function`

An optional function to validate if the provided value is acceptable. Throws an error.

## isFetchableUrlInBrowser()

Validates that a given URL is valid when called from the browser. Useful for usage as a validate function for `preprocessEnvVar()`

### url

Type: `string`

Url to validate.

#### Usage with [`preprocessEnvVar()`](#preprocessEnvVar)

``` js
const {
    name: 'MY_V_COOL_API_URL',
    validate: isFetchableUrlInBrowser,
} = config;

```
preprocessEnvVar(config);

## isFetchableUrlInNode()

Validates that a given URL is valid when called from the server. Useful for usage as a validate function for `preprocessEnvVar()`

### url

Type: `string`

Url to validate.

#### Usage with [`preprocessEnvVar()`](#preprocessEnvVar)

``` js
const {
    name: 'MY_V_COOL_API_URL',
    validate: isFetchableUrlInNode,
} = config;

preprocessEnvVar(config);

```

## 📜 Available Scripts

**`npm run build`**

Builds the module into the `build` folder.

**`npm test`**

Runs `eslint` **and** unit tests on the current branch.

## 🏆 Contributing

We welcome Your interest in the American Express Open Source Community on Github.
Any Contributor to any Open Source Project managed by the American Express Open
Source Community must accept and sign an Agreement indicating agreement to the
terms below. Except for the rights granted in this Agreement to American Express
and to recipients of software distributed by American Express, You reserve all
right, title, and interest, if any, in and to Your Contributions. Please [fill
out the Agreement](https://cla-assistant.io/americanexpress/env-config-utils).

Please feel free to open pull requests and see [CONTRIBUTING.md](./CONTRIBUTING.md) for commit formatting details.

## 🗝️ License

Any contributions made under this project will be governed by the [Apache License
2.0](https://github.com/americanexpress/env-config-utils/blob/master/LICENSE.txt).

## 🗣️ Code of Conduct

This project adheres to the [American Express Community Guidelines](https://github.com/americanexpress/env-config-utils/wiki/Code-of-Conduct).
By participating, you are expected to honor these guidelines.
