import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

@Injectable()
export class PvsService {
  private execAsync = promisify(exec);

  async dehexAndUnzip(pvValue: string): Promise<any> {
    const command = `C:\\Instrument\\Apps\\python3\\python.exe -c "import binascii;import zlib;print(zlib.decompress(binascii.unhexlify('${pvValue}')).decode())"`;

    try {
      const { stdout, stderr } = await this.execAsync(command);

      if (stderr) {
        console.error(`Error: ${stderr}`);
        throw new Error(`error: ${stderr}`);
      } else if (stdout == null) {
        throw new Error('error: command returned no output');
      }

      const sliced = stdout.slice(0, stdout.length - 2);
      const backslashesRemoved = JSON.parse(sliced);

      return backslashesRemoved;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }
}
