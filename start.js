import {Validador} from "./src/validate/validator.js";
import {PromtErrors} from "./src/errors/PromtErrors.js";
import {Transforming} from "./src/streams/transform.js";
import {Reader} from "./src/streams/read.js";
import {Writer} from "./src/streams/write.js";
import {pipeline} from "stream";

class App {
  constructor(consoleArgs) {
    this.args = consoleArgs;
    this.validador = new Validador(this.args);
    this.customErrors = new PromtErrors();
  }

  reading() {
    return this.processing('-i', '--input', process.stdin, 'Reader');
  }

  processing(short, long, input, classNameString) {
    return (!this.args.includes(short) && !this.args.includes(long))
      ? input
      : (this.args.includes(short))
        ? eval("new " + classNameString + "(this.args[this.args.indexOf(short) + 1])")
        : eval("new " + classNameString + "(this.args[this.args.indexOf(long) + 1])");
  }

  transforming() {
    return new Transforming();
  }

  writing() {
    return this.processing('-o', '--output', process.stdin, 'Writer');
  }

  createPipeline() {
    pipeline(
      this.reading(),
      this.transforming(),
      this.writing(),
      err => err
        ? this.customErrors.exit(`Something went wrong. Error is:   ${err.message}`)
        : console.log('param pam pam see output!')
    );
  }

  async start() {
    await this.validador.validate();
    this.createPipeline();
  }

}

export const app = new App(process.argv.slice(2));