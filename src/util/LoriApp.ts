import axios from "axios";

/**
 * Options for initializing the Loritta API.
 *
 * @typedef {Object} ApiOptions
 * @property {string} loriKey - The Loritta API key.
 */
type ApiOptions = {
    loriKey: string;
};

/**
 * Enum representing the possible fields available in user data.
 */
enum UserFields {
    ID = "id",
    XP = "xp",
    DREAMS = "sonhos",
    ABOUT_ME = "aboutMe",
    GENDER = "gender",
    EMOJI_FIGHT_EMOJI = "emojiFightEmoji",
}

/**
 * Interface representing the structure of user data.
 */
interface UserData {
    id: string;
    xp: number;
    sonhos: number;
    aboutMe: string;
    gender: string;
    emojiFightEmoji: string;
}

/**
 * Interface representing the headers of the response.
 */
interface UserHeaders {
    LorittaCluster?: string;
    LorittaTokenCreator?: string;
    LorittaTokenUser?: string;
}

/**
 * Class representing the Loritta API.
 */
class LoriApi {
    private loriKey: string;

    /**
     * Initializes the Loritta API with the provided options.
     *
     * @param {ApiOptions} options - The options for initializing the API.
     */
    constructor(options: ApiOptions) {
        this.loriKey = options.loriKey;

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

    /**
     * Fetches user data from the Loritta API and returns a proxy object.
     *
     * @param {string} userId - The ID of the user to fetch data for.
     * @returns {Promise<UserData & UserHeaders>} - The user data and headers in a single proxy object.
     */
    public async getUserData(userId: string): Promise<UserData & UserHeaders> {
        try {
            const response = await axios.get<UserData>(`https://api.loritta.website/v1/users/${userId}`, {
                headers: {
                    Authorization: this.loriKey,
                },
            });

            // Combine the response data and selected headers into one object
            const completeData: UserData & UserHeaders = {
                ...response.data,
                LorittaCluster: response.headers["loritta-cluster"],
                LorittaTokenCreator: response.headers["loritta-token-creator"],
                LorittaTokenUser: response.headers["loritta-token-user"],
            };

            // Return a proxy that allows direct access to all properties
            return new Proxy(completeData, {
                get(target, prop) {
                    if (prop in target) {
                        return target[prop as keyof typeof target];
                    }
                    throw new Error(`Property ${String(prop)} does not exist on user data.`);
                },
            });
        } catch (error) {
            console.error({
                success: false,
                error: {
                    message: "Failed to fetch user data",
                    // @ts-ignore
                    details: error.response?.data || error.message,
                },
            });
            throw error;
        }
    }
}

export { LoriApi, UserData, UserFields, ApiOptions, UserHeaders};