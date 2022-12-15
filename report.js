const { getURLsFromHTML } = require('./crawl.js')

function printReport(pages)
{
    console.log('printing report...')
    const sortedPages = sortPages(pages)
    for (const page in sortedPages)
    {
        const url = page[0]
        const count = page[1]
        console.log(`Found ${count} internal links to ${url}`)
    }
}

function sortPages(pages)
{
    pagesArr = Object.entries(pages)
    pagesArr.sort((pageA, pageB) => {
        return (pageB[1] - pageA[1])
    })
    return pagesArr
}

module.exports = {
    printReport,
  }