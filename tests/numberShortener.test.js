import numberShortener from '../modules/numberShortener';

test('shortens five million', () => {
  expect(numberShortener({number: 5000000})).toBe('5m')
});

test('shortens ten thousand', () => {
  expect(numberShortener({number: 10000})).toBe('10k')
});

test('does not shorten 150', () => {
  expect(numberShortener({number: 150})).toBe('150')
});
