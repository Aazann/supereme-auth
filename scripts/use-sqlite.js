/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace provider definition
schema = schema.replace(/provider\s*=\s*"(postgresql|sqlite)"/, 'provider = "sqlite"');

fs.writeFileSync(schemaPath, schema);
console.log("Database provider set to SQLite for development & testing.");

// Create .env file for local SQLite configurations
const envPath = path.join(__dirname, '..', '.env');
fs.writeFileSync(
  envPath,
  'DATABASE_URL="file:./dev.db"\nBETTER_AUTH_SECRET="supreme_secret_key_12345678"\nBETTER_AUTH_URL="http://localhost:3000"\n'
);
console.log("Created .env with SQLite configurations.");
