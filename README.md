# graphql-codegen-helper
Graphql Codengen helper functions to quickly build plugins.

## How to create a plugin. Simple Example to create a plugin that prettifies a graphql schema to human readable javascript object.

*With this typescript plugin file*

    import { createPlugin} from 'graphql-codegen-helper/dist'
    import { Types, PluginFunction, PluginValidateFn } from '@graphql-codegen/plugin-helpers';
    import { readFileSync } from 'fs'

    /* graphql-codegen plugin. */
    export const plugin = createPlugin(jsObj => `export default ${JSON.stringify(jsObj, null, 4)}`)

    const directives = readFileSync('directives.graphql')

    /* extra directives my library "needs" to run */
    exports.addToSchema = [
        directives, // other optional directives needed for your plugin
    ].join('\n')

*With this separate graphql Directive definition schema for my plugin.*

    directive @Foo on OBJECT
    directive @Bar on OBJECT


*Now if given this graphql Schema.*

    type Author @Foo {
        name: String!
        Books: [Book]
    }

    type Book @Bar {
        title: String!
        Authors: [Author]!
    }

*And run "npx graphql-codegen" with this graphql-codegen config file after compiling with "tsc -m esnext --outDir dist/esnext && tsc -m commonjs --outDir dist/commonjs". Note naming convention here just example not hardwired.*

    schema: testgen.graphql
    overwrite: true
    generates:
        testgen_output.js:
            - ./dist/commonjs/testgen.js



*I will receive this js output from my new plugin.*

    export default {
        types: {
            Author: {
                name: "Author",
                fields: {
                    name: {
                        isNullable: false,
                        isList: false,
                        directives: {},
                        type: "String"
                    },
                    Books: {
                        isNullable: true,
                        isList: true,
                        directives: {},
                        type: "Book"
                    }
                },
                directives: {
                    Foo: {}
                },
                interfaces: []
            },
            Book: {
                name: "Book",
                fields: {
                    title: {
                        isNullable: false,
                        isList: false,
                        directives: {},
                        type: "String"
                    },
                    Authors: {
                        isNullable: false,
                        isList: false,
                        directives: {},
                        type: "Author"
                    }
                },
                directives: {
                    Bar: {}
                },
                interfaces: []
            }
        },
        unions: {},
        interfaces: {}
    };

## License

This code is provided under the MIT license.