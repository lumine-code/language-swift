describe("Swift operator and call precedence", () => {
  const { cases } = require("./fixtures/upstream-precedence.json");
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-swift");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.swift"));
  });

  afterEach(() => editor?.destroy());

  const rootNode = () => editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);
  const shape = (node) =>
    `(${node.type}${node.namedChildren.map((child) => " " + shape(child)).join("")})`;

  function check(source, expectedTree) {
    const root = rootNode();
    expect(root.hasError).toBe(false);
    expect(root.text).toBe(source);
    expect(shape(root)).toBe(expectedTree);
    return root;
  }

  for (const { name, source, expectedTree } of cases) {
    it(name + " through incremental identifier edits and undo", async () => {
      editor.setText(source);
      expect(await editor.whenGrammarSettled()).toBe(true);
      const original = check(source, expectedTree);
      const identifier = original.descendantsOfType("simple_identifier")[0];
      expect(identifier).toBeDefined();
      const replacement = "precedenceValue";
      const edited =
        source.slice(0, identifier.startIndex) + replacement + source.slice(identifier.endIndex);
      editor.getBuffer().clearUndoStack();
      editor
        .getBuffer()
        .setTextInRange([identifier.startPosition, identifier.endPosition], replacement);
      expect(await editor.whenGrammarSettled()).toBe(true);
      check(edited, expectedTree);
      editor.undo();
      expect(await editor.whenGrammarSettled()).toBe(true);
      expect(editor.getText()).toBe(source);
      check(source, expectedTree);
    });
  }
});
