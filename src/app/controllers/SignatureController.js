import fs from 'fs';
import crypto from 'crypto';
import { extname, resolve } from 'path';
import File from '../models/File';

class SignatureController {
  async store(req, res) {
    const { originalname: name, signatureBase64 } = req.body;

    const path = crypto.randomBytes(16).toString('hex') + extname(name);

    const destination = resolve(__dirname, '..', '..', '..', 'tmp', 'upload');

    fs.writeFile(
      `${destination}/${path}`,
      signatureBase64,
      { encoding: 'base64' },
      err => {
        console.log(err);
        console.log('File created');
      }
    );

    const file = await File.create({ name, path });

    return res.json(file);
  }
}

export default new SignatureController();
