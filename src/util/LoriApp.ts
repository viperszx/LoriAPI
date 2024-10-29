import axios from "axios";

const validTransactionTypes = [
    "PAYMENT", "DAILY_REWARD", "COINFLIP_BET", "COINFLIP_BET_GLOBAL", "EMOJI_FIGHT_BET",
    "RAFFLE", "HOME_BROKER", "SHIP_EFFECT", "SPARKLYPOWER_LSX", "SONHOS_BUNDLE_PURCHASE",
    "INACTIVE_DAILY_TAX", "DIVINE_INTERVENTION", "BOT_VOTE", "POWERSTREAM", "EVENTS",
    "LORI_COOL_CARDS", "LORITTA_ITEM_SHOP", "BOM_DIA_E_CIA", "GARTICOS"
];

/**
 * Options for initializing the Loritta API.
 */
type ApiOptions = {
    loriKey: string;
};

enum UserFields {
    ID = "id",
    XP = "xp",
    DREAMS = "sonhos",
    ABOUT_ME = "aboutMe",
    GENDER = "gender",
    EMOJI_FIGHT_EMOJI = "emojiFightEmoji",
}

interface UserData {
    id: string;
    xp: number;
    sonhos: number;
    aboutMe: string;
    gender: string;
    emojiFightEmoji: string;
}

interface UserHeaders {
    LorittaCluster?: string;
    LorittaTokenCreator?: string;
    LorittaTokenUser?: string;
}

interface MessageData {
    messageId: string,
    guildId: string,
    channelId: string
}

class LoriApi {
    private loriKey: string;

    constructor(options: ApiOptions) {
        this.loriKey = options.loriKey;

        // Validate the API key
        if (this.loriKey.length < 51 || !this.loriKey.startsWith("lorixp_") || this.loriKey.length > 52) {
            console.log({
                success: false,
                error: {
                    message: "Invalid Loritta API key",
                },
            });
            process.exit(1);
        }
    }

    public async getUserData(userId: string): Promise<UserData & UserHeaders> {
        try {
            const response = await axios.get<UserData>(`https://api.loritta.website/v1/users/${userId}`, {
                headers: {
                    Authorization: this.loriKey,
                },
            });

            const completeData: UserData & UserHeaders = {
                ...response.data,
                LorittaCluster: response.headers["loritta-cluster"],
                LorittaTokenCreator: response.headers["loritta-token-creator"],
                LorittaTokenUser: response.headers["loritta-token-user"],
            };

            // Return a plain object instead of a Proxy
            return completeData;

        } catch (error) {
            console.error({
                success: false,
                error: {
                    message: "Failed to fetch user data",
                    details: error!,
                },
            });
            throw error;
        }
    }

    /**
  * Fetches user transactions with optional filters for transaction types and date ranges.
  *
  * @param userId - The ID of the user
  * @param transactionTypes - An array of allowed transaction types (e.g., ["PAYMENT", "SPARKLYPOWER_LSX"])
  * @param beforeDate - The end date for filtering transactions, in ISO string or Unix timestamp
  * @param afterDate - The start date for filtering transactions, in ISO string or Unix timestamp
  * @returns An object containing transaction data and headers
  */
    public async getUserDataTransactions(
        userId: string,
        transactionTypes?: Array<"PAYMENT" | "DAILY_REWARD" | "COINFLIP_BET" | "COINFLIP_BET_GLOBAL" | "EMOJI_FIGHT_BET" |
            "RAFFLE" | "HOME_BROKER" | "SHIP_EFFECT" | "SPARKLYPOWER_LSX" | "SONHOS_BUNDLE_PURCHASE" |
            "INACTIVE_DAILY_TAX" | "DIVINE_INTERVENTION" | "BOT_VOTE" | "POWERSTREAM" | "EVENTS" |
            "LORI_COOL_CARDS" | "LORITTA_ITEM_SHOP" | "BOM_DIA_E_CIA" | "GARTICOS">,
        beforeDate?: string | number,
        afterDate?: string | number
    ) {
        // List of valid transaction types
        const validTransactionTypes = [
            "PAYMENT", "DAILY_REWARD", "COINFLIP_BET", "COINFLIP_BET_GLOBAL", "EMOJI_FIGHT_BET",
            "RAFFLE", "HOME_BROKER", "SHIP_EFFECT", "SPARKLYPOWER_LSX", "SONHOS_BUNDLE_PURCHASE",
            "INACTIVE_DAILY_TAX", "DIVINE_INTERVENTION", "BOT_VOTE", "POWERSTREAM", "EVENTS",
            "LORI_COOL_CARDS", "LORITTA_ITEM_SHOP", "BOM_DIA_E_CIA", "GARTICOS"
        ];

        // Validate transaction types if provided
        const typesArray = transactionTypes?.join(",").split(",") ?? [];
        const invalidTypes = typesArray.filter(type => !validTransactionTypes.includes(type.trim()));

        if (invalidTypes.length > 0) {
            throw new Error(`Invalid transaction type(s): ${invalidTypes.join(", ")}. Valid types are: ${validTransactionTypes.join(", ")}`);
        }

        // Default date set to August 11, 2020 in ISO format
        const defaultDate = "2020-08-11T00:00:00.000Z";

        // Convert Unix timestamps to ISO strings if needed
        const formatDate = (date?: string | number) =>
            typeof date === "number" ? new Date(date * 1000).toISOString() : date;

        const params = {
            limit: 10,
            offset: 0,
            transactionTypes: typesArray.join(",") || validTransactionTypes.join(","),
            beforeDate: formatDate(beforeDate) || defaultDate,
            afterDate: formatDate(afterDate) || defaultDate,
        };

        try {
            const response = await axios.get(`https://api.loritta.website/v1/users/${userId}/transactions`, {
                headers: {
                    Authorization: this.loriKey,
                },
                params,
            });

            return {
                transactions: response.data.transactions,
                headers: {
                    LorittaCluster: response.headers["loritta-cluster"],
                    LorittaTokenCreator: response.headers["loritta-token-creator"],
                    LorittaTokenUser: response.headers["loritta-token-user"],
                },
                paging: response.data.paging,
            };

        } catch (error) {
            console.error({
                success: false,
                error: {
                    message: "Failed to fetch user transactions",
                    details: error,
                },
            });
            throw error;
        }
    }
}

export { LoriApi };