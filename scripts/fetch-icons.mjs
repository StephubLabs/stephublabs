import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'assets', 'icons')
const cdn = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const iconGroups = {
  frontend: [
    ['html5', 'HTML5'],
    ['css3', 'CSS3'],
    ['javascript', 'JavaScript'],
    ['typescript', 'TypeScript'],
    ['react', 'React'],
    ['nextjs', 'Next.js'],
    ['tailwindcss', 'Tailwind CSS'],
    ['vite', 'Vite'],
  ],
  data: [
    ['python', 'Python'],
    ['nodejs', 'Node.js'],
    ['mysql', 'MySQL'],
    ['postgresql', 'PostgreSQL'],
    ['mongodb', 'MongoDB'],
    ['huggingface', 'Hugging Face'],
    ['git', 'Git'],
    ['github', 'GitHub'],
  ],
  growth: [
    ['google', 'Google Analytics & Ads'],
    ['facebook', 'Meta Ads'],
    ['wordpress', 'WordPress'],
    ['woocommerce', 'WooCommerce'],
  ],
  design: [
    ['figma', 'Figma'],
    ['canva', 'Canva'],
    ['notion', 'Notion'],
    ['slack', 'Slack'],
    ['jira', 'Jira'],
    ['trello', 'Trello'],
  ],
}

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const tile = (dataUri, label) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="${escapeXml(label)}">
  <title>${escapeXml(label)}</title>
  <rect x="2" y="2" width="60" height="60" rx="14" fill="#ffffff"/>
  <rect x="2.75" y="2.75" width="58.5" height="58.5" rx="13.25" fill="none" stroke="#dbe3ef" stroke-width="1.5"/>
  <image x="14" y="14" width="36" height="36" preserveAspectRatio="xMidYMid meet" href="data:image/svg+xml;base64,${dataUri}" xlink:href="data:image/svg+xml;base64,${dataUri}"/>
</svg>`

await mkdir(outDir, { recursive: true })

let count = 0
for (const [group, icons] of Object.entries(iconGroups)) {
  for (const [slug, label] of icons) {
    const response = await fetch(`${cdn}/${slug}/${slug}-original.svg`)
    if (!response.ok) {
      throw new Error(`Could not fetch ${slug}: ${response.status}`)
    }
    const source = await response.text()
    const dataUri = Buffer.from(source, 'utf8').toString('base64')
    const file = `${slug}.svg`
    await writeFile(path.join(outDir, file), tile(dataUri, label), 'utf8')
    console.log(`icon   ${group}/${file} (${label})`)
    count += 1
  }
}

console.log(`\n${count} Devicon tiles written to assets/icons/`)