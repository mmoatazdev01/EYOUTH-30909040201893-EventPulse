const AppError = require('../../utils/AppError');
const asyncHandler = require('../../utils/asyncHandler');

describe('AppError', () => {
  it('initializes with message and status code', () => {
    const error = new AppError('Boom', 418);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Boom');
    expect(error.statusCode).toBe(418);
    expect(error.status).toBe('fail');
  });
});

describe('asyncHandler', () => {
  it('passes async errors to next', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    await asyncHandler(async () => {
      throw new Error('async fail');
    })(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].message).toBe('async fail');
  });
});
