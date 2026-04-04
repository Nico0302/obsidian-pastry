/**
 * Recipes are executed upon paste or drop events or by other recipes.
 */
interface Recipe {
	name: string;
	isValid: (data: DataTransfer) => boolean;
	execute: (data: DataTransfer) => Promise<DataTransfer>;
}

export default Recipe;
