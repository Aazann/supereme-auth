/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace provider definition
schema = schema.replace(/provider\s*=\s*"(postgresql|sqlite)"/, 'provider = "postgresql"');

fs.writeFileSync(schemaPath, schema);
console.log("Database provider set to PostgreSQL for production.");
