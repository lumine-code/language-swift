"." @punctuation.separator.property.swift
";" @punctuation.terminator.statement.swift
":" @punctuation.separator.type.swift
"," @punctuation.separator.comma.swift

"(" @punctuation.definition.arguments.begin.bracket.round.swift
")" @punctuation.definition.arguments.end.bracket.round.swift
"[" @punctuation.definition.collection.begin.bracket.square.swift
"]" @punctuation.definition.collection.end.bracket.square.swift
"{" @punctuation.definition.block.begin.bracket.curly.swift
"}" @punctuation.definition.block.end.bracket.curly.swift

; Identifiers
(type_identifier) @support.type.swift

[
  (self_expression)
  (super_expression)
] @variable.language.swift

; Declarations
[
  "func"
  "deinit"
] @storage.type.function.swift

[
  (visibility_modifier)
  (member_modifier)
  (function_modifier)
  (property_modifier)
  (parameter_modifier)
  (inheritance_modifier)
  (mutation_modifier)
] @storage.modifier.swift

(simple_identifier) @variable.other.swift

(function_declaration
  (simple_identifier) @entity.name.function.method.swift)

(protocol_function_declaration
  name: (simple_identifier) @entity.name.function.method.swift)

(init_declaration
  "init" @entity.name.function.constructor.swift)

(parameter
  external_name: (simple_identifier) @variable.parameter.swift)

(parameter
  name: (simple_identifier) @variable.parameter.swift)

(type_parameter
  (type_identifier) @variable.parameter.swift)

(inheritance_constraint
  (identifier
    (simple_identifier) @variable.parameter.swift))

(equality_constraint
  (identifier
    (simple_identifier) @variable.parameter.swift))

[
  "protocol"
  "extension"
  "indirect"
  "nonisolated"
  "override"
  "convenience"
  "required"
  "some"
  "any"
  "weak"
  "unowned"
  "didSet"
  "willSet"
  "subscript"
  "let"
  "var"
  (throws)
  (where_keyword)
  (getter_specifier)
  (setter_specifier)
  (modify_specifier)
  (else)
  (as_operator)
] @keyword.control.swift

[
  "enum"
  "struct"
  "class"
  "typealias"
] @storage.type.swift

[
  "async"
  "await"
] @keyword.control.swift

(shebang_line) @keyword.control.directive.swift

(class_body
  (property_declaration
    (pattern
      (simple_identifier) @variable.other.member.swift)))

(protocol_property_declaration
  (pattern
    (simple_identifier) @variable.other.member.swift))

(navigation_expression
  (navigation_suffix
    (simple_identifier) @variable.other.member.swift))

(value_argument
  name: (value_argument_label
    (simple_identifier) @variable.other.member.swift))

(import_declaration
  "import" @keyword.control.import.swift)

(enum_entry
  "case" @keyword.control.swift)

(modifiers
  (attribute
    "@" @entity.other.attribute-name.swift
    (user_type
      (type_identifier) @entity.other.attribute-name.swift)))

; Function calls
(call_expression
  (simple_identifier) @support.other.function.swift) ; foo()

(call_expression
  ; foo.bar.baz(): highlight the baz()
  (navigation_expression
    (navigation_suffix
      (simple_identifier) @support.other.function.swift)))

(call_expression
  (prefix_expression
    (simple_identifier) @support.other.function.swift)) ; .foo()

((navigation_expression
  (simple_identifier) @support.type.swift) ; SomeType.method(): highlight SomeType as a type
  (#match? @support.type.swift "^[A-Z]"))

(directive) @keyword.control.directive.swift

; See https://docs.swift.org/swift-book/documentation/the-swift-programming-language/lexicalstructure/#Keywords-and-Punctuation
[
  (diagnostic)
  (availability_condition)
  (playground_literal)
  (key_path_string_expression)
  (selector_expression)
  (external_macro_definition)
] @entity.name.function.macro.swift

(special_literal) @entity.name.function.preprocessor.swift

; Statements
(for_statement
  "for" @keyword.control.loop.swift)

(for_statement
  "in" @keyword.control.loop.swift)

[
  "while"
  "repeat"
  "continue"
  "break"
] @keyword.control.loop.swift

(guard_statement
  "guard" @keyword.control.conditional.swift)

(if_statement
  "if" @keyword.control.conditional.swift)

(switch_statement
  "switch" @keyword.control.conditional.swift)

(switch_entry
  "case" @keyword.control.swift)

(switch_entry
  "fallthrough" @keyword.control.swift)

(switch_entry
  (default_keyword) @keyword.control.swift)

"return" @keyword.control.return.swift

(ternary_expression
  [
    "?"
    ":"
  ] @keyword.operator.ternary.swift)

[
  (try_operator)
  "do"
  (throw_keyword)
  (catch_keyword)
] @keyword.control.exception.swift

(statement_label) @entity.name.label.swift

; Comments
[
  (comment)
  (multiline_comment)
] @comment.line.swift @_IGNORE_.spell

((comment) @comment.block.documentation.swift
  (#match? @comment.block.documentation.swift "^///[^/]"))

((comment) @comment.block.documentation.swift
  (#match? @comment.block.documentation.swift "^///$"))

((multiline_comment) @comment.block.documentation.swift
  (#match? @comment.block.documentation.swift "^/[*][*][^*].*[*]/$"))

; String literals
(line_str_text) @string.quoted.double.swift

(str_escaped_char) @constant.character.escape.swift

(multi_line_str_text) @string.quoted.double.swift

(raw_str_part) @string.quoted.double.swift

(raw_str_end_part) @string.quoted.double.swift

(line_string_literal
  "\\(" @punctuation.section.embedded.begin.swift
  ")" @punctuation.section.embedded.end.swift)

(multi_line_string_literal
  "\\(" @punctuation.section.embedded.begin.swift
  ")" @punctuation.section.embedded.end.swift)

(raw_str_interpolation
  (raw_str_interpolation_start) @punctuation.section.embedded.begin.swift
  ")" @punctuation.section.embedded.end.swift)

[
  "\""
  "\"\"\""
] @string.quoted.double.swift

; Lambda literals
(lambda_literal
  "in" @keyword.operator.word.swift)

; Basic literals
[
  (integer_literal)
  (hex_literal)
  (oct_literal)
  (bin_literal)
] @constant.numeric.swift

(real_literal) @constant.numeric.float.swift

(boolean_literal) @constant.language.boolean.swift

"nil" @constant.language.swift

(wildcard_pattern) @constant.character.escape.swift

; Regex literals
(regex_literal) @string.regexp.swift

; Operators
(custom_operator) @keyword.operator.swift

[
  "+"
  "-"
  "*"
  "/"
  "%"
  "="
  "+="
  "-="
  "*="
  "/="
  "<"
  ">"
  "<<"
  ">>"
  "<="
  ">="
  "++"
  "--"
  "^"
  "&"
  "&&"
  "|"
  "||"
  "~"
  "%="
  "!="
  "!=="
  "=="
  "==="
  "?"
  "??"
  "->"
  "..<"
  "..."
  (bang)
] @keyword.operator.swift

(type_arguments
  "<" @punctuation.definition.type-arguments.begin.bracket.angle.swift
  ">" @punctuation.definition.type-arguments.end.bracket.angle.swift)
