# s21auth 📦🤰

Библиотека авторизации/аутентификации для платформы edu.21-school.ru.

```sh
npm install @s21toolkit/auth
```

## Использование

Получение токена:

```ts
import { fetchAccessToken } from "@s21toolkit/auth"

const response = await fetchAccessToken("username", "p4ssw0rd")

console.log(response.accessToken)
```

Получение контекстных заголовков (нужны для большей части запросов):

```ts
import { fetchContextHeaders } from "@s21toolkit/auth"

const headers = await fetchContextHeaders(accessToken)
```

Автоматическое обновление токена:

```ts
import { UserAuthProvider, S21_GQL_API_URL, getAuthHeaders } from "@s21toolkit/auth"

const auth = new UserAuthProvider("username", "p4ssw0rd")

const response = await fetch(S21_GQL_API_URL, {
   method: "POST",
   headers: {
      ...await getAuthHeaders(auth)
   },
   body: JSON.stringify({ query: "..." })
})
```
