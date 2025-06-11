const fs = require("fs");
const path = require("path");
const core = require("@actions/core");
const { execSync } = require("child_process");

try {
  const workspace = process.env.GITHUB_WORKSPACE;
  if (!workspace) {
    throw new Error("GITHUB_WORKSPACE environment variable is not set.");
  }

  // List all files in root directory
  const files = fs.readdirSync(workspace);
  console.log("Files in root directory:", files);

  // Filter for pom.xml
  const hasPom = files.includes("pom.xml");
  if (!hasPom) {
    throw new Error("pom.xml not found in the root directory.");
  }

  // Run cdxgen to generate SBOM for pom.xml
  // Assuming cdxgen is installed in your runner environment
  const sbomFile = "sbom.json";
  console.log("Generating SBOM with cdxgen for pom.xml...");

  // Run cdxgen in the workspace directory
  execSync(`cdxgen -r -o ${sbomFile}`, { cwd: workspace, stdio: "inherit" });

  // Check if sbom file generated
  const sbomPath = path.join(workspace, sbomFile);
  if (!fs.existsSync(sbomPath)) {
    throw new Error(`SBOM file ${sbomFile} was not created.`);
  }

  // Read the generated SBOM file
  const sbomContent = fs.readFileSync(sbomPath, "utf-8");
  console.log(`SBOM generated successfully: ${sbomFile}`);

  // Set SBOM content as output (stringified)
  core.setOutput("sbom", sbomContent);

} catch (error) {
  core.setFailed(error.message);
}
