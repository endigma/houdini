import { sleep } from '@kitql/helper'
import glob from 'glob'
import path from 'path'
import { Plugin } from 'vite'

import { pullSchema } from '../cmd/utils'
import { formatErrors, getConfig } from '../common'
import { ConfigFile } from '../runtime'

export default function HoudiniWatchSchemaPlugin({
	configFile,
	...extraConfig
}: { configFile?: string } & Partial<ConfigFile> = {}): Plugin {
	let go = true

	return {
		name: 'houdini-watch-schema',
		apply: 'serve',
		async buildStart() {
			const config = await getConfig({ configFile, ...extraConfig })
			let nbPullError = 0

			// validate the config

			// if there's no api url set, there's nothing to poll
			if (!config.apiUrl) {
				return
			}

			// if the schema path is a glob, there's no reason to poll (the schema is already local)
			if (config.schemaPath && glob.hasMagic(config.schemaPath)) {
				return
			}

			const interval = config.schemaPollInterval

			// an interval of null means no initial poll
			if (interval === null) {
				return
			}

			// the function to call on the appropriate interval
			async function pull(more: boolean) {
				try {
					// Write the schema
					const schemaState = await pullSchema(
						config.apiUrl!,
						config.schemaPath ?? path.resolve(process.cwd(), 'schema.json'),
						config.pullHeaders
					)

					nbPullError = schemaState ? 0 : nbPullError + 1
				} catch (e) {
					formatErrors(e)
				}

				// if we are supposed to poll more, wait the appropriate amount of time and then do it again
				if (more) {
					// Wait more and more and more...
					const timeToWait = interval! + interval! * nbPullError
					await sleep(timeToWait)

					if (go) {
						pull(more)
					}
				}
			}

			// its safe to pull the schema
			await pull(false)

			// if we aren't supposed to poll at all
			if (interval <= 0) {
				return
			}

			// wait once before starting the loop
			await sleep(interval)

			// start listening
			await pull(true)
		},
		buildEnd() {
			go = false
		},
	}
}
