import axios, { Method } from "axios"
axios.defaults.baseURL = "https://api.pockets.gg"

export const apiRequest = async <T>(
	method: Method,
	path: string,
	paramsOrData?: any,
): Promise<T> => {
	const errorMessage = `Server Error on ${method} ${path}`
	try {
		let response
		if (method === "get") {
			response = await axios.get(path, { params: paramsOrData })
		} else {
			response = await axios.post(path, paramsOrData)
		}

		if (response?.status === 200) {
			return response.data as T
		} else {
			console.error(`${response?.data?.message || errorMessage}:`, response)
			throw new Error(response?.data?.message || errorMessage)
		}
	} catch (error) {
		console.error(`${errorMessage}:`, error)
		throw error
	}
}

export * from "./accounts"
export * from "./character"
export * from "./faction"
export * from "./public"
export * from "./resourceField"
export * from "./misc"
export * from "./wallet"
