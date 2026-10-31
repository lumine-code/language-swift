describe("swift editing settings", () => {
  let editor, pairingWasActive;
  beforeAll(() => {
    pairingWasActive = lumine.packages.isPackageActive("bracket-matcher");
  });
  afterAll(async () => {
    if (!pairingWasActive) await lumine.packages.deactivatePackage("bracket-matcher");
  });
  beforeEach(async () => {
    jasmine.useRealClock();
    editor = null;
    await lumine.packages.activatePackage("language-swift");
    await lumine.packages.activatePackage("bracket-matcher");
  });
  afterEach(() => editor?.destroy());
  async function start(scope, text = "value") {
    editor ??= await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName(scope));
    editor.setText(text);
    expect(await editor.whenGrammarSettled()).toBe(true);
    editor.update({ autoIndent: false });
  }
  for (const [scope, line, block] of [["source.swift", "//", ["/*", "*/"]]]) {
    it("exposes line and block comment metadata in " + scope, async () => {
      await start(scope);
      expect(await editor.getCommentDelimitersForBufferPosition([0, 0])).toEqual({ line, block });
      await editor.toggleLineCommentsForBufferRows(0, 0);
      expect(editor.getText()).toBe(line + " value");
      await editor.toggleLineCommentsForBufferRows(0, 0);
      expect(editor.getText()).toBe("value");
    });
    it("round trips block comments using the advertised delimiters in " + scope, async () => {
      await start(scope);
      const { block } = await editor.getCommentDelimitersForBufferPosition([0, 0]);
      const options = {
        commentStrings: { commentStartString: block[0], commentEndString: block[1] },
      };
      await editor.toggleLineCommentsForBufferRows(0, 0, options);
      expect(editor.getText()).toBe(block[0] + " value " + block[1]);
      await editor.toggleLineCommentsForBufferRows(0, 0, options);
      expect(editor.getText()).toBe("value");
    });
  }
  it("pairs valid punctuation without duplicating unsupported quote or escape characters", async () => {
    for (const [scope, character, expected] of [
      ["source.swift", "'", "'"],
      ["source.swift", '"', '""'],
      ["source.swift", "(", "()"],
    ]) {
      await start(scope, "");
      await editor.insertText(character, { autoIndent: false, autoDecreaseIndent: false });
      await editor.whenGrammarSettled();
      expect(editor.getText())
        .withContext(scope + " " + character)
        .toBe(expected);
    }
  });
  it("selects textual Swift interfaces and executable scripts", () => {
    expect(
      lumine.grammars.selectGrammar("module.swiftinterface", "public struct Test {}\n").scopeName,
    ).toBe("source.swift");
    for (const text of [
      "#!/usr/bin/swift",
      "#!/usr/bin/env swift",
      "#!/usr/bin/env -S swift -O",
      "#!/usr/bin/swift\r\nprint(1)",
      "#!/opt/swift/usr/bin/swift.exe",
      "#!/usr/bin/env swift.exe",
      "#!/usr/bin/env.exe -S swift.exe -O",
    ])
      expect(lumine.grammars.selectGrammar("script", text).scopeName).toBe("source.swift");
    for (const text of [
      "#!/usr/bin/env swiftc",
      "#!/usr/bin/swift.exe-wrapper",
      "#!/usr/bin/env.exe -S python -c swift.exe",
      "#!/usr/bin/python -c swift",
    ])
      expect(lumine.grammars.selectGrammar("script", text).scopeName).not.toBe("source.swift");
  });
});
