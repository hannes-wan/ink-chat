import React, { FC, useCallback, useEffect, useMemo, useReducer } from "react";
import { Box, Newline } from "ink";
import History from "./components/History";
import Query from "./components/Query";
import { Message, StorageKeys, UIState } from "./types";
import sendMessage from "./utils/send_message";
import getConfig from "./utils/get_config";
import Waiting from "./components/Waiting";
import Input from "./components/Input";
import { v4 as uuidv4 } from "uuid";

import Init from "./components/Init";

type State = {
	uiState: UIState;
	messages: Message[];
};

const App: FC<{}> = ({}) => {
	const [state, setState] = useReducer(
		(state: State, newState: Partial<State>) => ({
			...state,
			...newState,
		}),
		{
			uiState: UIState.INIT,
			messages: [],
		}
	);

	useEffect(() => {
		(async () => {
			const config = await getConfig();

			if (!config.get(StorageKeys.OPENAI_API_KEY)) {
				config.delete(StorageKeys.OPENAI_API_KEY);

				return setState({
					uiState: UIState.ASK_API_KEY,
				});
			}

			return setState({
				uiState: UIState.READY,
			});
		})();
	}, []);

	const onSubmitToken = useCallback(
		(storageKey: StorageKeys) => async (token: string) => {

			if (token === "/exit") 
				process.exit(0)

			const config = await getConfig();

			config.set(storageKey, token);

			// Check if token is illegal
			try {
				const res = await sendMessage({
					text: "ping",
					id: uuidv4(),
					from: "user",
				});

				if (res?.text) {
					setState({
						uiState: UIState.READY,
					});
				}
			} catch (err) {
				if ((err as any)?.statusCode === 401) {
					console.log('\x1B[31m%s\x1B[0m', 'Check if your API Key is legal!');
					config.delete(StorageKeys.OPENAI_API_KEY);
					(global as any).openaiApi = null
					return setState({
						uiState: UIState.ASK_API_KEY,
					});
				} else {
					console.log("[ERROR]", err);
				}
			}
		},
		[setState]
	);

	const onSubmitQuery = useCallback(
		async (text: string) => {
			const config = await getConfig();
			
			if (text === "/exit") 
				process.exit(0)

			if (text === "/reset") {
				const config = await getConfig();
				config.delete(StorageKeys.OPENAI_API_KEY);
				(global as any).openaiApi = null
				return setState({
					uiState: UIState.ASK_API_KEY,
				});
			}
			
			const prevMessage = state.messages.at(-1);

			const current: Message = {
				text,
				id: uuidv4(),
				from: "user",
				conversationId: prevMessage?.conversationId,
				parentMessageId: prevMessage?.id,
			};

			const messages = [...state.messages, current] as Message[];

			setState({
				messages,
				uiState: UIState.WAITING_RESPONSE,
			});

			try {
				const res = await sendMessage(current);

				if (res?.text) {
					const answer: Message = {
						from: "ai",
						id: res.id,
						text: res.text,
						conversationId: res.conversationId,
						parentMessageId: current.id,
					};

					return setState({
						messages: [...messages, answer],
						uiState: UIState.READY,
					});
				}
			} catch (err) {
				if ((err as any)?.statusCode === 401) {
					console.log('\x1B[31m%s\x1B[0m', 'Check if your API Key is legal!');
					config.delete(StorageKeys.OPENAI_API_KEY);
					(global as any).openaiApi = null
					return setState({
						uiState: UIState.ASK_API_KEY,
					});
				} else {
					console.log("[ERROR]", err);
				}
			}

			return setState({
				uiState: UIState.READY,
			});
		},
		[setState, state]
	);

	const render = useMemo(() => {
		let render = null;
		switch (state.uiState) {
			case UIState.INIT:
				render = <Init />;
				break;

			case UIState.ASK_API_KEY:
				render = (
					<Input
						message="Enter your OpenAI API Key: "
						onSubmit={onSubmitToken(StorageKeys.OPENAI_API_KEY)}
					/>
				);
				break;

			case UIState.READY:
				render = <Query onSubmit={onSubmitQuery} />;
				break;

			case UIState.WAITING_RESPONSE:
				render = <Waiting />;
				break;
				
			default:
				break;
		}

		return render;
	}, [state.uiState, onSubmitQuery, onSubmitToken]);

	return (
		<Box flexDirection="column">
			<History messages={state.messages} />
			<Newline />
			{render}
		</Box>
	);
};

module.exports = App;
export default App;