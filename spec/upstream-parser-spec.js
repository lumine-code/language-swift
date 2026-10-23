describe("Swift 6 concurrency and strict memory safety syntax", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-swift");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.swift"));
  });

  afterEach(() => editor?.destroy());

  it("parses and highlights sending parameters and return values", async () => {
    editor.setText("func transfer(_ value: sending Object) -> sending Object { value }\n");
    await editor.languageMode.ready;
    expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
    for (const column of [23, 42]) {
      expect(editor.scopeDescriptorForBufferPosition([0, column]).getScopesArray()).toContain(
        "storage.modifier.swift",
      );
    }
  });

  it("keeps multiline regex literals valid with CRLF line endings", async () => {
    editor.setText("let pattern = #/\r\n    [A-Z]+\r\n    /#\r\n");
    await editor.languageMode.ready;
    const root = editor.languageMode.tree.rootNode;
    expect(root.hasError).toBe(false);
    expect(root.descendantsOfType("regex_literal").length).toBe(1);
  });

  for (const statement of ["@MainActor func task() {}\n  weak var item: Object?", "open()"]) {
    it(`accepts later switch-case statements starting with ${statement.split(" ")[0]}`, async () => {
      editor.setText(`switch value {\ncase 0:\n  run()\n  ${statement}\ndefault: break\n}\n`);
      await editor.languageMode.ready;
      expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
      editor.getBuffer().append("let after = 1\n");
      await editor.languageMode.atTransactionEnd();
      expect(editor.languageMode.tree.rootNode.hasError).toBe(false);
    });
  }
});
