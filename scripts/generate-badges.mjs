import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { makeBadge } from 'badge-maker'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'badges')

const LABEL = '#0B1220'
const SLATE = '#334155'

const icons = {
  pulse: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12h4l2.5-7 3.5 14 2.5-7H22"/>
    </svg>`,
  trend: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 17l6-6 4 4 8-8"/>
      <path d="M15 7h6v6"/>
    </svg>`,
  pin: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>`,
  clock: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 2"/>
    </svg>`,
  mail: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="M3 7l9 6 9-6"/>
    </svg>`,
  code: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 6l-6 6 6 6"/>
      <path d="M16 6l6 6-6 6"/>
    </svg>`,
  wave: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 12h2"/>
      <path d="M7 8v8"/>
      <path d="M11 5v14"/>
      <path d="M15 9v6"/>
      <path d="M19 7v10"/>
      <path d="M23 12h-1"/>
    </svg>`,
  globe: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M3 12h18"/>
      <path d="M12 3c3 3.5 3 14.5 0 18"/>
      <path d="M12 3c-3 3.5-3 14.5 0 18"/>
    </svg>`,
}

const toDataUri = (svg) =>
  `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`

const toLogo = (svg, color = '#ffffff') => {
  const recolored = svg
    .replace(/fill="#[0-9a-fA-F]{3,8}"/g, `fill="${color}"`)
    .replace(/<svg\b([^>]*)>/, (match, attrs) =>
      `<svg${attrs.replace(/\s*fill="[^"]*"/g, '')} fill="${color}">`,
    )
  return toDataUri(recolored)
}

const fetchBrandLogo = async (slug) => {
  const response = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`)
  if (!response.ok) throw new Error(`Could not fetch ${slug}: ${response.status}`)
  return toLogo(await response.text())
}

const badges = [
  {
    file: 'status-open-to-work.svg',
    label: 'STATUS',
    message: 'OPEN TO WORK',
    color: '#047857',
    style: 'for-the-badge',
    logoBase64: toDataUri(icons.pulse),
  },
  {
    file: 'role-growth-hacker.svg',
    label: 'ROLE',
    message: 'FREELANCE GROWTH HACKER',
    color: '#0E7490',
    style: 'for-the-badge',
    logoBase64: toDataUri(icons.trend),
  },
  {
    file: 'based-in-nairobi.svg',
    label: 'BASED IN',
    message: 'NAIROBI, KENYA',
    color: '#4338CA',
    style: 'for-the-badge',
    logoBase64: toDataUri(icons.pin),
  },
  {
    file: 'experience-5-plus-years.svg',
    label: 'EXPERIENCE',
    message: '5+ YEARS',
    color: SLATE,
    style: 'for-the-badge',
    logoBase64: toDataUri(icons.clock),
  },
  {
    file: 'email.svg',
    label: 'EMAIL',
    message: 'STEPHUBLABS@GMAIL.COM',
    color: '#0E7490',
    style: 'for-the-badge',
    logoBase64: toDataUri(icons.mail),
  },
  {
    file: 'project-built-with.svg',
    label: 'BUILT WITH',
    message: 'REACT 19 · TYPESCRIPT',
    color: '#1D4ED8',
    style: 'flat-square',
    logoBase64: toDataUri(icons.code),
  },
  {
    file: 'project-audio-engine.svg',
    label: 'AUDIO ENGINE',
    message: 'WEB AUDIO API',
    color: '#6D28D9',
    style: 'flat-square',
    logoBase64: toDataUri(icons.wave),
  },
  {
    file: 'project-deployed-on.svg',
    label: 'DEPLOYED ON',
    message: 'NETLIFY',
    color: '#047857',
    style: 'flat-square',
    logoBase64: toDataUri(icons.globe),
  },
]

const certifications = [
  {
    provider: 'COURSERA',
    slug: 'coursera',
    color: '#0056D2',
    labelColor: '#061B3A',
    courses: ['Digital Marketing', 'Project Management', 'AI for Professionals', 'Data Analytics'],
  },
  {
    provider: 'UDEMY',
    slug: 'udemy',
    color: '#A435F0',
    labelColor: '#25073A',
    courses: ['Excel', 'SQL', 'SEO', 'Web Development'],
  },
]

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

await mkdir(outDir, { recursive: true })

for (const badge of badges) {
  const svg = makeBadge({
    label: badge.label,
    message: badge.message,
    color: badge.color,
    labelColor: LABEL,
    style: badge.style,
    logoBase64: badge.logoBase64,
  })
  await writeFile(path.join(outDir, badge.file), svg, 'utf8')
  console.log(`badge  ${badge.file}`)
}

for (const certification of certifications) {
  let logoBase64
  try {
    logoBase64 = await fetchBrandLogo(certification.slug)
  } catch (error) {
    console.warn(`warn   ${error.message} - using check mark fallback`)
    logoBase64 = toDataUri(icons.pulse)
  }

  for (const course of certification.courses) {
    const file = `cert-${certification.slug}-${slugify(course)}.svg`
    const svg = makeBadge({
      label: certification.provider,
      message: course.toUpperCase(),
      color: certification.color,
      labelColor: certification.labelColor,
      style: 'flat-square',
      logoBase64,
    })
    await writeFile(path.join(outDir, file), svg, 'utf8')
    console.log(`cert   ${file}`)
  }
}

let githubLogo
try {
  githubLogo = await fetchBrandLogo('github')
} catch (error) {
  console.warn(`warn   ${error.message} - using code icon fallback`)
  githubLogo = toDataUri(icons.code)
}

const githubBadge = makeBadge({
  label: 'GITHUB',
  message: '@STEPHUBLABS',
  color: '#30363D',
  labelColor: LABEL,
  style: 'for-the-badge',
  logoBase64: githubLogo,
})
await writeFile(path.join(outDir, 'contact-github.svg'), githubBadge, 'utf8')
console.log('badge  contact-github.svg')