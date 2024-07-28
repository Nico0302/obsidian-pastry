import { App, normalizePath } from "obsidian";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";

class AttachmentUtils {
	_app: App;

	constructor(app: App) {
		this._app = app;
	}

	async copyIntoAttachmentsIfLocal(
		url: string,
		sourcePath?: string
	): Promise<string> {
		if (!url.startsWith("file://")) {
			return url;
		}

		return this.copyIntoAttachments(url, sourcePath);
	}

	async copyIntoAttachments(
		url: string,
		sourcePath?: string
	): Promise<string> {
		const attachmentPath =
			await this._app.fileManager.getAvailablePathForAttachment(
				fileURLToPath(url),
				sourcePath
			);
		if (attachmentPath === null) {
			throw new Error(`Attachment path not found: ${attachmentPath}`);
		}

		const path = normalizePath(attachmentPath);

		const buffer = await readFile(fileURLToPath(url));

		await this._app.vault.createBinary(path, buffer);

		return path;
	}
}

export default AttachmentUtils;
