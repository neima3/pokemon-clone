#!/usr/bin/env node
/**
 * Version bump script - run before Vercel deploy
 * Increments patch version and updates build date
 */

const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../src/app/version.ts');
const changelogFile = path.join(__dirname, '../CHANGELOG.md');

// Read current version
let versionContent = fs.readFileSync(versionFile, 'utf8');

// Extract current version
const majorMatch = versionContent.match(/major:\s*(\d+)/);
const minorMatch = versionContent.match(/minor:\s*(\d+)/);
const patchMatch = versionContent.match(/patch:\s*(\d+)/);

let major = parseInt(majorMatch?.[1] || '0');
let minor = parseInt(minorMatch?.[1] || '0');
let patch = parseInt(patchMatch?.[1] || '0');

// Increment patch version
patch++;

// Update version file
const today = new Date().toISOString().split('T')[0];
const newVersionContent = `// Auto-generated version info - updated on each deploy
export const VERSION = {
  major: ${major},
  minor: ${minor},
  patch: ${patch},
  full: '${major}.${minor}.${patch}',
  buildDate: '${today}',
  sprint: ${minor},
};

export const getVersionString = () => \`v\${VERSION.full}\`;
`;

fs.writeFileSync(versionFile, newVersionContent);
console.log(`✅ Version bumped to ${major}.${minor}.${patch}`);

// Update CHANGELOG.md with new version header if needed
let changelog = fs.readFileSync(changelogFile, 'utf8');
const versionHeader = `## [${major}.${minor}.${patch}]`;

if (!changelog.includes(versionHeader)) {
  const newEntry = `## [${major}.${minor}.${patch}] - ${today}

### Added
- Deployed updates and improvements

`;
  // Insert after the header
  changelog = changelog.replace(
    '## [Unreleased]\n\n',
    `## [Unreleased]\n\n${newEntry}`
  );
  fs.writeFileSync(changelogFile, changelog);
  console.log(`✅ CHANGELOG.md updated`);
}

console.log('🚀 Ready for deploy!');
