import { Message, StorageKeys, Setting } from "../types";

import getConfig from "./get_config";

async function sendMessage(msg: Message) {
	
	const config = await getConfig();

	if (!(global as any).openaiApi) {
		const { ChatGPTAPI} = await import("chatgpt");

        const openaiApiKey = config.get(StorageKeys.OPENAI_API_KEY);
		const temperature = config.get(Setting.TEMPERATURE);
		const top_p = config.get(Setting.TOP_P);

        (global as any).openaiApi = new ChatGPTAPI({
            apiKey: openaiApiKey,
			completionParams: {
				temperature: temperature,
				top_p: top_p
			}
        });
	}

	return (global as any).openaiApi.sendMessage(msg.text, {
		conversationId: msg?.conversationId,
		parentMessageId: msg?.parentMessageId,
	}) as any;
}

export default sendMessage;