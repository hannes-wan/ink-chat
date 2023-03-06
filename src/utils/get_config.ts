async function getConfig() {
	const Conf = await import("conf").then((mod) => mod.default);

	return new Conf({ projectName: "ink-chat" }) as any;
}

export default getConfig;