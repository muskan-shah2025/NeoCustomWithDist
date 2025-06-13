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
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function installCDXGen() {
  core.info('📦 Installing @cyclonedx/cdxgen...');
  execSync('npm install @cyclonedx/cdxgen', { stdio: 'inherit' });
}

async function run() {
  try {
    const workspace = process.env.GITHUB_WORKSPACE || process.cwd();

    // Dynamically create dist/data folder inside runner workspace
    const distDataPath = path.join(workspace, 'dist/data');
    if (!fs.existsSync(distDataPath)) {
      fs.mkdirSync(distDataPath, { recursive: true });
      core.info('✅ Created dist/data folder dynamically');
    }

    // Dynamically create lic-mapping.json stub file inside dist/data
    const licMappingFile = path.join(distDataPath, 'lic-mapping.json');
    if (!fs.existsSync(licMappingFile)) {
      fs.writeFileSync(licMappingFile, '{}');
      core.info('✅ Created stub lic-mapping.json file dynamically');
    }

    await installCDXGen();

    const { createBom } = require('@cyclonedx/cdxgen');

    const pomPath = path.join(workspace, 'pom.xml');
    if (!fs.existsSync(pomPath)) {
      throw new Error('pom.xml not found in root directory.');
    }

    core.info('📦 Found pom.xml, generating SBOM...');

    const bom = await createBom(workspace, {
      multiProject: false,
      installDeps: false,
      deep: true,
      outputFormat: 'json',
    });

    const outputPath = path.join(workspace, 'sbom.json');
    fs.writeFileSync(outputPath, JSON.stringify(bom, null, 2));

    core.setOutput('sbom', JSON.stringify(bom));
    core.info(`✅ SBOM generated at: ${outputPath}`);
  } catch (error) {
    core.setFailed(`❌ Action failed: ${error.message}`);
  }
}

run();






