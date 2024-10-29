const fs = require('fs').promises;
const path = require('path');
const TOML = require('@iarna/toml');

async function generateFiles() {
  try {
    // Read and parse TOML file
    const tomlContent = await fs.readFile('config.toml', 'utf-8');
    const config = TOML.parse(tomlContent);

    // Create generated directory if it doesn't exist
    await fs.mkdir('generated', { recursive: true });

    // Generate files based on TOML configuration
    for (const [_, fileConfig] of Object.entries(config.files)) {
      const filePath = fileConfig.path;
      const content = fileConfig.content;

      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      // Write content based on type
      const fileContent = typeof content === 'object' 
        ? JSON.stringify(content, null, 2)
        : content;

      await fs.writeFile(filePath, fileContent);
      console.log(`Generated: ${filePath}`);
    }

    console.log('File generation completed successfully!');
  } catch (error) {
    console.error('Error generating files:', error);
    process.exit(1);
  }
}

generateFiles();