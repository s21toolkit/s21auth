import { fetchAccessToken } from "@/core/flow"
import type { AuthProvider } from "./AuthProvider"
import { TokenAuthProvider } from "./TokenAuthProvider"

export class UserAuthProvider implements AuthProvider {
	#username
	#password

	#tokenAuthProvider?: TokenAuthProvider

	constructor(username: string, password: string) {
		this.#username = username
		this.#password = password
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
		const tokenResponse = await fetchAccessToken(
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
