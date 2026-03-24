#!/usr/bin/env node
/**
 * Run with: node scripts/verify-setup.js
 * Checks your .env.local is configured and Supabase is reachable.
 */

const fs = require('fs')
const path = require('path')

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local')
if (!fs.existsSync(envPath)) {
  console.error('❌  .env.local not found. Copy .env.example to .env.local and fill in your values.')
  process.exit(1)
}

const lines = fs.readFileSync(envPath, 'utf8').split('\n')
const env = {}
for (const line of lines) {
  const match = line.match(/^([^#=]+)=(.+)$/)
  if (match) env[match[1].trim()] = match[2].trim()
}

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'ADMIN_PASSWORD',
]

let ok = true
for (const key of required) {
  if (!env[key] || env[key].includes('your-')) {
    console.error(`❌  ${key} is not set or still has placeholder value`)
    ok = false
  } else {
    console.log(`✅  ${key} is set`)
  }
}

// Check steg image
const stegPath = path.join(__dirname, '..', 'public', 'challenge-pages', 'steg-image.png')
if (fs.existsSync(stegPath)) {
  console.log('✅  steg-image.png exists')
} else {
  console.warn('⚠️   steg-image.png is missing — see scripts/create-steg-placeholder.md')
  ok = false
}

if (ok) {
  console.log('\n✅  All checks passed. Run: npm run dev')
} else {
  console.log('\n⚠️  Fix the issues above before deploying.')
}
