import React, { FC } from "react";
import { Text, Box } from "ink";
import Spinner from "ink-spinner";

const Waiting: FC = () => {
	return (
		<Box>
			<Box
				marginRight={1}
				borderColor="gray"
				borderStyle="classic"
				alignSelf="flex-end"
				width={"100%"}
				padding={1}
				paddingRight={2}
			>
				<Text color="green">
					<Spinner type="dots" />
				</Text>
				<Text color="gray">{" Waiting..."}</Text>
			</Box>
		</Box>
	);
};

export default Waiting;
