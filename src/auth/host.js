import createError from 'http-errors';

export const checkHostRole = (req, res, next) => {
  if (req.user.role === 'host') next();
  else next(createError(403, 'Admin only'));
};
