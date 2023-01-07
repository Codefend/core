<p align="center">
 <img src="./public/img/logo.png">
</p>

# Codefend

Codefend short for "Code Defender" is a Code obfuscator CLI that protects your code regardless of the programming language or framework.\
The complete list of the examples for different programming languages/frameworks can be viewed [here](#examples)

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
npx codefend -i  //generates .codefendrc.json
npx codefend -o  //obfuscates your whole project inside a new directory: 'codefend-output'
```

## Commands

```shell
Usage: codefend [options]

Defend Your Code By All Means Necessary. 💪 😎

Options:
  -v, --version    output the version number
  -i, --init       Create .codefendrc.json (configuration file)
  -c, --check      Check .codefendrc.json for potential warnings/errors
  -o, --obfuscate  Obfuscate your project (based on .codefendrc.json)
  -h, --help       display help for command
```

## Philosophy

The only thing Codefend needs from you as a programmer is to `follow a specific naming convention for the words that you want to obfuscate` (variable/functions/classes...) `and Codefend will do the rest ✨`\
This basic rule applies to all the languages and the frameworks that you will be programming with while using Codefend to defend your source.

## Basic Usage

### `Step 1`: Naming convention

`Add prefixes to the words that you want to encrypt.`

```js
/** 
1- local variable -> starts with l_
2- parameter -> starts with p_
3- function -> starts with f_
4- class -> starts with c_
*/
class c_Calculator {
  f_sum(p_a, p_b) {
    const l_results = p_a + p_b;
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
```

### `Step 2`: Run the CLI

`navigate to the root of your project and run the following commands:`

```bash
codefend -i  //generates .codefendrc.json

```

```bash
codefend -o  //obfuscates your whole project inside a new directory: 'codefend-output'
```

<p align="center">
 <img src="./public/img/main-example.PNG">
</p>

### `Step 3`: install dependencies, build and deploy the obfuscated project

```bash

      cd codefend-output  //navigate to the output folder (codefend-output by default)
      npm install //install dependencies
      npm run build //build the obfuscated project
      npm run deploy  //deploy the obfuscated project
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
  debug: true,    // for additional logs
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
    prefix: "Ox", // the prefix of each variable, make sure its a valid character to start with a variable ( e.g do not start with "-"" or a number)
    predefinedWords: [], // words that you want to obfuscate them in a static way (determined output)
                         // {"originalWord":"l_secretVar" , "targetWord": "123456"}
                         // note that the original word should have a prefix 'l_' to be detected and replaced

    ignoredWords: ["node_modules"], // words that you wish not to obfuscate them and they unfortunately match the regex :)
    regexList: [
      {
        name: "main",
        value: "([a-zA-Z]+(_[a-zA-Z0-9]+)+)",//regex for variables,functions,classes ...
        flag: "g",
      },
      {
        name: "file",
        value: "((cmp|lib)+(-[a-zA-Z]+)+)",//regex for files (coming soon)
        flag: "g",
      },
    ],
  },
}

```

## Advanced Usage (beta)

### `Prefix`

default: "Ox"

### `Naming convention`

````js

Note: its possible to not follow the exact naming convention as long as the words you want to encrypts match the regex.

```js
//as an example you can use the same prefix for all words:
class l_Calculator {
  l_sum(l_a, l_b) {
    const l_results = l_a + l_b;
    return l_results;
  }
}
````

```js
// or use a custom prefix
class myApp_Calculator {
  myApp_sum(myApp_a, myApp_b) {
    const myApp_results = myApp_a + myApp_b;
    return myApp_results;
  }
}
```

### `Ignore Files`

its possible to ignore some files from being generated into the new obfuscated folder

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
