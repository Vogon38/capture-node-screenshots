const puppeteer = require('puppeteer');
//const mkdirp = require('mkdirp');
const fs = require('fs');
const { urls } = require('./sites.js');

// Put your custom dimension and name here
const devices = [
    { name: 'Highest', width: 1920, height: 1080 },
    { name: 'Laptop-1', width: 1366, height: 768 },
    { name: 'Laptop-2', width: 1360, height: 768 },
    { name: 'Small-Desktop-1', width: 1280, height: 800 },
    { name: 'Small-Desktop--2', width: 1024, height: 768 },
    { name: 'Ipad-Tab', width: 768, height: 1024 },
    { name: 'Android', width: 360, height: 640 },
    { name: 'Iphone', width: 375, height: 667 },
];

async function setViewports(device, url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.waitForTimeout(500);
    await page.goto(url.link, 
    {waitUntil: 'networkidle0' });

    // Setting-up login
    await page.type('#copy selector', 'user.name');
    await page.type('#copy selector', 'user.password');

    // Click and wait for navigation
    await Promise.all([
        await page.click('#copy selector'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
      ]);

    await page.goto(url.link, 
        {waitUntil: 'networkidle0' });

    // Setting-up viewports 
    await page.setViewport({
        width : device.width,
        height: device.height
    });
    await getScreenshots(device, url, page, browser);
}

// Directory Create if not exist
async function getScreenshots(device, url, page, browser) {
   var new_location = './Sample/' + device.name+'('+ device.width+'-'+device.height +')';
   fs.mkdir(new_location, function (err) {
        if (err) { //console.log(err) 
        }
   });

    await page.screenshot({
        path: new_location +'/'+ url.name +`_${Date.now()}.png`,
        fullPage: true,        
    });
    browser.close();
}

async function getUrlAndResolutions(devices, urls) {
    for (let device of devices) {
        for (let url of urls) {
            await setViewports(device, url);
            console.log(device, url);
        }
    }
}
getUrlAndResolutions(devices, urls);
