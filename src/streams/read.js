import { Readable } from 'stream';
import { readFile } from 'fs';

export class Reader extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;

  }

  _read() {
    readFile(this.filename, (err, chunk) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(chunk);
        this.push(null);
      };
    });
  }

}
