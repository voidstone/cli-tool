
export class Atbash {

    encode(str) {

        let output = "";

        for (let i = 0; i < str.length; i++) {
            let c = str[i];

            if (c.match(/[a-z]/i)) {

                let code = str.charCodeAt(i);

                // Uppercase letters
                if (code >= 65 && code <= 90) {
                    c = String.fromCharCode(90 - ((code - 65 ) % 26) );
                }
                // Lowercase letters
                else if (code >= 97 && code <= 122) {
                    c = String.fromCharCode(122 - ((code - 97 ) % 26));
                }

            }

            output += c;

        }
        return output;
    }

}
