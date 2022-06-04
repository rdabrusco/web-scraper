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
    const res = await page.goto(url);
    const text = await res.text()
    const dom = await new JSDOM(text)
    // THIS GRABS THE SITE BAYBEEEE 
    try{
      const site = await page.$eval('[aria-label^="Website:"] > div div + div > div', (el) => el.innerHTML)
      console.log(site)
      
    }
    catch{
      console.log('add a website')
      const companyName = await page.$eval('.fontHeadlineLarge > span', (el) => el.innerHTML)
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
        compName: companyName,
        phone: phone
      })
      console.log(companies)
    }
    catch{
      console.log('no number listed')
    }
  }

  await checkSite('https://goo.gl/maps/xbJzXuMEbcuDRwZJ6')
  await browser.close();
  

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
