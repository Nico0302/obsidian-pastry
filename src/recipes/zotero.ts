import MimeType from "types/mime-type";
import Recipe from "types/recipe";
import MarkdownAssets from "./markdown-assets";
import HtmlAssets from "./html-assets";
import { App } from "obsidian";
import { homedir } from "os";

class Zotero implements Recipe {
	name = "zotero";

	_app: App;

	_markdownAssets: MarkdownAssets;
	_htmlAssets: HtmlAssets;

	constructor(app: App) {
		this._app = app;
		this._markdownAssets = new MarkdownAssets(app);
		this._htmlAssets = new HtmlAssets(app);
	}

	_isValidText(text: string): boolean {
		return (
			text.includes("zotero://") &&
			(text.includes("[image]") || text.includes("<img "))
		);
	}

	isValid(data: DataTransfer): boolean {
		return this._isValidText(
			data.getData(MimeType.PLAIN) || data.getData(MimeType.HTML)
		);
	}

	async execute(data: DataTransfer): Promise<DataTransfer> {
		const plainText = data.getData(MimeType.PLAIN);
		if (this._isValidText(plainText)) {
			return this._transformMarkdown(plainText);
		}
		const html = data.getData(MimeType.HTML);
		if (this._isValidText(html)) {
			return this._transformHTML(html);
		}
		return data;
	}

	async _transformMarkdown(text: string): Promise<DataTransfer> {
		const url = this._getAnnotationImageUrl(text);
		const dataTransfer = new DataTransfer();
		dataTransfer.setData(
			MimeType.PLAIN,
			url ? text.replace("[image]", `![](${url})`) : text
		);
		return this._markdownAssets.execute(dataTransfer);
	}

	async _transformHTML(html: string): Promise<DataTransfer> {
		const url = this._getAnnotationImageUrl(html);
		const dataTransfer = new DataTransfer();
		dataTransfer.setData(
			MimeType.HTML,
			url ? html.replace("<img ", `<img src="${url}" `) : html
		);
		return this._htmlAssets.execute(dataTransfer);
	}

	_getAnnotationImageUrl(text: string): string | null {
		const regex = /annotation=([A-Z0-9]+)/g;
		const match = regex.exec(text);
		if (match === null) {
			return null;
		}
		const annotationId = match[1];
		return `file://${homedir()}/Zotero/cache/library/${annotationId}.png`;
	}
}

export default Zotero;
