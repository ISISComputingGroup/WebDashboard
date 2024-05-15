const util = require("util");
const { exec } = require("child_process");

  export default async function handler(req, res) {
    const reqBuffer = Buffer(req.body);

    if (!reqBuffer.length) {
      res.status(500).json("Error: empty argument list")
      return
    }

    const command = `C:\\Instrument\\Apps\\EPICS\\support\\utilities\\master\\bin\\windows-x64\\uzhex.exe ` + reqBuffer;

    // Promisify the exec function to use async/await
    const execAsync = util.promisify(exec);

    try {
      // Run the command
      const { stdout, stderr } = await execAsync(command);

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
      res.status(500).json(error.message); // or throw an error, depending on your use case
      return
    }
  }
  