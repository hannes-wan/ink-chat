export enum UIState {
	INIT,
	ASK_API_KEY,
	READY,
	WAITING_RESPONSE,
}

export type Message = {
	text: string;
	from: "user" | "ai" | "system";
	id: string;
	conversationId?: string;
	parentMessageId?: string;
};

export enum StorageKeys {
	OPENAI_API_KEY = "OPENAI_API_KEY",
}
