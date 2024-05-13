
  
  export default async function handler(req, res) {
    const { data } = req.body;

    const command = `C:\\Instrument\\Apps\\EPICS\\config_env.bat && uzhex`+ data;

    // Promisify the exec function to use async/await
    const execAsync = util.promisify(exec);

    try {
      // Run the command
      const { stdout, stderr } = await execAsync(command);

      // Check for any errors
      if (stderr) {
        console.error(`Error: ${stderr}`);
        res.status(500); // or throw an error, depending on your use case
      }
      res.status(200).json(stdout);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500); // or throw an error, depending on your use case
    }


    
  }
  