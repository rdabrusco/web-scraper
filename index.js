

const jsdom = require('jsdom')
const { JSDOM } = jsdom


const puppeteer = require('puppeteer');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');

(async () => {
  let companies = []
  const start = Date.now()

    const browser = await puppeteer.launch({ headless: false }); 
  const page = await browser.newPage();
  await page.setRequestInterception(true)
  page.on('request',(req) =>{
      if(req.resourceType() == 'font' || req.resourceType() == 'image'){
          req.abort()
        }
        else{
          req.continue()
        }
      })

  // function to see if it has a website, if so, then says website, if not, logs 'add a website'

  async function checkSite(url){
    // const res = await page.goto(url);
    // const text = await res.text()
    // const dom = await new JSDOM(text)

    await page.waitForSelector('.fontHeadlineLarge > span')
    
    // THIS GRABS THE SITE BAYBEEEE 

    // currently always running catch for some reason.
    try{
      const site = await page.$eval('[aria-label^="Website:"] > div div + div > div', (el) => el.innerHTML)
      console.log(site)      
      if(site === 'business.site'){
        companyName = await page.$eval('.fontHeadlineLarge > span', (el) => el.innerHTML)
        site = site
        await checkPhone()
      }
      
    }
    catch{
      
      console.log('add a website')
      companyName = await page.$eval('.fontHeadlineLarge > span', (el) => el.innerHTML)
      await checkPhone()
    }
  }

  async function checkPhone(){
    try{
      const phone = await page.$eval('[aria-label^="Phone:"] > div div + div > div', (el) => el.innerHTML)
      console.log(phone)
      companies.push({
        companyName: companyName,
        phone: phone,
        site: site || "no website listed"
      })
      console.log(companies)
    }
    catch{
      const phone = await page.$eval('[aria-label^="Phone:"] > div div + div > div', (el) => el.innerHTML)
      console.log('no number listed')
      companies.push({
        companyName: companyName,
        phone: phone || 'no number listed'
      })
      console.log(companies)
    }
  }

  async function checkSites(urls){
    for(let i = 0; i < urls.length; i++){
      await checkSite(urls[i])
    }
  }

  async function clickResult(url){
    const res = await page.goto(url);
    const lastPosition = await scrollPageToBottom(page, {
      size: 500,
      delay: 250
    })
    const text = await res.text()
    const dom = await new JSDOM(text)

    const scrollDown = async () => {
      page.$eval(`#pane + div > div > div > div> div:nth-child(2) > div > div > div > div > div > div > div:last-child`, (e) => e.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'end' }))
    }

    // try this out tomorrow
  //   async function autoScroll(){
  //     await page.evaluate(async () => {
  //         await new Promise((resolve, reject) => {
  //             var totalHeight = 0;
  //             var distance = 300;
  //             var timer = setInterval(() => {
  //                 const element = page.$('[role="main"]').scrollHeight
  //                 console.log(element)
  //                 var scrollHeight = element.scrollHeight
  //                 element.scrollBy(0, distance);
  //                 totalHeight += distance;
  
  //                 if(totalHeight >= scrollHeight - window.innerHeight){
  //                     clearInterval(timer);
  //                     resolve();
  //                 }
  //             }, 100);
  //         });
  //     });
  // }

  function extractItems() {
    const extractedElements = document.querySelectorAll('.MyEned span.wiI7pd');
    const items = [];
    for (let element of extractedElements) {
      items.push(element.innerText);
    }
    return items;
  }
  
  
  async function scrapeItems(
    page,
    extractItems,
    itemCount,
    scrollDelay = 2000,
  ) {
    let items = [];
    try {
      let previousHeight;
      while (items.length < itemCount) {
        items = await page.evaluate(extractItems);
        previousHeight = page.evaluate('document.querySelector("div.m6QErb.DxyBCb").scrollHeight');
        await page.evaluate(`document.querySelector("div.m6QErb.DxyBCb").scrollTo(0, ${previousHeight[0]})`);
        await page.waitForFunction(`document.querySelector("div.m6QErb.DxyBCb").scrollHeight > ${previousHeight[0]}`);
        await page.waitForTimeout(scrollDelay);
      }
    } catch(e) { }
    return items;
  }
  // await autoScroll()

    for(var i = 3; i < 41; i += 2){
      console.log(i)
      try{
        await page.waitForSelector(`#pane + div > div > div > div> div:nth-child(2) > div > div > div > div > div > div > div:nth-child(${i}) > div > a`)
      }
      catch{
      await scrollDown()
      // await lastPosition()
      await scrollDown()
      await scrollDown()

     


      await page.waitForSelector(`#pane + div > div > div > div> div:nth-child(2) > div > div > div > div > div > div > div:nth-child(${i}) > div > a`)
      // await scrollDown()
      // await page.waitForSelector(`#pane + div > div > div > div> div:nth-child(2) > div > div > div > div > div > div > div:nth-child(${i}) > div > a`)
      // await scrollDown()

      }
      await scrollDown()
      
      await page.click(`#pane + div > div > div > div> div:nth-child(2) > div > div > div > div > div > div > div:nth-child(${i}) > div > a`)
      await checkSite()
      await page.click(`[aria-label^="Back"]`)
      
      // await scrollDown()
      // await scrollDown()
      

      
    }
    
    
  }


  

  // await checkSites([`https://www.google.com/maps/place/Talia's+Tuscan+Table/@26.3728166,-80.1523849,13z/data=!4m9!1m2!2m1!1srestaurants!3m5!1s0x88d8e1c3fe6ad2bb:0x9ce3aa4bad89137e!8m2!3d26.386941!4d-80.080988!15sCgtyZXN0YXVyYW50c1oNIgtyZXN0YXVyYW50c5IBEml0YWxpYW5fcmVzdGF1cmFudA`])
  
  await clickResult('https://www.google.com/maps/search/Restaurants/@26.3728081,-80.1523849,13z/data=!3m1!4b1')
  await browser.close();
  const stop = Date.now()
  console.log(`Time taken to execute: ${(stop - start)/1000} seconds`)
  
  

}

  
)();
