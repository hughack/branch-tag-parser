const core = require('@actions/core');
const github = require('@actions/github');

function processRef(ref) {
  let referenceType;
  let tagPrefix = '';
  let processedTagPrefix = '';
  let tagSuffix = '';
  let processedTagSuffix = '';
  let branchName = '';
  let branchNameProcessed = '';

  if (ref.startsWith('refs/tags/')) {
    referenceType = 'tag';
    const tagParts = ref.replace('refs/tags/', '').split('/');
    tagSuffix = tagParts.pop();
    processedTagSuffix = tagSuffix.replace(/\./g, '-');
    tagPrefix = tagParts.join('/');
    processedTagPrefix = tagParts.join('-');
  } else if (ref.startsWith('refs/heads/')) {
    referenceType = 'branch';
    branchName = ref.replace('refs/heads/', '');
    branchNameProcessed = branchName.replace(/\//g, '-');
  }

  console.log(`Reference type: ${referenceType}`);

  return {
    referenceType,
    tagPrefix,
    processedTagPrefix,
    tagSuffix,
    processedTagSuffix,
    branchName,
    branchNameProcessed
  };
}

function isSemanticVersionedTag(tag) {
  // From here: https://semver.org/
  const semverRegex = /^(v)?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/i;
  return semverRegex.test(tag);
}

module.exports = { processRef, isSemanticVersionedTag };

function run() {
  try {
    // Source branch, source version
    let ref = core.getInput('ref') || github.context.ref
    let commit = github.context.sha

    const {
      referenceType,
      tagPrefix,
      processedTagPrefix,
      tagSuffix,
      processedTagSuffix,
      branchName,
      branchNameProcessed
    } = processRef(ref);

    core.setOutput("reference_type", referenceType);
    core.setOutput("original_ref", ref);
    core.setOutput("commit_hash", commit);
    core.setOutput("tag_prefix", tagPrefix);
    core.setOutput("tag_prefix_processed", processedTagPrefix);
    core.setOutput("tag_suffix", tagSuffix);
    core.setOutput("is_semver_tag", isSemanticVersionedTag(tagSuffix));
    core.setOutput("tag_suffix_processed", processedTagSuffix);
    core.setOutput("branch_name", branchName);
    core.setOutput("branch_name_processed", branchNameProcessed);
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}