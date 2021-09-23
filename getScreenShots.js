const puppeteer = require('puppeteer');
//const mkdirp = require('mkdirp');
const fs = require('fs');
const { urls } = require('./sites.js');

// Put your custom dimension and name here
const devices = [
     { name: '1920x1080', width: 1920, height: 1080 },
    { name: '1366x768', width: 1366, height: 768 },
    { name: '1360x768', width: 1360, height: 768 },
    { name: '1280x800', width: 1280, height: 800 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '360x640', width: 360, height: 640 },
    { name: '375x667', width: 375, height: 667 },
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

// Mapping Array
const name = Array.from(new Set(devices.map(item => item.name)));
const link = Array.from(new Set(urls.map(item => item.link)));

async function getUrlAndResolutions(devices, urls) {
    var cont = 0;
    for (let device of devices) {
        for (let url of urls) {
            await setViewports(device, url);
            console.info('Resolução:', name[cont] + ', Página: ' + link);
            cont = cont + 1;
        }
    }
}
getUrlAndResolutions(devices, urls);
