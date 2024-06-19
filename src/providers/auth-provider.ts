import type { ContextHeaders } from "@/core/context"

export type AuthProvider = {
	getContextHeaders(): Promise<ContextHeaders>
	getAccessToken(): Promise<string>
}

export async function getAuthHeaders(credentials: AuthProvider) {
	const accessToken = await credentials.getAccessToken()
	const contextHeaders = await credentials.getContextHeaders()

	return {
		Authorization: `Bearer ${accessToken}`,
		...contextHeaders,
	}
}
