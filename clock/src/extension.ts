// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { chromium } from "playwright";

interface TimeResponse {
  currentTime: string;
}
let statusBarItem: vscode.StatusBarItem;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "clock" is now active!');

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = "🕐 Get time";
  statusBarItem.command = "extension.fetchTime";
  statusBarItem.show();

  let disposable = vscode.commands.registerCommand(
    "extension.fetchTime",
    async () => {
      try {
        statusBarItem.text = `Fetching...`;
        const time = await timeScraper();
        statusBarItem.text = `🕐 ${time}`;
      } catch (error) {
        statusBarItem.text = "⚠️ Error fetching time";
        console.log("Error fetching time: ", error);
      }
    }
  );
  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(disposable);
}

async function timeScraper(): Promise<string> {
  const browser = await chromium.launch({
    headless: false,
    executablePath: undefined,
    timeout: 10000,
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://www.timeanddate.com/", {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });
    await page.waitForSelector('a[href="/worldclock/"]');
    await page.click('a[href="/worldclock/"]');
    await page.waitForSelector('a[href="/worldclock/japan/tokyo"]');
    await page.click('a[href="/worldclock/japan/tokyo"]');
    await page.waitForSelector("#ct", { timeout: 5000 });
    const elementText = await page.locator("#ct").textContent();
    if (!elementText) {
      throw new Error("element not found");
    }
    return elementText.trim();
  } catch (error) {
    console.log("Scraping failed: ", error);
    throw error;
  } finally {
    setTimeout(() => {
      browser.close();
    }, 10000);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
