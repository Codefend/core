<p align="center">
 <img src="./public/img/logo.png">
</p>

# Codefend

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Codefend/core/code-defender-core.yml?branch=main)
![NPM](https://img.shields.io/node/v/codefend)
![NPM](https://img.shields.io/npm/dt/codefend)
![NPM](https://img.shields.io/npm/l/codefend)

Codefend short for "Code Defender" is a Code obfuscator CLI that protects your code regardless of the programming language or framework.\
The complete list of examples for different programming languages/frameworks can be viewed [here](#examples)\
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

For Advanced usage, please check the [Configuration](#configuration) section

### `Step 2`: Run the CLI

`navigate to the root of your project and run the following commands:`

```bash
codefend -i  //required only the first time, generates .codefendrc.json

```

```bash
codefend -o  //obfuscates your whole project inside a new directory: 'codefend-output'
```

<p align="center">
 <img src="./public/img/main-example.PNG">
</p>

### `Step 3`: install dependencies, build and deploy the obfuscated project

```bash

      /* navigate to the output folder*/
      cd codefend-output

      /* install the dependencies of the new obfuscated project */
      npm install

      /* run the obfuscated project */
      ...

      /* build the obfuscated project */
      ...

      /* deploy the obfuscated project */
      ...
```

## Examples

1. ### [`Node js`](./examples/nodejs)

2. ### [`Angular`](./examples/angular)

3. ### [`React`](./examples/react)

4. ### [`Vue`](./examples/vue)

5. ### [`Svelte`](./examples/svelte)

6. ### [`Python`](./examples/python)

7. ### [`C#`](./examples/C%23)

8. ### [`C++`](./examples/C%2B%2B)

## Configuration

```js
//default configuration generated inside .codefendrc.json
{
  /** debug: boolean
  * Display additional logs
  */
  debug: true,


  generationOptions: {
    inputDir: ".", // the folder that should be copied and obfuscated ( keep it . if you're running in the same directory)
    outputDir: "codefend-output", // the output folder that will be an obfuscated clone of your code
    ignoredFilesInGeneration: [ // the files that should not be copied to the output folder
      "codefend-output",
      ".codefendrc.json",
      "node_modules",
      ".git",
      ".github",
      ".gitignore",
      ".vscode",
      "build",
      "dist",
      "README.md"
    ],
  },

  obfuscationOptions: {


    /** prefix: string
    * the prefix of each variable generated.
    * note: make sure its a valid character to start with a variable
    * ( e.g do not start with "-"" or a number)
    */
    prefix: "Ox",


    /** predefinedWords: Array<{originalWord:string, targetWord:string}>
    * words that you want to obfuscate them in a static way (determined output)
    * {"originalWord":"l_secretVar" , "targetWord": "123456"}
    * note: the original word must have a prefix 'l_' to be detected in the first place so that it gets replaced.
    */
    predefinedWords: [],


    /** ignoredWords: Array<string>
    * Words that matches the pattern to be obfuscated but should be kept as is without being obfuscated.
    * useful for words that are being obfuscated and causing errors when running or building the code
    */
    ignoredWords: ["node_modules"],


    /** regexList: Array<{name:string,value:string,flag:string}>
    * Regex for detecting the words to be obfuscated
    */
    regexList: [
      {
        name: "main",
        value: "([a-zA-Z]+(_[a-zA-Z0-9]+)+)",
        flag: "g",
      }
    ],
  },
}

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](./LICENSE.md)
