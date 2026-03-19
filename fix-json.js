const fs = require('fs');
const path = require('path');

function sanitize(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      sanitize(fullPath);
    } else if (fullPath.endsWith('.json')) {
      let content;
      try {
        content = fs.readFileSync(fullPath, 'utf8');
      } catch (e) {
        console.error(`Read error on ${fullPath}:`, e);
        continue;
      }
      
      // Remove UTF-8 BOM if present
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      
      content = content.trim();
      
      // If it's empty, set it to a valid empty JSON object
      if (content === '') {
        fs.writeFileSync(fullPath, "{\n}", 'utf8');
        console.log(`Fixed empty file: ${fullPath}`);
      } else {
        // Ensure it parses successfully
        try {
          JSON.parse(content);
        } catch (e) {
          console.log(`Fixed invalid JSON in: ${fullPath} - Error: ${e.message}`);
          fs.writeFileSync(fullPath, "{\n}", 'utf8');
        }
      }
    }
  }
}

console.log('Scanning for empty or invalid JSON files...');
sanitize(path.join(__dirname, 'i18'));
console.log('Done.');
