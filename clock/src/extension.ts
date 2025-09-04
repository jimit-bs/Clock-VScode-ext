// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import axios from "axios";

interface TimeResponse {
  currentTime: string;
}
let statusBarItem: vscode.StatusBarItem;
let timerID: NodeJS.Timeout;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "clock" is now active!');

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = "🕐 Fetching time...";
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);

  callTimer();
  timerID = setInterval(callTimer, 1000);
}

async function callTimer() {
  try {
    const response = await axios.get<TimeResponse>(
      "http://localhost:3002/time"
    );
    console.log(response.data);
    statusBarItem.text = `🕐 ${response.data.currentTime}`;
  } catch (error) {
    console.log(error);
    statusBarItem.text = "⚠️ Server Error";
  }
}

// This method is called when your extension is deactivated
export function deactivate() {
  clearInterval(timerID);
}
