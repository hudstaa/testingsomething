import Dexie from "dexie";

// Define a conversation interface
export interface Conversation {
    id?: number;
    topic: string;
    title: string | undefined;
    createdAt: Date;
    updatedAt: Date;
}

// Define a message interface
export interface Message {
    id?: number;
    inReplyToID: string;
    conversationTopic: string;
    xmtpID: string;
    senderAddress: string;
    sentByMe: boolean;
    sentAt: Date;
    contentType: {
        authorityId: string;
        typeId: string;
        versionMajor: number;
        versionMinor: number;
    };
    content: any;
    metadata?: { [key: string]: [value: string] };
    isSending: boolean;
}

// Define a message attachment interface
export interface MessageAttachment {
    id?: number;
    messageID: number;
    filename: string;
    mimeType: string;
    data: Uint8Array;
}

// Define a message reaction interface
export interface MessageReaction {
    id?: number;
    reactor: string;
    messageXMTPID: string;
    name: string;
}

// Create a class for the database
class DB extends Dexie {
    // Define tables for the database
    conversations!: Dexie.Table<Conversation, number>;
    messages!: Dexie.Table<Message, number>;
    attachments!: Dexie.Table<MessageAttachment, number>;
    reactions!: Dexie.Table<MessageReaction, number>;

    constructor() {
        super("DB");
        this.version(1).stores({
            // Define the structure and indexes for each table
            conversations: `
        ++id,
        topic,
        title,
        createdAt,
        updatedAt
        `,
            messages: `
        ++id,
        [conversationTopic+inReplyToID],
        inReplyToID,
        conversationTopic,
        xmtpID,
        senderAddress,
        sentByMe,
        sentAt,
        contentType,
        content
        `,
            attachments: `
        ++id,
        messageID,
        filename,
        mimeType,
        data
      `,
            reactions: `
        ++id,
        [messageXMTPID+reactor+name],
        messageXMTPID,
        reactor,
        name
      `,
        });
    }
}

// Initialize the database and export it
const db = new DB();
export default db;