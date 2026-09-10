const fs = require("fs");
const path = require("path");
const { Point } = require("lumine");

const HIGHLIGHTS_PATH = path.join(__dirname, "..", "grammars", "swift-highlights.scm");

describe("Swift Tree-sitter highlights", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-swift");
  });

  afterEach(() => editor?.destroy());

  async function setUp(text) {
    editor = await lumine.workspace.open("types.swift");
    editor.setText(text);
    await editor.getBuffer().languageMode.ready;
    await editor.getBuffer().languageMode.atTransactionEnd();
  }

  function rawCaptures(startRow, endRow) {
    const layer = editor.getBuffer().languageMode.rootLanguageLayer;
    return layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
      startPosition: new Point(startRow, 0),
      endPosition: new Point(endRow, 0),
    });
  }

  function scopesAt(row, text, occurrence = 0) {
    const line = editor.lineTextForBufferRow(row);
    let column = -1;
    for (let index = 0; index <= occurrence; index++) column = line.indexOf(text, column + 1);
    expect(column).not.toBe(-1);
    return editor.scopeDescriptorForBufferPosition([row, column]).getScopesArray();
  }

  it("keeps type arguments scoped with leaf delimiters", async () => {
    await setUp("let value: Box<Type>");

    expect(scopesAt(0, "<")).toContain(
      "punctuation.definition.type-arguments.begin.bracket.angle.swift",
    );
    expect(scopesAt(0, ">")).toContain(
      "punctuation.definition.type-arguments.end.bracket.angle.swift",
    );
  });

  it("pairs line and multiline interpolation delimiters, including an empty expression", async () => {
    await setUp(`let line = "\\(first)\\()"
let multiline = """
\\(second)\\(third)
"""`);

    for (const occurrence of [0, 1]) {
      expect(scopesAt(0, "\\(", occurrence)).toContain("punctuation.section.embedded.begin.swift");
      expect(scopesAt(0, ")", occurrence)).toContain("punctuation.section.embedded.end.swift");
      expect(scopesAt(2, "\\(", occurrence)).toContain("punctuation.section.embedded.begin.swift");
      expect(scopesAt(2, ")", occurrence)).toContain("punctuation.section.embedded.end.swift");
    }

    const delimiters = rawCaptures(0, 4).filter((capture) =>
      capture.name.startsWith("punctuation.section.embedded."),
    );
    expect(delimiters.map((capture) => capture.name)).toEqual([
      "punctuation.section.embedded.begin.swift",
      "punctuation.section.embedded.end.swift",
      "punctuation.section.embedded.begin.swift",
      "punctuation.section.embedded.end.swift",
      "punctuation.section.embedded.begin.swift",
      "punctuation.section.embedded.end.swift",
      "punctuation.section.embedded.begin.swift",
      "punctuation.section.embedded.end.swift",
    ]);
  });

  it("keeps a large type-argument parent leaf-rooted and tile captures local", async () => {
    const lines = ["let value: Box<"];
    for (let index = 0; index < 6000; index++) {
      lines.push(`  Type${index}${index < 5999 ? "," : ""}`);
    }
    lines.push(">");
    await setUp(lines.join("\r\n"));

    const captures = rawCaptures(3000, 3006);
    expect(captures.length).toBeLessThanOrEqual(16);
    expect(
      captures.every(
        (capture) =>
          capture.node.startPosition.row >= 3000 && capture.node.startPosition.row < 3006,
      ),
    ).toBe(true);

    const query = fs.readFileSync(HIGHLIGHTS_PATH, "utf8");
    expect(query).toContain("(#is? test.childOfType type_arguments)");
    expect(query).not.toMatch(/\(type_arguments\s+"[<>]"/);
  });

  it("keeps a 6000-row interpolated string bounded to the requested tile", async () => {
    const lines = ['let value = """'];
    for (let index = 0; index < 6000; index++) lines.push(`  \\(value_${index})`);
    lines.push('"""');
    await setUp(lines.join("\r\n"));

    const captures = rawCaptures(3000, 3006);
    expect(captures.length).toBeLessThanOrEqual(64);
    const delimiters = captures.filter((capture) =>
      capture.name.startsWith("punctuation.section.embedded."),
    );
    expect(delimiters.length).toBe(12);
    expect(
      delimiters.every(
        (capture) =>
          capture.node.startPosition.row >= 3000 && capture.node.startPosition.row < 3006,
      ),
    ).toBe(true);

    const query = fs.readFileSync(HIGHLIGHTS_PATH, "utf8");
    expect(query).not.toMatch(/\((?:line_string_literal|multi_line_string_literal)\s+"\\\\\("/);
    expect(query).toContain(
      '(#is? test.childOfType "line_string_literal multi_line_string_literal")',
    );
    expect(query).toContain('(#is? test.typeAt "nextSibling interpolated_expression )")');
    expect(query).toContain('(#is? test.typeAt "previousSibling interpolated_expression")');
  });
});
