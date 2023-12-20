const { processRef, isSemanticVersionedTag } = require('../src/main');

describe('processRef function', () => {
  it('processes a simple tag reference', () => {
    const tagRef = 'refs/tags/mytag/1.2.3';
    const result = processRef(tagRef);
    expect(result.referenceType).toBe('tag');
    expect(result.tagPrefix).toBe('mytag');
    expect(result.processedTagPrefix).toBe('mytag');
    expect(result.tagSuffix).toBe('1.2.3');
    expect(result.processedTagSuffix).toBe('1-2-3');
  });

  it('processes a complex tag reference', () => {
    const tagRef = 'refs/tags/some/long/tag/1.2.3';
    const result = processRef(tagRef);
    expect(result.referenceType).toBe('tag');
    expect(result.tagPrefix).toBe('some/long/tag');
    expect(result.processedTagPrefix).toBe('some-long-tag');
    expect(result.tagSuffix).toBe('1.2.3');
    expect(result.processedTagSuffix).toBe('1-2-3');
  });

  it('processes a complex branch reference', () => {
    const branchRef = 'refs/heads/feature/new/branch';
    const result = processRef(branchRef);
    expect(result.referenceType).toBe('branch');
    expect(result.branchName).toBe('feature/new/branch');
    expect(result.branchNameProcessed).toBe('feature-new-branch');
  });

  it('processes a simple branch reference', () => {
    const branchRef = 'refs/heads/main';
    const result = processRef(branchRef);
    expect(result.referenceType).toBe('branch');
    expect(result.branchName).toBe('main');
    expect(result.branchNameProcessed).toBe('main');
  });

  // Additional tests as needed
});

describe('Semantic Version Tag Tests', () => {
  test.each([
    ['1.2.3', true],
    ['1.4.2-alpha', true],
    ['2.3.1-rc.1', true],
    ['v1.7.7', true],
    ['v4.3.2-beta', true],
    ['v100.200.100-alpha.100', true],
    ['1.2.3-delta4', true],
    // Invalid cases
    ['1.2', false],
    ['1.2-beta', false],
    ['v1.2', false],
    ['abc', false],
    ['123', false],
    ['v1.2.3.4', false],
    ['1.2.3.4', false],
    ['1.2.3+', false],
  ])('should return %s for tag %s', (tag, expectedResult) => {
    expect(isSemanticVersionedTag(tag)).toBe(expectedResult);
  });
});
