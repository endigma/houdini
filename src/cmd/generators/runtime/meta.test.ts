// local imports
import { readFile, testConfig } from '../../../common'
import '../../../../jest.setup'
import { runPipeline } from '../../generate'

test('generates runtime meta data file', async function () {
	const config = testConfig()
	// execute the generator
	await runPipeline(config, [])

	// open up the index file
	const fileContents = await readFile(config.metaFilePath)

	expect(fileContents).toBeTruthy()
	// verify contents
	expect(fileContents).toMatchInlineSnapshot(`"{\\"version\\":\\"HOUDINI_VERSION\\"}"`)
})
