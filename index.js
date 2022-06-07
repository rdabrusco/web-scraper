// const puppeteer = require('puppeteer');

const jsdom = require('jsdom')
const { JSDOM } = jsdom
// async () => {
//     const browser = await puppeteer.launch({
//         headless: false,
//     })
//     const page = await browser.newPage()
//     await page.setRequestInterception(true)
//     page.on('request',(req) =>{
//         if(req.resourceType() == 'font' || req.resourceType() == 'image'){
//             req.abort()
//         }
//         else{
//             req.continue()
//         }
//     })

//     const res = await page.goto('http://example.com')
//     const text = await res.text()
//     const dom = await new JSDOM(text)
//     console.log(dom.window.document.querySelector('h1')).textContent
//     // await browser.close()
// }

const puppeteer = require('puppeteer');

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
    try{
      const site = await page.$eval('[aria-label^="Website:"] > div div + div > div', (el) => el.innerHTML)
      console.log(site)      
      
    }
    catch{
      
      console.log('add a website')
      companyName = await page.$eval('.fontHeadlineLarge > span', (el) => el.innerHTML)
      await checkPhone()
      // try{
      //   checkPhone()
      // }
      // catch{
      //   console.log('no number listed')
      // }
      //   const phone = await page.$eval('[aria-label^="Phone:"] > div div + div > div', (el) => el.innerHTML)
      //   console.log(phone)
      //   companies.push({
      //     compName: companyName,
      //     phone: phone
      //   })
      //   console.log(companies)
      // }
      // catch{
      //   console.log('no number listed')
      // }
    }
  }

  async function checkPhone(){
    try{
      const phone = await page.$eval('[aria-label^="Phone:"] > div div + div > div', (el) => el.innerHTML)
      console.log(phone)
      companies.push({
        companyName: companyName,
        phone: phone
      })
      console.log(companies)
    }
    catch{
      console.log('no number listed')
      companies.push({
        companyName: companyName,
        phone: `No number listed`
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
    const text = await res.text()
    const dom = await new JSDOM(text)
    for(let i = 3; i < 43; i += 2){
      await page.click(`#pane + div > div > div > div> div:nth-child(2) > div > div > div > div > div > div > div:nth-child(${i}) > div > a`)
      await checkSite()
      // await page.click("#pan + div  > div > div > div > div > div > div > div > div > div > div > div > div:nth-child(3) > span > button")
    }
    
    
  }

  // await checkSites([`https://www.google.com/maps/place/Talia's+Tuscan+Table/@26.3728166,-80.1523849,13z/data=!4m9!1m2!2m1!1srestaurants!3m5!1s0x88d8e1c3fe6ad2bb:0x9ce3aa4bad89137e!8m2!3d26.386941!4d-80.080988!15sCgtyZXN0YXVyYW50c1oNIgtyZXN0YXVyYW50c5IBEml0YWxpYW5fcmVzdGF1cmFudA`])
  await clickResult('https://www.google.com/maps/search/Restaurants/@26.3728081,-80.1523849,13z/data=!3m1!4b1')
  await browser.close();
  const stop = Date.now()
  console.log(`Time taken to execute: ${(stop - start)/1000} seconds`)
  
  

}



  // const res = await page.goto('https://goo.gl/maps/5Fj5ijc1MtWRQ5Ks8');
  // // await page.waitForSelector("#omnibox-singlebox > div > div > button > img")
  // const text = await res.text()
  // const dom = await new JSDOM(text)
  // // THIS GRABS THE SITE BAYBEEEE 
  // try{
  //    const site = await page.$eval('[aria-label^="Website:"] > div div + div > div', (el) => el.innerHTML)
  //    console.log(site)
  // }
  // catch{
  //   console.log('add a website')
  // }
  // if(!(await page.$eval('[aria-label^="Website:"] > div div + div > div', (el) => el.innerHTML))){
  //   console.log('add a website')
  // }

  // )
  
)();
