/// <reference path="../vendor/DefinitelyTyped/node/node.d.ts" />
"use strict";
import java_cli = require('../src/java_cli');
import JVM = require('../src/jvm');
import path = require('path');
import os = require('os');

function done_cb(success:boolean): void { process.exit(success ? 0 : 1); };

var jvm_state: JVM;

process.on('SIGINT', function () {
  console.error('Doppio caught SIGINT');
  if (jvm_state) {
    jvm_state.dump_state();
  }
  process.exit(0);
});

// Run the JVM. Remove node runner.js from the args.
java_cli.java(process.argv.slice(2), {
  jcl_path: path.resolve(__dirname, '../vendor/classes'),
  java_home_path: path.resolve(__dirname, '../vendor/java_home'),
  jar_file_path: path.resolve(os.tmpDir(), 'doppio_jars'),
  launcher_name: process.argv[0] + " " + path.relative(process.cwd(), process.argv[1])
}, done_cb, function(jvm: JVM): void {
  jvm_state = jvm;
});
