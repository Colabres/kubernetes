const { connect, StringCodec } = require("nats");

const NATS_URL =
    process.env.NATS_URL ||
    "nats://my-nats.nats.svc.cluster.local:4222";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

const NATS_SUBJECT = "todos.events";
const NATS_QUEUE = "broadcasters";

const stringCodec = StringCodec();

const sendWebhook = async (message) => {
    if (!WEBHOOK_URL) {
        console.error("WEBHOOK_URL is not configured");
        return;
    }

    const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: "bot",
            message
        })
    });

    if (!response.ok) {
        throw new Error(
            `Webhook request failed: ${response.status}`
        );
    }

    console.log(`Webhook message sent: ${message}`);
};

const startBroadcaster = async () => {
    const natsConnection = await connect({
        servers: NATS_URL
    });

    console.log(`Connected to NATS at ${NATS_URL}`);

    const subscription = natsConnection.subscribe(
        NATS_SUBJECT,
        {
            queue: NATS_QUEUE
        }
    );

    console.log(
        `Subscribed to ${NATS_SUBJECT} using queue group ${NATS_QUEUE}`
    );

    for await (const message of subscription) {
        try {
            const event = JSON.parse(
                stringCodec.decode(message.data)
            );

            console.log("Todo event received:");
            console.log(event);

            await sendWebhook(event.message);
        } catch (error) {
            console.error(
                "Failed to process NATS message:",
                error.message
            );
        }
    }
};

startBroadcaster()
    .catch((error) => {
        console.error(
            "Broadcaster failed:",
            error.message
        );

        process.exit(1);
    });