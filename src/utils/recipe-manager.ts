import { App } from "obsidian";
import HtmlAssets from "recipes/html-assets";
import MarkdownAssets from "recipes/markdown-assets";
import Zotero from "recipes/zotero";
import Recipe from "types/recipe";

export default class RecipeManager {
	_recipes: Recipe[];
	_app: App;

	constructor(app: App) {
		this._recipes = [
			new Zotero(app),
			new HtmlAssets(app),
			new MarkdownAssets(app),
		];
		this._app = app;
	}

	findRecipe(data: DataTransfer): Recipe | null {
		for (const recipe of this._recipes) {
			if (recipe.isValid(data)) {
				return recipe;
			}
		}

		return null;
	}
}
