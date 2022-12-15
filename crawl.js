const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages)
{
  // Do not process offsite urls
  const baseURLObj = new URL(baseURL)
  const currentURLObj = new URL(currentURL)
  if (baseURLObj.hostname !== currentURLObj.hostname)
  {
    return pages
  }

  // if we already visited the page then just increase the count
  const normalizedURL = normalizeURL(currentURL)
  if (pages[normalizedURL] > 0)
  {
    pages[normalizedURL]++
    return pages
  }

  // if new page initialize it
  pages[normalizedURL] = 1

  console.log(`crawling of ${currentURL} is starting...`)
  let htmlBody = ''
  try{
    const resp = await fetch(currentURL)
    if (resp.status > 399)
    {
      console.log(`Got HTTP error, status code: ${resp.status}`)
      return pages
    }
    const contentType = resp.headers.get('content-type')
    if (!contentType.includes('text/html'))
    {
      console.log(`Got non-html response: ${contentType}`)
      return pages
    }
    htmlBody =  await resp.text()
  }
  catch(err)
  {
      console.log(err.message)
  }

  const urls = getURLsFromHTML(htmlBody, baseURL)
  for(const url of urls)
  {
    pages = await crawlPage(baseURL, url, pages)
  }

  return pages
}

function normalizeURL(url)
{
  const urlObj = new URL(url)
  let fullPath = `${urlObj.host}${urlObj.pathname}`
  if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
    fullPath = fullPath.slice(0, -1)
  }
  return fullPath
}

function getURLsFromHTML(htmlBody, baseURL){
  const urls = []
  const dom = new JSDOM(htmlBody)
  const aElements = dom.window.document.querySelectorAll('a')
  for (const aElement of aElements){
    if (aElement.href.slice(0,1) === '/'){
      try {
        urls.push(new URL(aElement.href, baseURL).href)
      } catch (err){
        console.log(`${err.message}: ${aElement.href}`)
      }
    } else {
      try {
        urls.push(new URL(aElement.href).href)
      } catch (err){
        console.log(`${err.message}: ${aElement.href}`)
      }
    }
  }
  return urls
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage
}