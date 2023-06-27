import {
	Button,
	Card,
	CardBody,
	Flex,
	Heading,
	Spinner,
	Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoModel from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";

const App = () => {
	const [model, setModel] = useState();
	const [objectName, setObjectName] = useState("");
	const [objectScore, setObjectScore] = useState(0);
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);

	const loadModel = async () => {
		try {
			const dataset = await cocoModel.load();
			setModel(dataset);
		} catch (error) {
			console.log("gagal meload data", error);
		}
	};

	const predict = async () => {
		setLoading(true);
		const results = await model.detect(document.getElementById("videoSource"));

		if (results.length > 0) {
			setShow(true);
			setLoading(false);
			setObjectName(results[0].class);
			setObjectScore(results[0].score);
		}
	};

	const videoOption = {
		width: 720,
		facingMode: "enviroment",
	};

	useEffect(() => {
		tf.ready().then(() => {
			loadModel();
		});
	}, []);

	return (
		<Flex justifyContent={"center"} p={12} gap={4}>
			<Webcam id="videoSource" videoConstraints={videoOption} audio={false} />
			<Flex flexDir={"column"} gap={4}>
				<Heading fontSize={"2xl"} textAlign={"center"}>
					Object Detection With ReactJS
				</Heading>
				<Button colorScheme="blue" onClick={predict}>
					{loading ? <Spinner /> : "Deteksi"}
				</Button>
				{show ? (
					<Card>
						<CardBody textAlign={"center"}>
							<Heading mb={2} fontSize={"xl"}>
								{objectName}
							</Heading>
							<Text>Score: {objectScore}</Text>
						</CardBody>
					</Card>
				) : (
					""
				)}
			</Flex>
		</Flex>
	);
};

export default App;
