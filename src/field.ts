import {
    FieldDefinitionNode,
    DirectiveNode,
    UnionTypeDefinitionNode,
    InterfaceTypeDefinitionNode,
    NamedTypeNode,
    ListTypeNode,
    NonNullTypeNode
} from 'graphql'
import * as R from 'ramda'
import { convertArray as convertDirectiveArray } from './directive'
import * as consts from './consts'

export interface FieldSchema {
    isNullable: boolean
    isList: boolean
    directives: object
    type: string
}

export type Field = {
    name: string
} & FieldSchema

export const getName: (
    node:
        | FieldDefinitionNode
        | DirectiveNode
        | UnionTypeDefinitionNode
        | InterfaceTypeDefinitionNode
) => string = R.pathOr('name', ['name', 'value'])

export const getDirectives: (node: FieldDefinitionNode) => readonly DirectiveNode[] = R.propOr(
    [],
    'directives'
)

export const isNullable: (obj: FieldDefinitionNode) => boolean = R.pipe(
    R.pathOr(false, ['type', 'kind']),
    R.equals(consts.NON_NULL_TYPE),
    R.not
)

export const isList: (obj: FieldDefinitionNode) => boolean = R.pipe(
    R.pathOr(false, ['type', 'kind']),
    R.equals(consts.LIST_TYPE)
)

export const convertArray: (arr: Field[]) => { [key: string]: FieldSchema } = R.reduce(
    (acc, field: Field): { [key: string]: FieldSchema } =>
        R.assoc(field.name, R.omit(['name'], field), acc),
    {}
)

export const getType = (node: FieldDefinitionNode | ListTypeNode | NonNullTypeNode): string => {
    if (node.type.kind === 'NamedType') {
        return (node.type as NamedTypeNode).name.value
    }

    if (node.type.kind === 'ListType') {
        return getType(node.type)
    }

    if (node.type.kind === 'NonNullType') {
        return getType(node.type)
    }

    return 'field'
}

export const TypeDefinition = (node: FieldDefinitionNode): Field => ({
    name: node.name.value,
    isNullable: isNullable(node),
    isList: isList(node),
    directives: convertDirectiveArray(node.directives || []),
    type: getType(node)
})
