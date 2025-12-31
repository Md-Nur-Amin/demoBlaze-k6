const reporter = require('k6-html-reporter')

const options = {
    jsonFile : 'F:/SQA/k6/demoBlaze/summary.json',
    output : '../demoBlaze/report'
}

reporter.generateSummaryReport(options)