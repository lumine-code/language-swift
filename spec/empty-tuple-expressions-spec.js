describe("Swift empty tuple expressions", () => {
  const cases = [
    ["result success", "func unit() { completion(.success(())) }\n", 1, 1],
    ["named argument", 'func unit() { log(tag: "reset", payload: ()) }\n', 1, 1],
    ["nested pair", "let pair = (1, ())\n", 2, 1],
    ["assignment", "let empty = ()\n", 1, 1],
    ["continuation", "func unit() { continuation.resume(returning: ()) }\n", 1, 1],
    ["return", "func unit() { return () }\n", 1, 1],
    ["nonempty tuple control", "let pair = (1, 2)\n", 1, 0],
    ["empty call control", "func unit() { run() }\n", 0, 0],
  ];
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-swift");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.swift"));
  });

  afterEach(() => editor?.destroy());

  const rootNode = () => editor.getSyntaxNodeAtBufferPosition([0, 0], (node) => !node.parent);

  function check(source, tupleCount, emptyCount) {
    const root = rootNode();
    expect(root.hasError).toBe(false);
    expect(root.text).toBe(source);
    const tuples = root.descendantsOfType("tuple_expression");
    expect(tuples.length).toBe(tupleCount);
    expect(
      tuples.filter(
        (tuple) => tuple.namedChildCount === 0 && tuple.childForFieldName("value") === null,
      ).length,
    ).toBe(emptyCount);
    return root.toString();
  }

  for (const [name, source, tupleCount, emptyCount] of cases) {
    it(name + " through incremental edits and undo", async () => {
      editor.setText(source);
      expect(await editor.whenGrammarSettled()).toBe(true);
      const original = check(source, tupleCount, emptyCount);
      editor.getBuffer().clearUndoStack();
      const suffix = "let upstreamTail = 99\n";
      editor.getBuffer().append(suffix);
      expect(await editor.whenGrammarSettled()).toBe(true);
      check(source + suffix, tupleCount, emptyCount);
      editor.undo();
      expect(await editor.whenGrammarSettled()).toBe(true);
      expect(editor.getText()).toBe(source);
      expect(check(source, tupleCount, emptyCount)).toBe(original);
    });
  }
});
