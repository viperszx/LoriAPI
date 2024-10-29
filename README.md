# LoriApi

A powerful, straightforward library to interact with the Loritta API, a well-known Discord bot developed by Brazilian developer MrPowerGamerBR. With `LoriApi`, you can easily retrieve detailed user data and transaction history directly from the Loritta API.

## Installation

Install `LoriApi` via npm:

```bash
npm install loriapi
```

## Usage

### Importing the Library

Import the `LoriApi` module into your project:

```javascript
import LoriApi from "loriapi";
```

### Initialization

To initialize the `LoriApi` class, create an instance with your Loritta API key. Ensure your API key begins with `lorixp_` and has the correct length (51-52 characters), or the instance will not initialize properly.

```javascript
const api = new LoriApi({ loriKey: "lorixp_your_key_here" });
```

## Fetching User Data

Use the `getUserData` method to retrieve comprehensive information about a user, including optional metadata in the headers. This method returns a combined object with both the data and the relevant header fields.

```javascript
api.getUserData("123170274651668480").then((userData) => {
    console.log(userData.id);            // User ID
    console.log(userData.sonhos);        // User "Dreams" count
    console.log(userData.gender);        // User's gender
    console.log(userData.LorittaCluster); // Access to response headers
}).catch((error) => {
    console.error("Error fetching user data:", error.message);
});
```

### Example Response from `getUserData`

A typical response from `getUserData` provides fields for both user data and header metadata:

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

## Fetching User Transactions

Retrieve a user's transaction history with the `getUserDataTransactions` method. This method allows for optional filters by transaction type and date range.

### Example Usage of `getUserDataTransactions`

```javascript
api.getUserDataTransactions("123170274651668480", ["PAYMENT", "DAILY_REWARD"], "2024-01-01T00:00:00.000Z", "2024-12-31T23:59:59.999Z")
    .then((transactionData) => {
        console.log(transactionData.transactions); // Array of transactions
        console.log(transactionData.paging);       // Paging information
        console.log(transactionData.headers);      // Header metadata
    })
    .catch((error) => {
        console.error("Error fetching user transactions:", error.message);
    });
```

### Parameters for `getUserDataTransactions`

- `userId`: The Discord user ID.
- `transactionTypes` (optional): An array of specific transaction types (e.g., `["PAYMENT", "EVENTS"]`).
- `beforeDate` (optional): Sets an end date (ISO string or Unix timestamp).
- `afterDate` (optional): Sets a start date (ISO string or Unix timestamp).

#### List of Valid Transaction Types

The following transaction types are supported:

- `"PAYMENT"`, `"DAILY_REWARD"`, `"COINFLIP_BET"`, `"COINFLIP_BET_GLOBAL"`, `"EMOJI_FIGHT_BET"`, `"RAFFLE"`, `"HOME_BROKER"`, `"SHIP_EFFECT"`, `"SPARKLYPOWER_LSX"`, `"SONHOS_BUNDLE_PURCHASE"`, `"INACTIVE_DAILY_TAX"`, `"DIVINE_INTERVENTION"`, `"BOT_VOTE"`, `"POWERSTREAM"`, `"EVENTS"`, `"LORI_COOL_CARDS"`, `"LORITTA_ITEM_SHOP"`, `"BOM_DIA_E_CIA"`, `"GARTICOS"`

## API Reference

### `LoriApi`

#### Constructor

```typescript
new LoriApi(options: ApiOptions)
```

- `options`: An object containing the `loriKey` string, which is your Loritta API key.

#### Methods

- **`getUserData(userId: string): Promise<UserData & UserHeaders>`**  
  Fetches user data, returning combined data fields and headers.
- **`getUserDataTransactions(userId: string, transactionTypes?: string[], beforeDate?: string | number, afterDate?: string | number): Promise<TransactionData>`**  
  Fetches user transactions with optional filters for transaction types and date ranges.

### Types

#### `ApiOptions`

Initialization options for `LoriApi`:

```typescript
type ApiOptions = {
    loriKey: string;
};
```

#### `UserData`

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

#### `UserHeaders`

Headers returned in the `getUserData` response:

```typescript
interface UserHeaders {
    LorittaCluster?: string;
    LorittaTokenCreator?: string;
    LorittaTokenUser?: string;
}
```

#### `TransactionData`

Structure for the data returned by `getUserDataTransactions`:

```typescript
interface TransactionData {
    transactions: Array<any>;
    headers: UserHeaders;
    paging: any;
}
```

### Error Handling

> If the `loriKey` is invalid, the process will terminate with an error message indicating the invalid key format. Errors encountered during API calls will be thrown with a descriptive error message for debugging.
