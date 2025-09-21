import redisConnection from "../redis/redisConnection";
type notificationPost = {
    userId: string
    title: string
    message: string
    date: string
    type: string
}
type notificationGet = {
    userId: string
}
const logPrefix = "HELPERS:NOTIFICATION";
const postNotification = async ({ userId, title, message, type, date }: notificationPost) => {
    try {
        console.log(`${logPrefix} init post`, JSON.stringify({ userId, title, message, type, date }));
        const key = `notification:${userId}`;
        let formartedData = <any>[];
        const rawContent = await redisConnection({ type: "get", key, value: "", time: null });
        if (rawContent) {
            formartedData = JSON.parse(rawContent);
        }

        formartedData.push({ title, message, type, date });
        await redisConnection({ type: "set", key, value: JSON.stringify(formartedData), time: null });
        return { status: true, data: {}, message: "successful" };
    } catch (error: any) {
        console.log(`${logPrefix} Error ===> `, error.message, error.stack);
        return { status: false, data: {}, message: "Notification error, please try again" }
    }
}

const getNotification = async ({ userId }: notificationGet) => {
    try {
        console.log(`${logPrefix} init get`, JSON.stringify({ userId }));
        const key = `notification:${userId}`;
        let formartedData = [];
        const rawContent = await redisConnection({ type: "get", key, value: "", time: null });
        if (rawContent) {
            formartedData = JSON.parse(rawContent);
        }
        return { status: true, data: {}, message: "successful" };
    } catch (error: any) {
        console.log(`${logPrefix} Error ===> `, error.message, error.stack);
        return { status: false, data: {}, message: "Notification error, please try again" }
    }
}

export {
    postNotification,
    getNotification
}