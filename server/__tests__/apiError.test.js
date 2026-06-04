import ApiError from '../src/utils/ApiError.js';

describe('ApiError', () => {
  it('creates an error with status code and message', () => {
    const error = new ApiError(404, 'Not found');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.isOperational).toBe(true);
  });
});
