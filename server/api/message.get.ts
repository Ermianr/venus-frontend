import { getMessagesByChannel } from "../db/prepared";

export default defineEventHandler(async () => {
    return await getMessagesByChannel.execute({ room: "global" });
});
