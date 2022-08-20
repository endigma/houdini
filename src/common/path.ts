export function pathPlatform(str: string) {
	// Windows/Linux separation - Windows starts with a drive letter, we need a / in front there
	return `${str.startsWith('/') ? '' : '/'}${str}`
}
