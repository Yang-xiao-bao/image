import {
	Input,
	InputGroup,
	InputLeftAddon,
	Progress,
	ProgressIndicator,
} from "@hope-ui/solid";
import { createMemoObject } from "@solidjs/router/dist/utils";
import { createEffect, createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { useAsyncConvolve } from "../hooks/useAsyncConvolve";
import { useSeparableConvolve } from "../hooks/useSeparableConvolve";
import { boxFilter } from "../libs/box-filter";
import { convolve } from "../libs/convolve";
import style from "./BoxFilter.module.css";

export function SeparableConvolve() {
	const [size, setSize] = createSignal(20);
	const [img, setImage] = createSignal<ImageData>();
	const [result, progress, process] = useSeparableConvolve();
	createEffect(() => {
		const image = img();
		if (image) {
			process(image, boxFilter(size()).get());
		}
	});
	const progressBar = createMemo(() => {
		const p = progress();
		if (p > 0 && p < 1) {
			return (
				<Progress value={p * 100}>
					<ProgressIndicator />
				</Progress>
			);
		}
		return null;
	});

	return (
		<div>
			<ImageSelector onSelect={setImage} />
			<InputGroup>
				<InputLeftAddon>Size</InputLeftAddon>
				<Input
					type="number"
					min={3}
					step={1}
					value={size()}
					onChange={(e) => {
						setSize(e.currentTarget.valueAsNumber);
					}}
				/>
			</InputGroup>
			<div class={style.container}>
				{createMemo(() => {
					const image = img();
					if (image) {
						return <ImagePreview image={image} />;
					}
					return null;
				})}
				{createMemo(() => {
					const image = result();
					if (image) {
						return <ImagePreview image={image} />;
					}
					return null;
				})}
			</div>
			{progressBar}
			<div>
				如果核的秩为1,那么这个核可以分解为两个小核，依次用这两个小核来做卷积可以显著提升性能。
			</div>
		</div>
	);
}
