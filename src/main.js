const core = require('@actions/core');
const github = require('@actions/github');

try {
  const token = core.getInput('github_token');
  console.log(`Using github token: ${token}`);
  const octokit = new github.getOctokit(token);
} catch (error) {
  console.log("Unable to find github token. Probably not running on github actions.");
}

async function getFullRef(shortRef) {
  // Check if shortRef is already a full ref
  if (shortRef.startsWith('refs/')) {
    return shortRef;
  }

  // Attempt to find the full reference via GitHub API
  const { data: refs } = await octokit.rest.git.listMatchingRefs({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: shortRef
  });

  if (refs.length === 0) {
    throw new Error(`No matching reference found for ${shortRef}`);
  }

  // Assuming the first match is the desired one
  return refs[0].ref;
}

function processRef(ref) {
  let referenceType;
  let fullHash = '';
  let tagPrefix = '';
  let processedTagPrefix = '';
  let tagSuffix = '';
  let processedTagSuffix = '';
  let branchName = '';
  let branchNameProcessed = '';

  if(ref.startsWith('refs/tags/')) {
    referenceType = 'tag';
    const tagParts = ref.replace('refs/tags/', '').split('/');
    tagSuffix = tagParts.pop();
    processedTagSuffix = tagSuffix.replace(/\./g, '-');
    tagPrefix = tagParts.join('/');
    processedTagPrefix = tagParts.join('-');
  } else if(ref.startsWith('refs/heads/')) {
    referenceType = 'branch';
    branchName = ref.replace('refs/heads/', '');
    branchNameProcessed = branchName.replace(/\//g, '-');
  }

  return { 
    referenceType, 
    fullHash, 
    tagPrefix, 
    processedTagPrefix, 
    tagSuffix, 
    processedTagSuffix, 
    branchName, 
    branchNameProcessed 
  };
}

module.exports = { processRef };

try {
} catch (error) {
  core.setFailed(error.message);
}

async function run() {
  try {
    let ref = core.getInput('ref');
    ref = await getFullRef(ref);
  
    const { 
      referenceType, 
      fullHash, 
      tagPrefix, 
      processedTagPrefix, 
      tagSuffix, 
      processedTagSuffix, 
      branchName, 
      branchNameProcessed 
    } = processRef(ref);
  
    core.setOutput("reference_type", referenceType);
    core.setOutput("original_ref", ref);
    core.setOutput("full_hash", fullHash);
    core.setOutput("tag_prefix", tagPrefix);
    core.setOutput("processed_tag_prefix", processedTagPrefix);
    core.setOutput("tag_suffix", tagSuffix);
    core.setOutput("processed_tag_suffix", processedTagSuffix);
    core.setOutput("branch_name", branchName);
    core.setOutput("branch_name_processed", branchNameProcessed);
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}