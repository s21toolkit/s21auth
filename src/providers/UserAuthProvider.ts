import { fetchAccessToken, type fetchApiToken } from "@/core/flow"
import type { AuthProvider } from "./AuthProvider"
import { TokenAuthProvider } from "./TokenAuthProvider"

type TokenFactory = typeof fetchAccessToken | typeof fetchApiToken

/**
 * Provides auth with user credentials, stores credentials and requests new tokens upon expiration. Does not use refresh_token grant.
 * Can be used for both API and user tokens by passing the corresponding token factory to the constructor.
 */
export class UserAuthProvider implements AuthProvider {
	#username
	#password

	#tokenAuthProvider?: TokenAuthProvider

	fetchToken

	constructor(
		username: string,
		password: string,
		tokenFactory: TokenFactory = fetchAccessToken,
	) {
		this.#username = username
		this.#password = password
		this.fetchToken = tokenFactory
	}

	async getContextHeaders() {
		await this.tryRefresh()

		// biome-ignore lint/style/noNonNullAssertion: always non-nullable after tryRefresh
		return await this.#tokenAuthProvider!.getContextHeaders()
	}

	async getAccessToken() {
		await this.tryRefresh()

		// biome-ignore lint/style/noNonNullAssertion: always non-nullable after tryRefresh
		return await this.#tokenAuthProvider!.getAccessToken()
	}

	async tryRefresh() {
		if (this.#tokenAuthProvider && !this.#tokenAuthProvider.isExpired) {
			return
		}

		await this.refresh()
	}

	async refresh() {
		const tokenResponse = await this.fetchToken(
			this.#username,
			this.#password,
		)

		const tokenAuthProvider = new TokenAuthProvider(tokenResponse.accessToken)

		this.#tokenAuthProvider = tokenAuthProvider
	}

	get tokenAuthProvider() {
		return this.#tokenAuthProvider
	}
}
