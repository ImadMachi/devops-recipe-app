export interface Recipe {
	label: string;
	image: string;
	url: string;
	calories: number;
	dietLabels: string[];
	cuisineType: string[];
	dishType: string[];
}

export interface User {
	name: string;
	email: string;
}
