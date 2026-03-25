const fs = require("fs");
const path = require("path");

const filesToCopy = [
  {
    source: path.join(__dirname, "..", "node_modules", "bootstrap", "dist", "css", "bootstrap.min.css"),
    target: path.join(__dirname, "..", "vendor", "bootstrap", "css", "bootstrap.min.css")
  },
  {
    source: path.join(__dirname, "..", "node_modules", "bootstrap", "dist", "js", "bootstrap.bundle.min.js"),
    target: path.join(__dirname, "..", "vendor", "bootstrap", "js", "bootstrap.bundle.min.js")
  }
];

for (const file of filesToCopy) {
  if (!fs.existsSync(file.source)) {
    console.error(`Missing Bootstrap asset: ${file.source}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(file.target), { recursive: true });
  fs.copyFileSync(file.source, file.target);
}

console.log("Bootstrap assets copied into vendor/bootstrap for offline use.");
