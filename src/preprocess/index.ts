// locals
import { getConfig } from '../common'
import { ConfigFile } from '../runtime'
import applyTransforms from './transforms'

/**
 * The houdini processor automates a lot of boilerplate to make inline documents
 * work.
 *
 * It takes the same configuration values as the houdini config file as well as an
 * optional `configFile` parameter to specify the path to use to find houdini.config.js
 */
export default function houdiniPreprocessor(
	extraConfig: { configFile?: string } & Partial<ConfigFile>
) {
	return {
		async markup({ content, filename }: { content: string; filename: string }) {
			// grab the config
			const config = await getConfig(extraConfig)

			// if we detected a kit project using the preprocessor, tell them they need to update
			if (config.framework === 'kit') {
				throw new Error('Please use the vite plugin.')
			}

			// apply the transform pipeline
			return await applyTransforms(config, { content, filename })
		},
	}
}
