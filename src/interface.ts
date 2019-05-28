import { InterfaceTypeDefinitionNode } from 'graphql'
import * as R from 'ramda'
import { convertArray as convertFieldArray, Field, FieldSchema, getName } from './field'
import { convertArray as convertDirectiveArray } from './directive'

export type InterfaceWithType = {
    type: 'interface'
} & InterfaceSchema

export interface InterfaceSchema {
    name: string
    fields: { [key: string]: FieldSchema }
    directives: { [key: string]: object }
}

export const convertArray = R.reduce(
    (acc, inter: InterfaceWithType): { [key: string]: InterfaceSchema } =>
        R.assoc(inter.name, R.omit(['type'], inter), acc),
    {}
)

export const TypeDefinition = (
    node: { fields: Field[] } & InterfaceTypeDefinitionNode
): InterfaceWithType => ({
    name: getName(node),
    fields: convertFieldArray(node.fields),
    directives: convertDirectiveArray(node.directives || []),
    type: 'interface'
})
