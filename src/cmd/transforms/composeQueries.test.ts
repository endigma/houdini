import * as graphql from 'graphql'
import { expect } from 'vitest'

import { pipelineTest } from '../testUtils'
import { CollectedGraphQLDocument } from '../types'

const start = [
	`
        query Foo {
            version
            ...A
        }
    `,
	`
        fragment A on User {
            firstName
            ...B
        }
    `,
	`
        fragment B on User {
            firstName
        }
    `,
]

pipelineTest(
	'include fragment definitions',
	start,
	true,
	function (docs: CollectedGraphQLDocument[]) {
		// we only care about the Foo document
		const fooDoc = docs.find((doc) => doc.name === 'Foo')!

		// make sure there are at least three definitions
		expect(fooDoc.document.definitions).toHaveLength(3)

		// make sure that there is one for each fragment
		const fragmentADef = fooDoc.document.definitions.find(
			(definition) =>
				definition.kind === graphql.Kind.FRAGMENT_DEFINITION &&
				definition.name.value === 'A'
		)
		const fragmentBDef = fooDoc.document.definitions.find(
			(definition) =>
				definition.kind === graphql.Kind.FRAGMENT_DEFINITION &&
				definition.name.value === 'B'
		)
		expect(fragmentADef).toBeDefined()
		expect(fragmentBDef).toBeDefined()
	}
)
