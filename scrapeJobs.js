const { chromium } = require('playwright');

async function scrapeJobs(query) {
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();

  const encodedQuery = encodeURIComponent(query);
  await page.goto(`https://www.upwork.com/nx/search/jobs/?q=${encodedQuery}`);

  await page.screenshot({ path: 'debug.png', fullPage: true });
  await page.waitForSelector('article');

  const jobs = await page.$$eval('article', jobCards => {
    return jobCards.slice(0, 10).map(card => {
      const title = card.querySelector('a.air3-link')?.innerText || '';
      const description = card.querySelector('p.mb-0.text-body-sm')?.innerText || '';
      const link = card.querySelector('a.air3-link')?.href || '';
      const experienceLevel = card.querySelector('li[data-test="experience-level"] strong')?.innerText || '';
      const pay = card.querySelector('li[data-test="job-type-label"] strong')?.innerText || '';
      const duration = card.querySelectorAll('li[data-test="duration-label"]')[0]?.innerText || '';
      const jobType = card.querySelectorAll('small.mr-10')[1]?.innerText || '';
      return { title, description, link, experienceLevel, pay, duration, jobType };
    });
  });

  await browser.close();
  console.log(jobs);
  return jobs;
}

module.exports = scrapeJobs;
