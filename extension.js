// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const timeScraper = require("./timeScraper.js");

let statusBarItem;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
  console.log('Congratulations, your extension "clock" is now active!');

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = "🕐 Get time12";
  statusBarItem.command = "tokyo";
  statusBarItem.show();

  let disposable = vscode.commands.registerCommand("tokyo", async () => {
    try {
      statusBarItem.text = `Fetching...`;
      const time = await timeScraper();
      statusBarItem.text = `🕐 ${time}`;
    } catch (error) {
      statusBarItem.text = "⚠️ Error fetching time";
      console.log("Error fetching time: ", error);
    }
  });
  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
