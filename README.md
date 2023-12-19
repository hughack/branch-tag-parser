# Tag and Branch Processor Action

## Overview
This GitHub Action processes git references (tags and branches) for CI/CD workflows. It handles both full and shortened references, converting them into a format suitable for various deployment and versioning scenarios.

## Features
- Processes tag and branch references.
- Supports both full references (`refs/heads/`, `refs/tags/`) and shortened ones (`my-branch`, `my-tag/1.2.3`).
- Extracts and processes parts of tags and branches for versatile use.

## Inputs

- `ref`: The git reference (tag or branch) to process.

## Outputs

- `reference_type`: Indicates whether the input is a tag or a branch.
- `original_ref`: The original reference string.
- `full_hash`: Full commit hash (if applicable).
- `tag_prefix`: Unprocessed prefix part of the tag (if applicable).
- `processed_tag_prefix`: Processed tag prefix with slashes replaced by dashes.
- `tag_suffix`: Suffix part of the tag (if applicable).
- `processed_tag_suffix`: Processed tag suffix with slashes replaced by dashes.
- `branch_name`: Unprocessed branch name (if applicable).
- `branch_name_processed`: Processed branch name with slashes replaced by dashes.

## Usage

Include this action in your GitHub Actions workflow to process git references:

```yaml
jobs:
  process-git-ref:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: Process Git Reference
      id: ref_processor
      uses: hughack/branch-tag-parser@v<version>
      with:
        ref: ${{ github.ref }}

    - name: Use Outputs
      run: |
        echo "Reference Type: ${{ steps.ref_processor.outputs.reference_type }}"
        echo "Original Reference: ${{ steps.ref_processor.outputs.original_ref }}"
        # ... additional echos for other outputs ...
```

## Example

Here's an example of how to use this action in a workflow:

```yaml
name: Example Workflow

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 0

    - name: Process Git Reference
      uses: ./.github/actions/tag-and-branch-processor
      with:
        ref: ${{ github.ref }}

    - name: Display Processed Reference
      run: echo "Processed Reference: ${{ steps.ref_processor.outputs.branch_name_processed }}"
```
