// const reporter = require('k6-html-reporter')

// const options = {
//     jsonFile : 'F:/SQA/k6/demoBlaze/summary.json',
//     output : '../demoBlaze/report'
// }

// reporter.generateSummaryReport(options)







//Report generation with html and a pdf (you can customize the pdf appearance and log on your basis)
//1. import what needed for the report and pdf generation (path, reporter, puppeteer, fs for file system operations)
// const fs = require('fs');
// const path = require('path');
// const reporter = require('k6-html-reporter');
// const puppeteer = require('puppeteer');

// const reportDir = path.resolve(__dirname, 'report');
// const pdfPath = path.join(reportDir, 'k6-report.pdf');

// // 2.Utility: wait for any HTML file to appear
// function waitForHtmlFile(dir, timeout = 8000) {
//   return new Promise((resolve, reject) => {
//     const start = Date.now();
//     const interval = setInterval(() => {
//       const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
//       if (files.length > 0) {
//         clearInterval(interval);
//         resolve(files[0]); // first HTML file found
//       } else if (Date.now() - start > timeout) {
//         clearInterval(interval);
//         reject(new Error('No HTML report file was created'));
//       }
//     }, 300);
//   });
// }

// (async () => {

//   //3.Generate HTML report
//   reporter.generateSummaryReport({
//     jsonFile: 'F:/SQA/k6/demoBlaze/summary.json',
//     output: reportDir,
//   });

//   console.log('HTML report generation triggered');

//   //4.Wait for HTML file 
//   const htmlFileName = await waitForHtmlFile(reportDir);
//   const htmlPath = path.join(reportDir, htmlFileName);

//   console.log(`HTML file detected: ${htmlFileName}`);

//   //5.Rename to index.html (Live Server friendly) 
//   const indexPath = path.join(reportDir, 'index.html');
//   if (htmlFileName !== 'index.html') {
//     fs.renameSync(htmlPath, indexPath);
//     console.log('HTML renamed to index.html');
//   }

//   //6.Generate PDF from HTML using Puppeteer
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   //7.path replacement: Puppeteer (Chromium) requires URLs, not Windows paths.
//   await page.goto(`file:///${indexPath.replace(/\\/g, '/')}`, {
//     waitUntil: 'networkidle0',
//   });

//   await page.pdf({
//     path: pdfPath,
//     format: 'A4',
//     printBackground: true,
//   });

//   await browser.close();
//   console.log('PDF generated');

//   //8.auto-download script (injection into HTML)
//   let html = fs.readFileSync(indexPath, 'utf8');

//   if (!html.includes('k6-report.pdf')) {
//     html = html.replace(
//       '</body>',
//       `
// <script>
//   window.addEventListener('load', () => {
//     setTimeout(() => {
//       const a = document.createElement('a');
//       a.href = 'k6-report.pdf';
//       a.download = 'k6-performance-report.pdf';
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     }, 1500);
//   });
// </script>
// </body>`
//     );

//     fs.writeFileSync(indexPath, html);
//     console.log('Auto-download script injected');
//   }

// })();







//Report generation with html and a pdf (using the same html file, no index.html creation)-> complete version, better approach
//1. import required modules (fs for file system, path for paths, reporter for k6 html, puppeteer for pdf)
const fs = require('fs');
const path = require('path');
const reporter = require('k6-html-reporter');
const puppeteer = require('puppeteer');

//2.define paths (report folder, summary json, pdf output)
const reportDir = path.resolve(__dirname, 'report');
const summaryJson = 'F:/SQA/k6/demoBlaze/summary.json';
const pdfPath = path.join(reportDir, 'k6-report.pdf');

//3.ensure report directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

//4.utility: wait until html report file is generated
function waitForHtmlFile(dir, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

      if (files.length > 0) {
        clearInterval(interval);
        resolve(files[0]); //first html file found
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(new Error('html report was not created'));
      }
    }, 300);
  });
}

(async () => {
  try {

    //5.generate html report from k6 summary.json
    reporter.generateSummaryReport({
      jsonFile: summaryJson,
      output: reportDir,
    });

    console.log('html report generation triggered');

    //6.wait for the html report file
    const htmlFileName = await waitForHtmlFile(reportDir);
    const htmlPath = path.join(reportDir, htmlFileName);

    console.log(`html file detected: ${htmlFileName}`);

    //7.generate pdf from the same html file using puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //8.convert windows path to file url for chromium
    await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
      waitUntil: 'networkidle0',
    });

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    console.log('pdf generated successfully');

    //9.inject auto pdf download script into the same html file
    let html = fs.readFileSync(htmlPath, 'utf8');

    if (!html.includes('k6-report.pdf')) {
      html = html.replace(
        '</body>',
        `
<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = 'k6-report.pdf';
      a.download = 'k6-performance-report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 1500);
  });
</script>
</body>`
      );

      fs.writeFileSync(htmlPath, html);
      console.log('auto download script injected');
    }

    //10.final log
    console.log('report generation completed successfully');

  } catch (error) {
    console.error('error while generating report:', error.message);
  }
})();
