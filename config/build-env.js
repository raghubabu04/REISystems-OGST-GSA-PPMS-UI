let path = require("path");
const readFile = require("fs").readFile;
const writeFile = require("fs").writeFile;
let endOfLine = require("os").EOL;

function run() {
  const args = process.argv.slice(2);
  console.log("Environment: ", args);
  let outputFolder = ".";
  if (args.length > 0) {
    outputFolder = args[1];
  }
  console.log("Output Folder: ", outputFolder);
  let targetPath = path.join(__dirname, outputFolder, "environment.js");
  console.log("Target Path: ", targetPath);
  let envFile = path.join(__dirname, "../.env-local");
  if (args.length > 0 && args[0] === "--rei") {
    envFile = path.join(__dirname, "../.env");
  } else if (args.length > 0 && args[0] === "--rei-qa") {
    envFile = path.join(__dirname, "../.env-rei-qa");
  } else if (args.length > 0 && args[0] === "--gsa-dev") {
    envFile = path.join(__dirname, "../.env-gsa-dev");
  } else if (args.length > 0 && args[0] === "--gsa-test") {
    envFile = path.join(__dirname, "../.env-gsa-test");
  } else if (args.length > 0 && args[0] === "--gsa-uat") {
    envFile = path.join(__dirname, "../.env-gsa-uat");
  }

  readFile(envFile, "utf8", (err, data) => {
    if (err) throw err;
    let content = "// @ts-ignore \nwindow._env_ = {";
    for (const line of data.split(endOfLine)) {
      const arr = line.split("=");
      if (arr[0] !== "") {
        arr[1] = process.env[arr[0]] ? process.env[arr[0]] : arr[1];
        content += "\r\n  " + arr[0] + ': "' + arr[1] + '",';
      }
    }
    content += "\n}";
    console.log("Environment Variables: ", content);

    writeFile(targetPath, content, function (err) {
      if (err) {
        console.error("Error: ", err);
        return;
      }
      console.log(`environment.ts generated at ${targetPath}`);
    });
  });
}

run();
