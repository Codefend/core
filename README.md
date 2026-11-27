<p align="center">
 <img src="./public/img/logo.png">
</p>

# Codefend

[![Latest CI workflow status](https://img.shields.io/github/actions/workflow/status/Codefend/core/ci.yml)](https://github.com/Codefend/core/actions/workflows/ci.yml)
![NPM](https://img.shields.io/npm/dt/codefend)
[![npm unpacked size](https://img.shields.io/npm/unpacked-size/codefend)](https://www.npmjs.com/package/codefend)
![NPM](https://img.shields.io/node/v/codefend)
![NPM](https://img.shields.io/npm/l/codefend)

`Codefend` is a dynamic 🪩 CLI tool that obfuscates your source code, folders, and file names, compatible with any programming language or framework.
It delivers powerful obfuscation while ensuring performance maintained ⚡, so you benefit from enhanced security without compromising your application's speed or efficiency.
Additionally, Codefend offers plugins for [Webpack](https://www.npmjs.com/package/webpack-plugin-codefend), [Rollup](https://www.npmjs.com/package/rollup-plugin-codefend), [Vite](https://www.npmjs.com/package/vite-plugin-codefend), and [esbuild](https://www.npmjs.com/package/esbuild-plugin-codefend).

Beyond simple obfuscation, Codefend delivers advanced features, integrating smoothly with current uglifiers or minifiers. It employs a two-layer obfuscation 🪞 process, embedding hidden code within hidden code for irreversible source code protection.

## Naming conventions

Codefend uses naming conventions to select names in source code and file paths. The guides below explain how to adopt them in your project.

- [Code naming convention](https://codefend.github.io/docs/basic-usage/naming-conventions/code-naming-convention)
- [Folder and files naming convention](https://codefend.github.io/docs/basic-usage/naming-conventions/folders-files-naming-convention)

### Migrate an existing project with AI

The [AI migration guide](https://codefend.github.io/docs/basic-usage/naming-conventions/ai-assisted-migration) includes a **copyable prompt** to help your coding assistant adopt Codefend's naming conventions. It covers renaming internal variables, functions, and classes, updating references, preserving external interfaces, and testing the generated output.

Visit the [docs](https://codefend.github.io/docs/) for instructions, examples, and advanced settings.

## Installation

#### `Globally`

```bash
npm install -g codefend
codefend -i  //required only the first time, generates .codefendrc.json
codefend -o  //obfuscates your whole project inside a new directory: 'codefend-output'
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

#### `Webpack`

If you're using Webpack, you can use [webpack-plugin-codefend](https://www.npmjs.com/package/webpack-plugin-codefend) instead of directly using the CLI, keeping in mind that not all features are propagated to the plugin and may take time to become available.

#### `Rollup`

If you're using Rollup, you can use [rollup-plugin-codefend](https://www.npmjs.com/package/rollup-plugin-codefend) instead of directly using the CLI, keeping in mind that not all features are propagated to the plugin and may take time to become available.

#### `Vite`

If you're using Vite, use [vite-plugin-codefend](https://www.npmjs.com/package/vite-plugin-codefend) to obfuscate production builds while keeping the development server and HMR unchanged. See the [Vite build guide](https://codefend.github.io/docs/examples/vite) for setup. The plugin exposes transformation and debug options; not all CLI features are available.

#### `esbuild`

For esbuild projects, [esbuild-plugin-codefend](https://www.npmjs.com/package/esbuild-plugin-codefend) transforms source files through esbuild's JavaScript build API. See the [esbuild build guide](https://codefend.github.io/docs/examples/esbuild) for installation, configuration, and an executable example.

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

For a more detailed explanation, please refer to the [obfuscation](https://codefend.github.io/docs/basic-usage/obfuscation) section of the docs.

### `Step 3`: install dependencies, build and deploy the obfuscated project

Please refer to the [build and deployment](https://codefend.github.io/docs/distribution/build-and-deployment) and [ troubleshooting](https://codefend.github.io/docs/distribution/troubleshooting) sections of the docs.

## Examples

See the [documentation examples](https://codefend.github.io/docs/examples/list) for language guides, source code, configuration, and expected output. For bundler integrations, follow the [Vite](https://codefend.github.io/docs/examples/vite), [esbuild](https://codefend.github.io/docs/examples/esbuild), [Rollup](https://codefend.github.io/docs/examples/rollup), or [Webpack](https://codefend.github.io/docs/examples/webpack) guide.

## Configuration

### Parser presets

Use `parser.name` to select a naming convention. The opt-in `prefixed` preset selects `l_` followed by an ASCII letter and then letters or digits, such as `l_total` or `l_value2`:

```json
{
  "parser": {
    "name": "prefixed"
  }
}
```

This preset uses the same discovery rule as the documentation's custom `applicationNames` example. It does not discover unrelated names such as `LED_BUILTIN`, `external_value`, or names with additional underscores such as `l_total_amount`. Rules still operate on text in source files and paths, including strings and comments. Selection does not change the replacement engine's existing case and substring limitations; test the generated program and preserve external interfaces.

The existing `default`, `codeOnly`, `fileOnly`, deprecated `Parser_A` alias, and `custom` parser remain available. Omitting the parser still selects `default`. Bundler plugins continue to select `codeOnly`; the new preset is available through the core CLI and JavaScript API.

Please refer to the [configuration](https://codefend.github.io/docs/references/configuration) section of the docs.

## Migration guide

Please refer to the [migration guide](https://codefend.github.io/docs/migrations/codefend-v3) section of the docs.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](./LICENSE.md)
