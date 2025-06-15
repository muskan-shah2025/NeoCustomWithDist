# 🚀 NeoCustomWithDist – GitHub Action to Generate SBOM

This GitHub Action greets a user and generates a **Software Bill of Materials (SBOM)** using [CycloneDX's `cdxgen`](https://github.com/CycloneDX/cdxgen).  
It supports **two usage modes**:

---

## ⚙️ Modes of Execution

### 🐳 1. Docker-Based (default)

The Action runs using a prebuilt Docker image that includes `cdxgen`, `jq`, and Maven.  
This is the recommended method for full environment control.

### 🟨 2. Node.js-Based (`dist/index.js`)

Alternatively, the Action can run as a Node.js script using a precompiled `dist/index.js`.  
Useful for simple logic or smaller actions without container dependencies.

---

## 📦 Inputs

| Name           | Required | Default | Description         |
|----------------|----------|---------|---------------------|
| `who-to-greet` | ✅ Yes    | `World` | Name to greet       |

---

## 📤 Outputs

| Name        | Description                         |
|-------------|-------------------------------------|
| `sbom`      | SBOM JSON as a string               |
| `time`      | The time of greeting                |
| `root-files`| JSON array of root directory files  |

---

## 📄 Docker-Based Usage

```yaml
name: Generate SBOM (Docker)

on:
  push:
    branches: [main]

jobs:
  generate-sbom:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Run SBOM Generator (Docker)
        uses: muskan-shah2025/NeoCustomWithDist@main
        id: generate_sbom
        with:
          who-to-greet: "Neo"

      - name: Upload SBOM as Artifact
        uses: actions/upload-artifact@v4
        with:
          name: sbom
          path: sbom.json

      - name: Print SBOM
        run: echo "${{ steps.generate_sbom.outputs.sbom }}"
