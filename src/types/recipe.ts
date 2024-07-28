interface Recipe {
	name: string;
	isValid: (data: DataTransfer) => boolean;
	execute: (data: DataTransfer) => Promise<DataTransfer>;
}

export default Recipe;
