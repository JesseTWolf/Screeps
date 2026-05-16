#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const inputFile = process.argv[2] || "screeps.go";
const outputFile = process.argv[3] || "main.js";
const preludePath = path.join(__dirname, "screeps-prelude.js");
const generatedFile = "main.generated.js";

const generatedPath = path.join(root, generatedFile);
const outputPath = path.join(root, outputFile);

if (!fs.existsSync(preludePath)) {
  console.error(`Missing prelude file: ${preludePath}`);
  process.exit(1);
}

console.log(`Compiling ${inputFile} with GopherJS...`);
const compile = spawnSync("gopherjs", ["build", "-o", generatedFile, inputFile], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32"
});

if (compile.status !== 0) {
  process.exit(compile.status || 1);
}

console.log("Prepending Screeps runtime prelude...");
const prelude = fs.readFileSync(preludePath, "utf8");
const generated = fs.readFileSync(generatedPath, "utf8");
fs.writeFileSync(outputPath, `${prelude}\n${generated}`, "utf8");

if (fs.existsSync(generatedPath)) {
  fs.unlinkSync(generatedPath);
}

console.log(`Build complete: ${outputFile}`);
