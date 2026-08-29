// Assertions live in the comments: `<- scope` checks the marker's own column
// on the previous non-comment line, `^ scope` checks the caret's. Scopes
// match by prefix, so the trailing `.swift` segment is left off.

func greet(name: String) {
// <- storage.type.function
//        ^ punctuation.definition.arguments.begin.bracket.round
//             ^ punctuation.separator.type
//                       ^ punctuation.definition.block.begin.bracket.curly

    let x = 1
//          ^ constant.numeric

}
// <- punctuation.definition.block.end.bracket.curly

class Greeter {
    var message = "hi"
//      ^ variable.other.member
}

// a comment
// <- comment
