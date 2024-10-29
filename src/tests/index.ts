import { LoriApi } from "../index";

const loritta = new LoriApi({ loriKey: "lorixp_xxx" });

async function test() {
    try {
        const t = await loritta.getUserData("197501878399926272");
        console.log(`${t.gender ?? "N/A"}, ${t.emojiFightEmoji ?? "N/A"}, ${t.aboutMe ?? "N/A"}, ${t.sonhos ?? "0"}, ${t.xp ?? "0"},`);
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}

test();