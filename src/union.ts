import { UnionTypeDefinitionNode, NamedTypeNode } from 'graphql'
import * as R from 'ramda'
import { getName } from './field'

export interface UnionSchema {
    types: string[]
    name: string
}

export type UnionWithType = {
    type: 'union'
} & UnionSchema

export const convertArray: (arr: UnionWithType[]) => { [key: string]: UnionSchema } = R.reduce(
    (acc, val: UnionWithType): { [key: string]: UnionSchema } =>
        R.assoc(val.name, R.omit(['type'], val), acc),
    {}
)

export const TypeDefinition = (node: UnionTypeDefinitionNode): UnionWithType => ({
    type: 'union',
    types: (node.types || []).map((type: NamedTypeNode): string => type.name.value),
    name: getName(node)
})
