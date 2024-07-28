import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import RecipeManager from "utils/recipe-manager";

interface PastrySettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: PastrySettings = {
	mySetting: "default",
};

export default class Pastry extends Plugin {
	settings: PastrySettings;

	async onload() {
		await this.loadSettings();

		const recipeManager = new RecipeManager(this.app);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerDomEvent(
			document,
			"paste",
			(evt: ClipboardEvent) => {
				if (!evt.isTrusted || evt.clipboardData === null) {
					return;
				}

				const recipe = recipeManager.findRecipe(evt.clipboardData);
				if (recipe === null) {
					return;
				}

				evt.preventDefault();

				try {
					recipe.execute(evt.clipboardData).then((clipboardData) => {
						const newEvent = new ClipboardEvent(evt.type, {
							clipboardData,
							bubbles: evt.bubbles,
							cancelable: evt.cancelable,
							composed: evt.composed,
						});

						evt.target?.dispatchEvent(newEvent);
					});
				} catch (error) {
					new Notice(`Error: ${error}`);
				}
			},
			{ capture: true }
		);

		this.registerDomEvent(
			document,
			"drop",
			(evt: DragEvent) => {
				if (!evt.isTrusted || evt.dataTransfer === null) {
					return;
				}

				const recipe = recipeManager.findRecipe(evt.dataTransfer);
				if (recipe === null) {
					return;
				}

				evt.preventDefault();

				try {
					recipe.execute(evt.dataTransfer).then((dataTransfer) => {
						const newEvent = new DragEvent(evt.type, {
							dataTransfer,
							bubbles: evt.bubbles,
							cancelable: evt.cancelable,
							composed: evt.composed,
							button: evt.button,
							buttons: evt.buttons,
							clientX: evt.clientX,
							clientY: evt.clientY,
							movementX: evt.movementX,
							movementY: evt.movementY,
							relatedTarget: evt.relatedTarget,
							screenX: evt.screenX,
							screenY: evt.screenY,
							detail: evt.detail,
							view: evt.view,
						});

						evt.target?.dispatchEvent(newEvent);
					});
				} catch (error) {
					new Notice(`Error: ${error}`);
				}
			},
			{ capture: true }
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: Pastry;

	constructor(app: App, plugin: Pastry) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
