import { InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode } from 'graphql'
import * as R from 'ramda'
import { convertArray as convertFieldArray, Field, FieldSchema } from './field'
import { convertArray as convertDirectiveArray } from './directive'
import { InterfaceWithType } from './interface'

export interface ObjectType {
    fields: Field[]
    interfaces: InterfaceTypeDefinitionNode[]
    directives: object[]
    [key: string]: object
}

export interface ObjectSchema {
    name: string
    fields: { [key: string]: FieldSchema }
    directives: { [key: string]: object }
    interfaces: string[]
}

export type ObjectWithType = {
    type: 'object'
} & ObjectSchema

export const getFields: (node: ObjectType) => Field[] = R.prop('fields')

export const convertArray = R.reduce(
    (acc, val: ObjectWithType): { [key: string]: ObjectSchema } =>
        R.assoc(val.name, R.omit(['type'], val), acc),
    {}
)

export const TypeDefinition = (
    node: ObjectTypeDefinitionNode & {
        fields: Field[]
        directives: object[]
        interfaces: InterfaceWithType[]
    }
): ObjectWithType => ({
    name: node.name.value,
    fields: convertFieldArray(node.fields),
    directives: convertDirectiveArray(node.directives),
    interfaces: node.interfaces.map((inter): string => inter.name.value),
    type: 'object'
})
