import { Message, StorageKeys} from "../types";

import getConfig from "./get_config";

async function sendMessage(msg: Message) {

	const config = await getConfig();

	if (!(global as any).openaiApi) {
		const { ChatGPTAPI} = await import("chatgpt");

        const openaiApiKey = config.get(StorageKeys.OPENAI_API_KEY);

        (global as any).openaiApi = new ChatGPTAPI({
            apiKey: openaiApiKey,
			completionParams: {
				temperature: 1,
				top_p: 1,
			},
        });
	}

	return (global as any).openaiApi.sendMessage(msg.text, {
		conversationId: msg?.conversationId,
		parentMessageId: msg?.parentMessageId,
	}) as any;
}

export default sendMessage;
