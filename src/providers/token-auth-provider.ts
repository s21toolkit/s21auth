import {
	type ContextHeaders,
	extractPayload,
	fetchContextHeaders,
	isExpired,
} from "@/core"
import type { AuthProvider } from "@/providers/auth-provider"

/**
 * Single token auth provider, does not refresh tokens
 */
export class TokenAuthProvider implements AuthProvider {
	readonly tokenPayload

	constructor(
		readonly accessToken: string,
		public contextHeaders?: ContextHeaders,
	) {
		this.tokenPayload = Object.freeze(extractPayload(accessToken))
	}

	async getContextHeaders() {
		if (this.contextHeaders) {
			return this.contextHeaders
		}

		const accessToken = await this.getAccessToken()

		const contextHeaders = await fetchContextHeaders(accessToken)

		this.contextHeaders = contextHeaders

		return contextHeaders
	}

	async getAccessToken() {
		await this.assertValid()

		return this.accessToken
	}

	assertValid() {
		if (this.isExpired) {
			throw new Error("Token expired")
		}
	}

	get isExpired() {
		return isExpired(this.tokenPayload.exp)
	}
}
