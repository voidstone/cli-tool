import { PromtErrors } from "../errors/PromtErrors.js";
import { Operations } from "../operations/operations.js";
import { Options } from "../operations/options.js";
import { access } from 'fs/promises';
import { constants } from 'fs';

export class Validador {
  constructor(consoleArgs) {
    this.args = consoleArgs;
    this.options = new Options();
    this.operations = new Operations();
    this.promtErrors = new PromtErrors();
  }

  checkOptions() {
    const args = this.args;

    if (!this.options.params.hasOwnProperty(args[0])) {
      this.promtErrors.exit('there is no such parameter in the list.');
    };

    for (let arg of args) {

      if (arg.startsWith('-')) {

        if (!this.options.params[arg]) {
          this.promtErrors.exit(`unknown parameter ${arg} .`);
        };

        if (args.indexOf(arg) !== args.lastIndexOf(arg) || args.indexOf(this.options.params[arg]) !== -1) {
          this.promtErrors.exit('parameters should not be repeated.');
        };
      };
    };

    return this;
  }

  checkConfig() {
    const args = this.args;

    const configIndex = args.indexOf('-c') !== -1
      ? args.indexOf('-c')
      : args.indexOf('--config');

    if (configIndex === -1) {
      this.promtErrors.exit('An error occurred: A required option -c/--config was not passed.');
    };

    const config = args[configIndex + 1];
    const operations = config.split('-').filter(Boolean);

    operations.map(operation => this.operations.params.includes(operation)
      ? operation
      : this.promtErrors.exit(`An unknown encode/decode operation ${operation} was entered.`));

    return this;
  }

  async checkInput() {
    const args = this.args;

    if (!args.includes('-i') && !args.includes('--input')) {
      return;
    } else if (args.includes('-i')) {
      const inputIndex = args.indexOf('-i');
      const inputPath = args[inputIndex + 1];
      try {
        await access(inputPath, constants.R_OK);
      } catch {
        this.promtErrors.exit('An error occurred: the path to the "input" file was not transferred or there is no access to it.');
      }
    } else {
      const inputIndex = args.indexOf('--input');
      const inputPath = args[inputIndex + 1];
      try {
        await access(inputPath, constants.R_OK);
      } catch {
        this.promtErrors.exit('An error occurred: the path to the "input" file was not transferred or there is no access to it.');
      }
    }
  }

  async checkOutput() {
    const args = this.args;

    if (!args.includes('-o') && !args.includes('--output')) {
      return;
    } else if (args.includes('-o')) {
      const outputIndex = args.indexOf('-o');
      const outputPath = args[outputIndex + 1];
      try {
        await access(outputPath, constants.W_OK);
      } catch {
        this.promtErrors.exit('An error occurred: the path to the "output" file was not transferred or there is no access to it.');
      }
    } else {
      const outputIndex = args.indexOf('--output');
      const outputPath = args[outputIndex + 1];
      try {
        await access(outputPath, constants.W_OK);
      } catch {
        this.promtErrors.exit('An error occurred: the path to the "output" file was not transferred or there is no access to it.');
      }
    }
  }

  async validate() {
    this
      .checkOptions()
      .checkConfig();
    await this.checkInput();
    await this.checkOutput();
  }

}
