import { S21_GQL_API_URL, S21_REST_API_URL } from "@/constants"

export type ContextHeaders = {
	"X-EDU-SCHOOL-ID": string
	"X-EDU-PRODUCT-ID": string
	"X-EDU-ROUTE-INFO": string
	"X-EDU-ORG-UNIT-ID": string
}

type ContextInfo = {
	success: boolean

	data: {
		contextHeaders: ContextHeaders
	}

	error: unknown
}

export const CONTEXT_INFO_URL = `${S21_REST_API_URL}/edu-context/context-info`

export async function fetchContextHeaders(
	accessToken: string,
): Promise<ContextHeaders> {
	const response = await fetch(S21_GQL_API_URL, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	if (!response.ok) {
		throw new Error(`Failed to fetch context headers: ${response.statusText}`)
	}

	const data = (await response.json()) as ContextInfo

	if (!data.success || data.error) {
		throw new Error("Context headers request returned error")
	}

	return data.data.contextHeaders
}
