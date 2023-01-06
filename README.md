<p align="center">
 <img src="./public/img/logo.png">
</p>

# Codefend

Codefend short for "Code Defender" encrypts your code regardless of your source code language or framework.

## Installation

#### Globally

```bash
npm install -g codefend
```

#### Dev dependency

```bash
npm install -D codefend
```

#### npx

In case you want to execute it directly without installing it on your machine:

```bash
npx codefend -i  //generates .codefendrc.json
npx codefend -o  //obfuscates your whole project inside a new directory: 'codefend-output'
```

## Commands

```bash
Usage: codefend [options]

Defend Your Code By All Means Necessary. 💪 😎

Options:
  -V, --version    output the version number
  -i, --init       Create .codefendrc.json (configuration file)
  -c, --check      Check .codefendrc.json for potential warnings/errors
  -o, --obfuscate  Obfuscate your project (based on .codefendrc.json)
  -h, --help       display help for command
```

## Philosophy

The only thing Codefend needs from you as a programmer is to follow a specific naming convention for the "words" that you want to obfuscate (variable/functions/classes...) and Codefend will do its magic! this basic rule apply to all the languages and the frameworks that you're programming with.

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
```

Note: its possible to not follow the exact naming convention as long as the words you want to encrypts match the regex,

```js
//as an example you can use the same prefix for all words:
class l_Calculator {
  l_sum(l_a, l_b) {
    const l_results = l_a + l_b;
    return l_results;
  }
}

// or use a custom prefix
class myApp_Calculator {
  myApp_sum(myApp_a, myApp_b) {
    const myApp_results = myApp_a + myApp_b;
    return myApp_results;
  }
}
```

it is possible also to change the regex from the .codefendrc.json file so that you name the variables in another way

## Usage

<p align="center">
 <img src="./public/img/npx_example_1.PNG">
</p>

## Examples

[Node js](https://github.com/Codefend/core/tree/main/examples/nodejs)

### Angular (coming soon)

### React (coming soon)

### Vue (coming soon)

### Svelte (coming soon)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
