
const core = require('@actions/core');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function installCDXGen() {
  core.info('📦 Installing @cyclonedx/cdxgen globally...');
  execSync('npm install -g @cyclonedx/cdxgen', { stdio: 'inherit' });
}

async function run() {
  try {
    const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
    const pomPath = path.join(workspace, 'pom.xml');

    if (!fs.existsSync(pomPath)) {
      throw new Error('❌ pom.xml not found in project root.');
    }

    await installCDXGen();

    core.info('📦 Found pom.xml, generating SBOM using CLI...');

    // Run cdxgen CLI directly – no need for dist/data at all
    const outputPath = path.join(workspace, 'sbom.json');
    execSync(`cdxgen -t java -o sbom.json`, {
      cwd: workspace,
      stdio: 'inherit',
    });

    const sbomContent = fs.readFileSync(outputPath, 'utf8');
    core.setOutput('sbom', sbomContent);
    core.info(`✅ SBOM generated at: ${outputPath}`);
  } catch (error) {
    core.setFailed(`❌ Action failed: ${error.message}`);
  }
}

run();

