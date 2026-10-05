(class_declaration name: (type_identifier) @name) @definition.class
(protocol_declaration name: (type_identifier) @name) @definition.interface

; Member ranges belong to their declaration, never to the enclosing class.
(class_body (function_declaration name: (simple_identifier) @name) @definition.method)
(protocol_body (protocol_function_declaration name: (simple_identifier) @name) @definition.method)
(subscript_declaration "subscript" @name) @definition.method
(init_declaration "init" @name) @definition.constructor
(deinit_declaration "deinit" @name) @definition.method
(property_declaration (pattern (simple_identifier) @name)) @definition.property

; Free and local functions do not duplicate member declarations.
(source_file (function_declaration name: (simple_identifier) @name) @definition.function)
(statements (function_declaration name: (simple_identifier) @name) @definition.function)
