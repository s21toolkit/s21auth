export const KC_BASE_URL =
	"https://auth.21-school.ru/auth/realms/EduPowerKeycloak"

export const KC_COOKIE_BASE_URL = `${KC_BASE_URL}/protocol/openid-connect/auth?client_id=school21&response_mode=fragment&response_type=code&scope=openid`

export const KC_TOKEN_URL = `${KC_BASE_URL}/protocol/openid-connect/token`

export const KC_REDIRECT_URI = "https://platform.21-school.ru/"

export function createKCCookieUrl(state: string, nonce: string) {
	const params = new URLSearchParams({
		state,
		nonce,
		redirect_uri: KC_REDIRECT_URI,
	})

	return `${KC_COOKIE_BASE_URL}&${params}`
}
