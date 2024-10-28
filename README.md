# LoriApi

A simple library for fetching information from Loritta, a popular Discord bot made by the Brazilian developer Leonardo Malaman.

## Installation

```bash
npm install loriapi
```

## Usage

### Importing the Library

To use `LoriApi`, import it into your project and initialize it with your Loritta API key.

```javascript
import LoriApi from "loriapi";
```

### Initialization

To start using the API, you need to initialize `LoriApi` with your Loritta API key.

```javascript
const api = new LoriApi({ loriKey: "lorixp_your_api_key_here" });
```

### Fetching User Data

You can fetch detailed user information from the Loritta API using the `getUserData` method, providing the user ID as a parameter. This will return an object containing the user's data, as well as relevant headers from the API response.

```javascript
api.getUserData("123170274651668480").then((userData) => {
    console.log(userData.gender); // Direct access to user data
    console.log(userData.sonhos); // Example field in the response
    console.log(userData.LorittaCluster); // Access header information directly
}).catch((error) => {
    console.error("Error fetching user data:", error.message);
});
```

### Example Response

When you use `getUserData`, you’ll receive a response like this, allowing direct access to both data and headers:

```json
{
    "id": "123170274651668480",
    "xp": 6283483,
    "sonhos": 19613336,
    "aboutMe": "\"She said 'rawr x3', so it's true love at first sight\"",
    "gender": "MALE",
    "emojiFightEmoji": "<:lori_sip:1167125644296069160>",
    "LorittaCluster": "Loritta Cluster 1 (Catalyst)",
    "LorittaTokenCreator": "123170274651668480",
    "LorittaTokenUser": "123170274651668480"
}
```

## API Reference

### `LoriApi`

#### Constructor

```typescript
new LoriApi(options: ApiOptions)
```

- `options`: An object containing the `loriKey` string, which is your Loritta API key.

#### Methods

- **`getUserData(userId: string): Promise<UserData & UserHeaders>`**  
  Fetches the user data and returns it, combining the main data fields and headers for easy access.

### Types

#### ApiOptions

Options for initializing the `LoriApi`:

```typescript
type ApiOptions = {
    loriKey: string;
};
```

#### UserData

Structure of the data returned by `getUserData`:

```typescript
interface UserData {
    id: string;
    xp: number;
    sonhos: number;
    aboutMe: string;
    gender: string;
    emojiFightEmoji: string;
}
```

#### UserHeaders

Headers returned in the response for additional context:

```typescript
interface UserHeaders {
    LorittaCluster?: string;
    LorittaTokenCreator?: string;
    LorittaTokenUser?: string;
}
```

## Error Handling

If the `loriKey` is invalid, an error will be logged, and the process will terminate. For API call errors, `getUserData` will throw an error if data cannot be fetched.