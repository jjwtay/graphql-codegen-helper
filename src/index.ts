import { parse, visit, GraphQLSchema } from 'graphql'
import { printSchemaWithDirectives } from 'graphql-toolkit'
import { Types } from '@graphql-codegen/plugin-helpers'
import * as R from 'ramda'
import { ObjectWithType, convertArray as convertObjectArray, ObjectSchema } from './object'
import { UnionWithType, convertArray as convertUnionArray, UnionSchema } from './union'
import {
    convertArray as convertInterfaceArray,
    InterfaceWithType,
    InterfaceSchema
} from './interface'
import visitor from './visitor'

interface Schema {
    types: { [key: string]: ObjectSchema }
    unions: { [key: string]: UnionSchema }
    interfaces: { [key: string]: InterfaceSchema }
}

export type SchemaTypes = InterfaceWithType | UnionWithType | ObjectWithType

export const getTypes = (
    search: string,
    arr: SchemaTypes[]
): InterfaceWithType[] | UnionWithType[] | ObjectWithType[] =>
    arr.filter((val): boolean => val.type === search) as
        | InterfaceWithType[]
        | UnionWithType[]
        | ObjectWithType[]

export const createPlugin = (
    fn: (arg: Schema, documents: Types.DocumentFile[], config: {}) => any
) => (schema: GraphQLSchema, documents: Types.DocumentFile[], config: {}) => {
    const printedSchema = printSchemaWithDirectives(schema)
    const astNode = parse(printedSchema)
    const result: {
        definitions: (InterfaceWithType | UnionWithType | ObjectWithType)[]
    } = visit(astNode, { leave: visitor as object })

    const types = R.pipe(
        (defs: SchemaTypes[]): ObjectWithType[] => getTypes('object', defs) as ObjectWithType[],
        convertObjectArray
    )(result.definitions)

    const unions = R.pipe(
        (defs: SchemaTypes[]): UnionWithType[] => getTypes('union', defs) as UnionWithType[],
        convertUnionArray
    )(result.definitions)

    const interfaces = R.pipe(
        (defs: SchemaTypes[]): InterfaceWithType[] =>
            getTypes('interface', defs) as InterfaceWithType[],
        convertInterfaceArray
    )(result.definitions)

    const jsObj: Schema = {
        types,
        unions,
        interfaces
    }

    return fn(jsObj, documents, config)
}
