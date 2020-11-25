/**等待msTimes毫秒 */
export default function sleep(msTimes: number) {
	return new Promise<void>((resolve) => {
		let setTimeoutId = setTimeout(() => {
			// 清理计时器
			clearTimeout(setTimeoutId);
			resolve();
		}, msTimes);
	});
}
