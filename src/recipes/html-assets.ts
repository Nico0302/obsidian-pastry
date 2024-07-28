import MimeType from "types/mime-type";
import Recipe from "types/recipe";
import MarkdownAssets from "./markdown-assets";
import { App, htmlToMarkdown } from "obsidian";

class HtmlAssets implements Recipe {
	name: "html-assets";

	_markdownAssets: MarkdownAssets;

	constructor(app: App) {
		this._markdownAssets = new MarkdownAssets(app);
	}

	isValid(data: DataTransfer): boolean {
		return data.types.includes(MimeType.HTML);
	}

	async execute(data: DataTransfer): Promise<DataTransfer> {
		const html = data.getData(MimeType.HTML);
		if (html === "") {
			return data;
		}

		const dataTransfer = new DataTransfer();
		dataTransfer.setData(MimeType.PLAIN, htmlToMarkdown(html));

		return this._markdownAssets.execute(dataTransfer);
	}
}

export default HtmlAssets;
