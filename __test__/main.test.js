const { processRef } = require('../src/main');

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
