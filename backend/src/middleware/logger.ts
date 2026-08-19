import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const start = Date.now();
  _res.on('finish', () => {
    const ms = Date.now() - start;
    const level = _res.statusCode >= 500 ? 'ERROR' : _res.statusCode >= 400 ? 'WARN' : 'INFO';
    console.log(`[${level}] ${req.method} ${req.path} → ${_res.statusCode} (${ms}ms)`);
  });
  next();
}
