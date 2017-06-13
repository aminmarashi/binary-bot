import standardAction from './';

const type = 'some type';
const actionCreator = standardAction(type);
const payload = {};
const errorPayload = Error('some msg');
const error = true;

describe('standardAction action creator', () => {
    it('should return an action creator with just payload (no error handling)', () => {
        expect(actionCreator(payload)).toEqual({
            type,
            payload,
        });
    });
    it('should return an action creator with payload and error', () => {
        expect(actionCreator(errorPayload, error)).toEqual({
            type,
            payload: errorPayload,
            error,
        });
    });
});
