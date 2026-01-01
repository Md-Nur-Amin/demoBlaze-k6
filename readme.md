# 📊 k6 Performance Test Report (HTML + Auto PDF Download)

This project demonstrates how to run a **k6 performance test**, generate an **HTML report**, automatically convert it into a **PDF**, and ensure that when the HTML report is opened with **Live Server**, the **PDF version downloads automatically**.

This setup is ideal for **SQA labs,  performance testing workflows**.

---

##  Technologies Used

- **k6** – Load & performance testing  
- **k6-html-reporter** – HTML report generation  
- **Puppeteer** – Convert HTML report to PDF  
- **Node.js** – Automation & scripting  
- **VS Code Live Server** – View report in browser  

---

## 📁 Project Structure

```text
demoBlaze/
│
├── demoblaze.js          # k6 test script
├── generate-report.js   # HTML + PDF report generator
├── summary.json         # k6 test summary output
├── report/
│   ├── *.html            # Generated HTML report
│   └── k6-report.pdf    # Auto-generated PDF report
│
└── README.md

```

### Prerequisites
##### Node.js (LTS recommended)

#### Check installation:
```
node -v
npm -v
```

### k6 Installation:

#### Windows (Chocolatey):
```
choco install k6
```

Or download from:
https://k6.io/docs/get-started/installation/

#### Verify:
```
k6 version
```


### 📦 Install Project Dependencies

Run once inside the project directory:
```
npm init -y
npm install k6-html-reporter puppeteer
```
---

#### Step 1: Run the k6 Performance Test

File: demoblaze.js

This script:

Sends HTTP requests to https://www.demoblaze.com/

Runs with 10 virtual users

Saves test summary to summary.json

#### Run:
```
k6 run demoblaze.js
```

#### Output: summary.json

-----

#### Step 2: Generate HTML & PDF Report

File: generate-report.js

This script automatically:

Reads summary.json

Generates an HTML report

Converts the same HTML into a PDF

Injects auto-download logic into the HTML


#### Run:
```
node generate-report.js
```

#### Output:
```
report/
 ├── report.html (or similar)
 └── k6-report.pdf
```
---

#### Step 3: Open Report with Live Server

- Open VS Code

- Go to the report folder

- Right-click the report.html file

- Click “Open with Live Server”



#### Final Result


- HTML report opens in browser
- PDF version downloads automatically
- No manual interaction required

##### First time only:
Browser may ask “Allow multiple downloads?”  Click Allow

##### How Auto PDF Download Works

- The script injects a small JavaScript snippet into the HTML file:

- Runs after page load

- Creates a temporary download link

- Triggers automatic PDF download

- Works perfectly with Live Server (no backend required).



##### Windows Path Handling (Important)

Puppeteer requires file URLs, not Windows-style paths.


##### Handled in code using:

htmlPath.replace(/\\/g, '/')

