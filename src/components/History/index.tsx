import React, { FC, useMemo } from "react";
import { Text, Box, Static, Newline} from "ink";
import { Message } from "../../types";
import BigText from "ink-big-text";

type Props = {
	messages: Message[];
};

const History: FC<Props> = ({ messages }) => {

	const messagesWithHeader = useMemo(() => {
		return ["header" as any, ...messages];
	}, [messages]);

	return (
		<Box flexDirection="column">
			<Static items={messagesWithHeader}>
				{(msg, index) => (
					<Box
						key={index}
						flexDirection="row"
						width="100%">

						{index === 0 ? (

							<Box flexDirection="column" width="100%">
								<Box justifyContent="center">
									<Text color="green">
										<BigText text="INK-CHAT" font="tiny" />
									</Text>
								</Box>
								<Box>
									<Text>
										<Text color="gray">
											{"[Usage]\nexit: exit the program\nreset: reset your API key\n\n[URL]\nhttps://github.com/hannes-wan/ink-chat"}
										</Text>
										<Newline/>
										<Newline/>
										<Text color="yellow">{"👽 "}</Text>
										<Text color="green">{"Welcome to ink-chat!\n"}</Text>
									</Text>
								</Box>
							</Box>

						) : (
							<Text>
                                <Text color="yellow">{msg.from === "user" ? "👤 " : (msg.from === "system" ? "👻 " : "👽 ")}</Text>
                                {
									msg.from === "user" ?
									<Text color="white">{msg.text}</Text> : (
										msg.from === "system" ?
										<Text color="red">{msg.text}{"\n"}</Text> :
										<Text color="green">{msg.text}{"\n"}</Text>
									)
                                }
							</Text>
						)}
					</Box>
				)}
			</Static>
		</Box>
	);
};

export default History;
