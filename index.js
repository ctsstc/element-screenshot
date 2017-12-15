const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

async function screenshotElement(site, selector) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(site);

  const elNav = await page.$(selector);
  if (elNav) {
    let domainSansProtocol = site.substring(site.indexOf('://') + 3);
    let directory = `./screenshots/${domainSansProtocol}`;
    await fs.ensureDir(directory)

    let prefix = `${selector} - `;
    let largestCounter = nextFileCounter(directory, prefix)

    let filePath = path.normalize(`${directory}/${selector} - ${largestCounter}.png`);

    await elNav.screenshot({
      path: filePath
    });
  } else {
    console.warn(`Element Not Found with ${selector}`);
  }

  await browser.close();
}

function nextFileCounter(directory, prefix) {
  let files = fs.readdirSync(directory);
  files = files.filter(file => file.startsWith(prefix));
  let largestCounter = files.reduce((prev, cur) => {
    // Get the file counter
    cur = cur.substring(prefix.length - 1, cur.length - 4);
    return cur > prev ? cur : prev;
  }, 0);
  console.log(largestCounter, files);
  return ++largestCounter;
}

(async() => {
  await screenshotElement('https://codyswartz.us/', '#nav ul');
})();