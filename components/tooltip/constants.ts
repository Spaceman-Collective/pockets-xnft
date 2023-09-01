// NOTE: Temp organization of tip constants
// Define by category in a const
// then deconstruct in the TIP variable
// TIP variable shows all variables without organization (flat)
// benefit: can refactor without renaming a bunch of variables

const resource = {
	RESOURCE_FIELDS:
		"Initiate and complete work to extract resources from designated fields",
}

export const TIP = {
	...resource,
}
