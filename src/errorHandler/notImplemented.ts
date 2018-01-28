import { Request, Response, NextFunction } from 'express';
import { METHOD_NOT_ALLOWED } from 'http-status-codes';

function notImplemented(req: Request, res: Response, next: NextFunction) {
  res.status(METHOD_NOT_ALLOWED).json({
    data: "Not Implemented."
  })
}

export default notImplemented;
