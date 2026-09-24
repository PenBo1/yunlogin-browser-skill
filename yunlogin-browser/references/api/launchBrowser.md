# launchBrowser

Source: https://d126447d359e70c0.yunlogin.com/js/launchBrowser-1788343711349-1ff793de-104.js

### Basic Information (GET)

> GET /api/v2/browser/start

Description: Launches the browser associated with an environment. An environment ID is required. After the browser starts, the response provides debug endpoints for `Selenium` and `Puppeteer` automation. `Selenium` requires a `Webdriver` that matches the browser kernel version. The response includes the path to the matching `Webdriver`.

### Request Parameters (GET)

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :-- | :-- | :-- | :-- | :-- |
| account_id | Environment ID; the unique ID generated after the environment is imported successfully | string | Yes | | |
| headless | Whether to use a headless browser | number | No | Omitted: No. 1: Yes. | Omitted |

### Request Example (GET)

```bash
http://localhost:50213/api/v2/browser/start?account_id=d03ca5de08ec8e02c4b78558ee******
```

### Basic Information (POST)

> POST /api/v2/browser/start

Description: Launches the browser associated with an environment. An environment ID is required. After the browser starts, the response provides debug endpoints for `Selenium` and `Puppeteer` automation. `Selenium` requires a `Webdriver` that matches the browser kernel version. The response includes the path to the matching `Webdriver`.

### Request Parameters (POST)

| Parameter | Description | Type | Required | Allowed Values | Default |
| :--- | :-- | :-- | :-- | :-- | :-- |
| account_id | Environment ID; the unique ID generated after the environment is imported successfully | string | Yes | | |
| append_cmd | Additional command-line arguments | string | No | | Omitted |
| headless | Whether to use a headless browser | string | No | Omitted: No. 1: Yes. | Omitted |

### Request Example (POST)

```bash
http://localhost:50213/api/v2/browser/start
```

```json
{
    "account_id": "d03ca5de08ec8e02c4b78558ee******",
    "append_cmd": "--load-extension=D:\\test\\browser-api\\plugins\\Env,D:\\test\\browser-api\\plugins\\Env2",
    "headless": "0"
}
```

### append_cmd Guidance

`append_cmd` is a single string of additional Chrome command-line arguments for the POST form.

Common safe examples:

| Flag | Purpose |
| --- | --- |
| `--disable-popup-blocking` | Allow automation-driven popups. |
| `--disable-notifications` | Disable notification prompts. |
| `--start-maximized` | Start maximized. |
| `--window-size=1920,1080` | Set the initial window size. |
| `--load-extension=path1,path2` | Load local unpacked extensions. |

Do not use `--user-data-dir`, `--profile-directory`, `--remote-debugging-port`, or `--remote-debugging-address`; the environment manages those values. Proxy, sandbox, certificate, and web-security flags require explicit risk review.

Read [CDP Automation](../workflows/cdp-automation.md) for the complete safe/risky flag list, CDP connection commands, external CDP URL support, and session lifecycle notes.

### Response Data

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| code | Status code | int | 0: Success -1: Invalid input format -2: Failed to retrieve the requested quantity -4: Account login error -6: Identity verification is incomplete | |
| msg | Success or failure message | string | | |
| data | Response data | object | | |

`data` object:

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| debuggingPort | Debugging port | string | | |
| webdriver | Browser program location | string | | |
| ws | WebSocket information | object | | |

`ws` object:

| Parameter | Description | Type | Allowed Values | Default |
| :--- | :-- | :--- | :----- | :---- |
| selenium | Browser debug endpoint that can be used for Selenium automation | string | | |
| puppeteer | Browser debug endpoint that can be used for Puppeteer automation | string | | |

Success

```json
{
    "code":0,
    "data":{
        "ws":{
            "selenium":"127.0.0.1:xxxx",
            "puppeteer":"ws://127.0.0.1:xxxx/devtools/browser/xxxxxx"
        },
        "debuggingPort":"xxxx",
        "webdriver":"C:\\xxxx\\chromedriver.exe"
    },
    "msg":"success"
}
```

Failure

```json
{
    "code":-1,
    "data":{},
    "msg":"failed"
}
```

### Example Code

#### Playwright
```ts
import { chromium } from "playwright-core";

// Response from the API launch request
const session = {
  code: 0,
  msg: "success",
  data: {
    ws: {
      selenium: "127.0.0.1:53772",
      puppeteer:
        "ws://127.0.0.1:53772/devtools/browser/ef9bf252-57ba-48a3-87e5-bdabf04583ca",
    },
    debuggingPort: "53772",
    webdriver: "D:\\FbBrowser\\3.0.1.0\\chromedriver.exe",
  },
};

async function run() {
  // Connect to the existing browser instance with connectOverCDP.
  const browser = await chromium.connectOverCDP(session.data.ws.puppeteer);

  // Create a new browser context.
  const context = browser.contexts()[0];

  // Open a new tab.
  const page = await context.newPage();

  try {
    /**
     * 1. Open the Google website.
     * 2. Wait for the page to load.
     * 3. Enter "fingerprint browser" in the search box and press Enter.
     * 4. Wait for the search results to load.
     * 5. Print the search result title.
     */
    await page.goto("https://www.google.com");
    await page.waitForTimeout(2000);

    const searchBox = page.locator('textarea[name="q"]');

    await searchBox.fill("fingerprint browser");
    await searchBox.press("Enter");
    await page.waitForTimeout(2000);

    console.log("search complete", await page.title());
  } finally {
    // Disconnect from the browser.
    await browser.close();
  }
}

run().catch(console.error);

```

#### Puppeteer

```ts
import puppeteer from "puppeteer-core";

// Response from the API launch request
const session = {
  code: 0,
  msg: "success",
  data: {
    ws: {
      selenium: "127.0.0.1:52600",
      puppeteer:
        "ws://127.0.0.1:52600/devtools/browser/3760b39f-d173-4d23-aee6-51d6f2fa1a3d",
    },
    debuggingPort: "52600",
    webdriver: "D:\\FbBrowser\\3.0.1.0\\chromedriver.exe",
  },
};

async function run() {
  // Connect to the existing browser instance with Puppeteer.
  const browser = await puppeteer.connect({
    browserWSEndpoint: session.data.ws.puppeteer,
    defaultViewport: null,
  });

  // Open a new tab.
  const page = await browser.newPage();

  try {
    /**
     * 1. Open the Google website.
     * 2. Wait for the page to load.
     * 3. Enter "fingerprint browser" in the search box and press Enter.
     * 4. Wait for the search results to load.
     * 5. Print the search result title.
     */
    await page.goto("https://www.google.com");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const searchBox = await page.$('textarea[name="q"]');
    if (searchBox) {
      await searchBox.type("fingerprint browser");
      await searchBox.press("Enter");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("search complete", await page.title());
  } finally {
    // Disconnect from the browser.
    await browser.disconnect();
  }
}

run().catch(console.error);

```

#### Selenium

```ts
import { Builder, By, Key } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

// Response from the API launch request
const session = {
  code: 0,
  msg: "success",
  data: {
    ws: {
      selenium: "127.0.0.1:53772",
      puppeteer:
        "ws://127.0.0.1:53772/devtools/browser/ef9bf252-57ba-48a3-87e5-bdabf04583ca",
    },
    debuggingPort: "53772",
    webdriver: "D:\\FbBrowser\\3.0.1.0\\chromedriver.exe",
  },
};

async function run() {
  // Create a Chrome service instance.
  const service = new chrome.ServiceBuilder(session.data.webdriver);
  // Configure browser startup arguments and enable the remote debugging port.
  const options = new chrome.Options();

  /**
   * 1. Disable the build check.
   * 2. Set the Chrome binary path.
   * 3. Add the remote debugging port argument.
   * 4. Set the debugger address.
   */
  service.addArguments("--disable-build-check");
  options.setChromeBinaryPath(session.data.webdriver);
  options.addArguments(`--remote-debugging-port=${session.data.debuggingPort}`);
  options.debuggerAddress(session.data.ws.selenium);

  // Create a new WebDriver instance.
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(service)
    .build();

  try {
    /**
     * 1. Open a new tab and switch to it.
     * 2. Wait 2 seconds to ensure the new tab is open.
     * 3. Open the Google website.
     * 4. Wait for the page to load.
     * 5. Enter "fingerprint" in the search box and press Enter.
     * 6. Wait for the search results to load.
     * 7. Print the search result title.
     */
    await driver.executeScript("window.open('', '_blank');");

    const tabs = await driver.getAllWindowHandles();
    await driver.switchTo().window(tabs[tabs.length - 1]);
    await driver.sleep(2000);

    await driver.get("https://www.google.com");
    await driver.sleep(2000);

    let searchBox = await driver.findElement(By.name("q"));
    await searchBox.sendKeys("fingerprint browser", Key.RETURN);
    await driver.sleep(2000);

    console.log("search complete", await driver.getTitle());
  } finally {
    // Close the browser.
    await driver.quit();
  }
}

run().catch(console.error);

```