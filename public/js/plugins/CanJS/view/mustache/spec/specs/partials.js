steal('./spec',function(){ window.MUSTACHE_SPECS.push({name:'partials', data: {"overview":"Partial tags are used to expand an external template into the current\ntemplate.\n\nThe tag's content MUST be a non-whitespace character sequence NOT containing\nthe current closing delimiter.\n\nThis tag's content names the partial to inject.  Set Delimiter tags MUST NOT\naffect the parsing of a partial.  The partial MUST be rendered against the\ncontext stack local to the tag.\n\nPartial tags SHOULD be treated as standalone when appropriate.  If this tag\nis used standalone, any whitespace preceding the tag should treated as\nindentation, and prepended to each line of the partial before rendering.\n","tests":[{"name":"Basic Behavior","desc":"The greater-than operator should expand to the named partial.","data":{},"template":"\"{{>text}}\"","partials":{"text":"from partial"},"expected":"\"from partial\""},{"name":"Context","desc":"The greater-than operator should operate within the current context.","data":{"text":"content"},"template":"\"{{>partial}}\"","partials":{"partial":"*{{text}}*"},"expected":"\"*content*\""},{"name":"Recursion","desc":"The greater-than operator should properly recurse.","data":{"content":"X","nodes":[{"content":"Y","nodes":[]}]},"template":"{{>node}}","partials":{"node":"{{content}}<{{#nodes}}{{>node}}{{/nodes}}>"},"expected":"X<Y<>>"},{"name":"Surrounding Whitespace","desc":"The greater-than operator should not alter surrounding whitespace.","data":{},"template":"| {{>partial}} |","partials":{"partial":"\t|\t"},"expected":"| \t|\t |"},{"name":"Inline Indentation","desc":"Whitespace should be left untouched.","data":{"data":"|"},"template":"  {{data}}  {{> partial}}\n","partials":{"partial":">\n>"},"expected":"  |  >\n>\n"},{"name":"Standalone Line Endings","desc":"\"\\r\\n\" should be considered a newline for standalone tags.","data":{},"template":"|\r\n{{>partial}}\r\n|","partials":{"partial":">"},"expected":"|\r\n>|"},{"name":"Standalone Without Previous Line","desc":"Standalone tags should not require a newline to precede them.","data":{},"template":"  {{>partial}}\n>","partials":{"partial":">\n>"},"expected":"  >\n  >>"},{"name":"Standalone Without Newline","desc":"Standalone tags should not require a newline to follow them.","data":{},"template":">\n  {{>partial}}","partials":{"partial":">\n>"},"expected":">\n  >\n  >"},{"name":"Standalone Indentation","desc":"Each line of the partial should be indented before rendering.","data":{"content":"<\n->"},"template":"\\\n {{>partial}}\n/\n","partials":{"partial":"|\n{{{content}}}\n|\n"},"expected":"\\\n |\n <\n->\n |\n/\n"},{"name":"Padding Whitespace","desc":"Superfluous in-tag whitespace should be ignored.","data":{"boolean":true},"template":"|{{> partial }}|","partials":{"partial":"[]"},"expected":"|[]|"}],"__ATTN__":"Do not edit this file; changes belong in the appropriate YAML file."}});});