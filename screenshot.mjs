import puppeteer from 'puppeteer';

const sites = [
  { slug: 'vanislandstats', url: 'https://www.vanislandstats.dev/' },
  { slug: 'ninja-crm', url: 'https://100-ninja-crm.vercel.app/' },
  { slug: 'pearly-nails', url: 'http://pearlynailscomox.ca/' },
  { slug: 'flow-studio', url: 'https://www.flowstudiocr.ca/' },
  { slug: 'rush-salon', url: 'https://rushsalonyvr.com/' },
  { slug: 'craig-spikman', url: 'https://craig-spikman-website.vercel.app/' },
  { slug: 'daves-fish-store', url: 'https://daves-fish-store.vercel.app/' },
];

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
});

for (const site of sites) {
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));
    const outPath = `/home/dtran/cc-dannyhaitran/public/images/projects/${site.slug}.png`;
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`OK: ${site.slug}`);
    await page.close();
  } catch (e) {
    console.error(`FAIL: ${site.slug} - ${e.message}`);
  }
}

await browser.close();
