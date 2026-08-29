const path = require("path");

// Asserts the scopes the grammar actually produces, using the fixture beside
// this file. `runGrammarTests` reads `<- scope` and `^ scope` assertions out of
// the fixture's own comments, so the fixture is the readable spec.
//
// A fixture whose assertions never run still reports green, so break one
// expected scope and confirm this fails before trusting it.

describe("Swift Tree-sitter grammar", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-swift");
  });

  it("tokenizes the fixture", async () => {
    await runGrammarTests(path.join(__dirname, "fixtures", "sample.swift"), /\/\//);
  });

  it("does not fold runs of import declarations", async () => {
    const editor = await lumine.workspace.open("imports.swift");
    editor.setText("import Foundation\nimport Dispatch\n");
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.swift"));
    await editor.getBuffer().languageMode.ready;

    expect(editor.getBuffer().languageMode.getFoldableRanges()).toEqual([]);
  });
});
