import { f_sum } from "./bar";

class c_Main {
  constructor() {
    this.f_run();
  }

  f_run() {
    const l_firstNumber = 5;
    const l_secondNumber = 10;
    console.log(f_sum(l_firstNumber, l_secondNumber));
  }
}
