import { Request, Response, NextFunction } from 'express';


export const errorHandler = async (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error.name === 'UnauthorizedError') {
		return res.status(401).json({ error: error, message: 'The user is not authorized' });
  } if (error.name === "ValidationError") {
    return res.status(401).json({ message: error });
  } else {
    return res.status(500).json({error: error, message: "Internal Server Error"})
  }
}