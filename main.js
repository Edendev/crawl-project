const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')

async function main(){
 if (process.argv.length < 3)
 {
    console.log('too few arguments')
    return;
 }
 if (process.argv.length > 3)
 {
    console.log('too many arguments')
    return;
 }

 const baseURL = process.argv[2]
 const resp = await crawlPage(baseURL, baseURL, {})
 printReport(resp)
}

main()