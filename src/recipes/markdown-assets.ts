import { App } from "obsidian";
import MimeType from "types/mime-type";
import Recipe from "types/recipe";
import AttachmentUtils from "utils/attachment-utils";

class MarkdownAssets implements Recipe {
	name = "markdown-assets";

	_attachmentUtils: AttachmentUtils;

	constructor(app: App) {
		this._attachmentUtils = new AttachmentUtils(app);
	}

	isValid(data: DataTransfer): boolean {
		return (
			data.types.includes(MimeType.PLAIN) &&
			data.getData(MimeType.PLAIN).includes("(file://")
		);
	}

	async execute(data: DataTransfer): Promise<DataTransfer> {
		let markdown = data.getData(MimeType.PLAIN);
		if (markdown === "") {
			return data;
		}

		await Promise.all(
			this._getAssetUrls(markdown).map(async (url) => {
				const newUrl =
					await this._attachmentUtils.copyIntoAttachmentsIfLocal(url);
				markdown = markdown.replace(url, `<${newUrl}>`);
			})
		);

		const dataTransfer = new DataTransfer();
		dataTransfer.setData(MimeType.PLAIN, markdown);
		return dataTransfer;
	}

	_getAssetUrls(markdown: string): string[] {
		const urls: string[] = [];
		const regex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g;
		let match;
		while ((match = regex.exec(markdown)) !== null) {
			if (match.index === regex.lastIndex) regex.lastIndex++;
			urls.push(match[1] || match[2] || match[5]);
		}

		return urls;
	}
}

export default MarkdownAssets;
