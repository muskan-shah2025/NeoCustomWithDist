// const fs = require("fs");
// const path = require("path");
// const core = require("@actions/core");
// const { execSync } = require("child_process");

// try {
//   const workspace = process.env.GITHUB_WORKSPACE;
//   if (!workspace) {
//     throw new Error("GITHUB_WORKSPACE environment variable is not set.");
//   }

//   // List all files in root directory
//   const files = fs.readdirSync(workspace);
//   console.log("Files in root directory:", files);

//   // Filter for pom.xml
//   const hasPom = files.includes("pom.xml");
//   if (!hasPom) {
//     throw new Error("pom.xml not found in the root directory.");
//   }

//   // Run cdxgen to generate SBOM for pom.xml
//   // Assuming cdxgen is installed in your runner environment
//   const sbomFile = "sbom.json";
//   console.log("Generating SBOM with cdxgen for pom.xml...");

//   // Run cdxgen in the workspace directory
//   execSync(`cdxgen -r -o ${sbomFile}`, { cwd: workspace, stdio: "inherit" });

//   // Check if sbom file generated
//   const sbomPath = path.join(workspace, sbomFile);
//   if (!fs.existsSync(sbomPath)) {
//     throw new Error(`SBOM file ${sbomFile} was not created.`);
//   }

//   // Read the generated SBOM file
//   const sbomContent = fs.readFileSync(sbomPath, "utf-8");
//   console.log(`SBOM generated successfully: ${sbomFile}`);

//   // Set SBOM content as output (stringified)
//   core.setOutput("sbom", sbomContent);

// } catch (error) {
//   core.setFailed(error.message);
// }


// const core = require('@actions/core');
// const path = require("path");
// const fs = require("fs");
// const { createBom } = require("@cyclonedx/cdxgen");  // Import once here

// async function run() {
//   try {
//     const username = core.getInput('username');
//     const password = core.getInput('password');

//     core.info(`✅ Login attempt for user: ${username}`);

//     const target = path.resolve(".");
//     if (!fs.existsSync(path.join(target, "pom.xml"))) {
//       throw new Error("pom.xml not found in root directory.");
//     }

//     core.info("📦 Found pom.xml, generating SBOM...");

//     const bom = await createBom(target, {
//       multiProject: false,
//       installDeps: false,
//       deep: true,
//       outputFormat: "json",
//     });

//     const outputPath = path.resolve("sbom.json");
//     fs.writeFileSync(outputPath, JSON.stringify(bom, null, 2));

//     core.info(`✅ SBOM generated at: ${outputPath}`);
//   } catch (error) {
//     core.setFailed(`❌ Action failed: ${error.message}`);
//   }
// }

// run();

const core = require('@actions/core');
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

async function run() {
  try {
    const username = core.getInput('username');
    const password = core.getInput('password');

    core.info(`✅ Login attempt for user: ${username}`);

    const workspace = process.env.GITHUB_WORKSPACE;
    if (!workspace) {
      throw new Error("GITHUB_WORKSPACE environment variable is not set.");
    }

    // Verify pom.xml exists
    if (!fs.existsSync(path.join(workspace, "pom.xml"))) {
      throw new Error("pom.xml not found in the root directory.");
    }

    core.info("📦 Found pom.xml, generating SBOM...");

    // Run cdxgen CLI in the workspace folder
    execSync("cdxgen -r -o sbom.json", { cwd: workspace, stdio: "inherit" });

    // Check SBOM generated
    const sbomPath = path.join(workspace, "sbom.json");
    if (!fs.existsSync(sbomPath)) {
      throw new Error("SBOM file sbom.json was not created.");
    }

    // Read SBOM contents
    const sbomContent = fs.readFileSync(sbomPath, "utf-8");

    core.info(`✅ SBOM generated successfully: sbom.json`);

    // Set output
    core.setOutput("sbom", sbomContent);

  } catch (error) {
    core.setFailed(`❌ Action failed: ${error.message}`);
  }
}

run();


