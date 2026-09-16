const { chromium } = require('C:/Users/mrc56/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
 const errors=[]; const checks=[];
 fs.mkdirSync('docs/qa/phrases',{recursive:true});
 for (const [name,width,height] of [['mobile',360,800],['desktop',1440,1000]]) {
  const page=await browser.newPage({viewport:{width,height}});
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5182/');
  await page.locator('.garden-message__text').filter({hasText:/[a-záéíóú]/i}).waitFor();
  const first=await page.locator('.garden-message__text').textContent();
  const count=await page.locator('.garden-message').count();
  await page.reload();
  await page.locator('.garden-message__text').filter({hasText:/[a-záéíóú]/i}).waitFor();
  const second=await page.locator('.garden-message__text').textContent();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await page.screenshot({path:'docs/qa/phrases/'+name+'.png',fullPage:true});
  checks.push({name,count,changedOnReload:first!==second,overflow});
  if(first===second||count!==1||overflow) errors.push(name+' layout/persistence');
  await page.close();
 }
 await browser.close();console.log(JSON.stringify({checks,errors},null,2));if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
