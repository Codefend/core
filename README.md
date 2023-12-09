<p align="center">
 <img src="./public/img/logo.png">
</p>

# Codefend

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Codefend/core/code-defender-core.yml?branch=main)
![NPM](https://img.shields.io/node/v/codefend)
![NPM](https://img.shields.io/npm/dt/codefend)
![NPM](https://img.shields.io/npm/l/codefend)

Codefend short for "Code Defender" is a Code obfuscator CLI that protects your code regardless of the programming language or framework.\

Visit the [official documentation](https://codefend.github.io/docs/) for simple instructions, examples, and advanced settings.

The complete list of examples for different programming languages/frameworks can be viewed [here](https://codefend.github.io/docs/examples/list)\
`Please make sure to read the `[`Philosophy`](#philosophy)` behind the obfuscation First to understand why Codefend can work with any code written in any language.`

## Installation

#### `Globally`

```bash
npm install -g codefend
```

#### `Dev dependency`

```bash
npm install -D codefend
```

#### `npx`

In case you want to execute it directly without installing it on your machine:

```bash
npx codefend -i  //required only the first time, generates .codefendrc.json
npx codefend -o  //obfuscates your whole project inside a new directory: 'codefend-output'
```

#### `Webpack` (not recommended)

If you're using Webpack, you can use
[webpack-plugin-codefend](https://www.npmjs.com/package/webpack-plugin-codefend) instead of directly using the CLI, you can skip the installation in this case and jump directly to the [plugin documentation](https://github.com/Codefend/webpack-plugin-codefend#readme)
(not recommended because the webpack plugin is not compatible with Codefend v3)

#### `Rollup/Vite` (not recommended)

If you're using Rollup or Vite, you can use
[rollup-plugin-codefend](https://www.npmjs.com/package/rollup-plugin-codefend)
instead of directly using the CLI, you can skip the installation in this case and jump directly to the [plugin documentation](https://github.com/Codefend/rollup-plugin-codefend#readme)
(not recommended because the webpack plugin is not compatible with Codefend v3)

## Commands

```shell
Usage: codefend [options]

Defend Your Code By All Means Necessary. 💪 😎

Options:
  -i, --init       Create the config file (.codefendrc.json)
  -o, --obfuscate  Obfuscate the project
  -c, --check      Check the config file for potential warnings/errors
  -v, --version    Output the version number
  -h, --help       Display help for command
```

## Philosophy

1. Codefend first copy all the files of your project to another directory ` by default: /codefend-output`.
2. Parse every word of every file of your project, searching for patterns in your code.
3. Encrypts the detected words (Classes,Functions,Variables...) that matches the pattern.

**The only thing Codefend needs from you as a programmer** is to `follow a specific naming convention for the words that you want to obfuscate` (Classes,Functions,Variables...) `and Codefend will do the rest ✨`\
This basic rule applies to all the languages and the frameworks that you will be programming with while using Codefend to defend your source.

Once your source code is obfuscated you can build the obfuscated version of your code and deploy it

## Basic Usage

### `Step 1`: Naming convention

`Add prefixes to the words that you want to encrypt.`

```js
//as a starting point:  prefix the words that should be encrypted with l_
class l_Calculator {
    l_sum(l_a, l_b) {
        const l_results = l_a + l_b;
        return l_results;
    }
}

//>>>>>>==== Will Become ======<<<<<<

class Ox0 {
    Ox1(Ox2, Ox3) {
        const Ox4 = Ox2 + Ox3;
        return Ox4;
    }
}

// Or for a better organized naming convention:
/** 
 * 
1- class -> starts with c_
2- function -> starts with f_
3- parameter -> starts with p_
4- local variable -> starts with l_
*/
class c_Calculator {
    f_sum(p_a, p_b) {
        const l_results = p_a + p_b;
        return l_results;
    }
}

//>>>>>>==== Same results ======<<<<<<
class Ox0 {
    Ox1(Ox2, Ox3) {
        const Ox4 = Ox2 + Ox3;
        return Ox4;
    }
}
```

```html
<!-- Html example, can work also with Angular,React,Vue,Svelte... in the same way -->

<html>
    <head>
        <style>
            .l_red {
                color: red;
            }
        </style>
    </head>
    <body>
        <div class="l_red">l_secret</div>
        <div class="l_red">Hello World</div>
    </body>
</html>

<!-- Will Become -->

<html>
    <head>
        <style>
            .Ox1 {
                color: red;
            }
        </style>
    </head>
    <body>
        <div class="Ox1">Ox0</div>
        <div class="Ox1">Hello World</div>
    </body>
</html>
```

### `Step 2`: Run the CLI

`navigate to the root of your project and run the following commands:`

```bash
codefend -i  //required only the first time, generates .codefendrc.json

```

```bash
codefend -o  //obfuscates your whole project inside a new directory: 'codefend-output'
```

### `Step 3`: install dependencies, build and deploy the obfuscated project

```bash

      /* 1. Navigate to the output folder*/
      cd codefend-output

      /* 2. Install the dependencies of the new obfuscated project */
      npm install

      /* 3. Run the obfuscated project */
      ...

      /* 4. Build the obfuscated project */
      ...

      /*⚠️ In case the run or the build fails, most likely its because some reserved words related to your dependencies have been obfuscated.

      Solution:

      a. Set stats=true in .codefendrc.json (to display a list of the words that are being obfuscated)
      b. Detect what are the words that should not be obfuscated from the list displayed
      c. Add the words to the ignoredWords array inside .codefendrc.json
      d. Repeat 3 and 4 until no Run/Build errors
      */


      /* 5.deploy the obfuscated project */
      ...
```

## Configuration

Please refer to the [configuration](https://codefend.github.io/docs/references/configuration) section of the docs.

```

## Migration guide

Please refer to the [migration guide](https://codefend.github.io/docs/migrations/codefend-v3) section of the docs.

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](./LICENSE.md)

```

```
