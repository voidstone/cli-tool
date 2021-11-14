import { Transform } from 'stream';
import { Caesar } from '../ciphers/caesar.js';
import { Rot } from '../ciphers/rot8.js';
import { Atbash } from '../ciphers/atbash.js';
import { Operations } from '../operations/operations.js';

export class Transforming extends Transform {
  constructor() {
    super();
    this.caesar = new Caesar();
    this.rot8 = new Rot();
    this.atbash = new Atbash();
    this.operations = new Operations();
  }

  getArrParams() {
    const myArgs = process.argv.slice(2);

    const configIndex = myArgs.indexOf('-c') !== -1
      ? myArgs.indexOf('-c')
      : myArgs.indexOf('--config');

    const config = myArgs[configIndex + 1];
    return config.split('-').filter(Boolean);
  }

  applyCipher(string) {
    const operationsArr = this.getArrParams();
    let result = string;

    for (let operation of operationsArr) {
      switch (operation) {
        case `${this.operations.use.caesarEn}`:
          result = this.caesar.ciphering(result,1);
          break;
        case `${this.operations.use.caesarDe}`:
          result = this.caesar.ciphering(result,-1);
          break;
        case `${this.operations.use.rotEn}`:
          result = this.rot8.ciphering(result,8);
          break;
        case `${this.operations.use.rotDe}`:
          result = this.rot8.ciphering(result,-8);
          break;
        case `${this.operations.use.atbash}`:
          result = this.atbash.encode(result);
          break;
      }
    }

    return result;
  }

  _transform(chunk, _encoding, callback) {
    try {
      const resultString = `${this.applyCipher(chunk.toString('utf8'))}`;
      callback(null, resultString);
    } catch (err) {
      callback(err);
    }
  }

}
