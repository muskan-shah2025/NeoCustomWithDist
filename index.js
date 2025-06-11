const fs = require('fs');
const core = require('@actions/core');

try {
  const workspace = process.env.GITHUB_WORKSPACE;
  if (!workspace) {
    throw new Error("GITHUB_WORKSPACE environment variable is not set.");
  }

  const files = fs.readdirSync(workspace);
  console.log("Files in root directory:", files);

  core.setOutput("root-files", JSON.stringify(files));
} catch (error) {
  core.setFailed(error.message);
}
