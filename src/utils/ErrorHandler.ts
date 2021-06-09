import { Response } from 'express';

// eslint-disable-next-line max-len
const errorHandler = (res: Response, statusCode: number = 400, text: string) => res.status(statusCode).json({
  status: statusCode,
  error: text,
});

export default errorHandler;
