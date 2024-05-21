const util = require("util");
const { exec } = require("child_process");
const {unzip, deflate} = require('node:zlib')

/**
 * This is a function that dehexes long PVs and returns their string representation. 
 * At some point this will be redundant as we will just dehex+unzip on the client side,
 * but for now i'm too lazy to figure that out so just send a GET with the body of the pv val and this will unscramble it
 * @param {*} req the request - set GET body to raw pv value
 * @param {*} res 500 if error, 200 with string if not
 * @returns null
 */
  export default async function handler(req, res) {
    const reqBuffer = Buffer(req.body);

    if (!reqBuffer.length) {
      res.status(500).json("Error: empty argument list")
      return
    }

    deflate(reqBuffer, (err, buffer) => {
      if (err) {
        console.error('An error occurred:', err);
        process.exitCode = 1;
      }
      console.log(buffer.toString('base64'));
      return
    });
    

    const command = `C:\\Instrument\\Apps\\python3\\python.exe -c "import binascii;import zlib;print(zlib.decompress(binascii.unhexlify('${reqBuffer}')).decode())" `;

    // Promisify the exec function to use async/await
    const execAsync = util.promisify(exec);

    try {
      // Run the command
      // const { stdout, stderr } = await execAsync(command);



      // Check for any errors
      if (stderr ) {
        console.error(`Error: ${stderr}`);
        res.status(500).json(`error: ${stderr}`); // or throw an error, depending on your use case
        return
      }  else if (stdout == null) {
        res.status(500).json(`error: command returned no output`); // or throw an error, depending on your use case
        return
      }
      res.status(200).json(stdout);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json(error); // or throw an error, depending on your use case
      return
    }
  }
  