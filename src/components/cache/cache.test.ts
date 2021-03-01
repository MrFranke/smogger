import { setToCache, getFromCache } from '.'

const PATH = '/entity/id'
const METHOD = 'POST'
const DATA = JSON.stringify({ test: 'data' });

test('Put into cache without error', () => {
  setToCache(PATH, METHOD, DATA);
});

test('Get from cache without error', () => {
  setToCache(PATH, METHOD, DATA);
  expect(getFromCache(PATH, METHOD)).toEqual(DATA)
});