import express from 'express';
import expressFileUpload, { UploadedFile } from 'express-fileupload';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

import { NotFoundHandler, ErrorHandler } from '@/utils/Middlewares';

dotenv.config();

const server = express();

server.use(morgan('dev'));
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(expressFileUpload());
server.use(express.static('upload'));

server.get('/', (_, response) => {
  response.json({
    message: '👋🌎🌍🌏 - Hello World!',
  });
});

server.post('/upload', (request, response) => {
  if (!request.files) {
    return response.status(400).send('No files were uploaded.');
  }

  if (Object.keys(request.files).length >= 2) {
    return response.status(400).send('Upload only one file at time.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const file = request.files.file as UploadedFile;
  const uploadPath = `${__dirname}/upload/${file.md5}}`;

  // Use the mv() method to place the file somewhere on your server
  file.mv(uploadPath, (err) => {
    if (err) {
      return response.status(500).send(err);
    }

    return response.status(201).json({ path: uploadPath, hash: file.md5 });
  });
});

server.use(NotFoundHandler);
server.use(ErrorHandler);

export default server;
