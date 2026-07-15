/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace provider definition
schema = schema.replace(/provider\s*=\s*"(postgresql|sqlite)"/, 'provider = "postgresql"');

fs.writeFileSync(schemaPath, schema);
console.log("Database provider set to PostgreSQL for production.");

// Create .env file for production compile compatibility
const envPath = path.join(__dirname, '..', '.env');
fs.writeFileSync(
  envPath,
  'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/better_auth?connect_timeout=0"\nBETTER_AUTH_SECRET="supreme_secret_key_12345678"\nBETTER_AUTH_URL="http://localhost:3000"\n'
);
console.log("Created .env with PostgreSQL configurations.");
