const { eq, desc } = require("drizzle-orm");
const {db,messagesTable} = require("../tables");
const { validMessage, messagesToAdmin, singleMessageToAdmin } = require("./messages.utils");


class MessagesController {
    static async createMessage(req, res) {
        try {
            if(!validMessage(req.body)) {
                return res.status(400).json({ message: "Invalid message data", data:[] });
            }

            const { name, email, phone_number, subject, location, message } = req.body;
            await db.insert(messagesTable).values({
                name,
                email,
                phone_number,
                subject,
                location,
                message
            })

            return res.status(201).json({ message: "Message created successfully", data:[] });
        } catch (error) {
            return res.status(500).json({ message: "An error occurred while creating the message", data:[] });
        }
    }


    static async getMessages(req, res) {
        try {
            const messages = await db.select().from(messagesTable).orderBy(desc(messagesTable.created_at)).where(eq(messagesTable.isDeleted, false));
            
            if(messages.length === 0) {
                return res.status(200).json({ message: "No messages found", data:[] });
            }

            return res.status(200).json({ message: "Messages fetched successfully", data:messagesToAdmin(messages) });

        } catch (error) {
            console.error("Error fetching messages:", error);
            return res.status(500).json({ message: "An error occurred while fetching messages", data:[] });
        }
    }


    static async deleteMessage(req, res) {
        try {
            if(!req.params.id) {
                return res.status(400).json({ message: "Message ID is required", data:[] });
            }

            const messageId = parseInt(req.params.id);
            //fetch it
            const message = await db.select().from(messagesTable).where(eq(messagesTable.id, messageId)).limit(1);

            if(message.length === 0) {
                return res.status(404).json({ message: "Message not found", data:[] });
            }

            await db.update(messagesTable).set({ isDeleted: true }).where(eq(messagesTable.id, messageId));

            return res.status(200).json({ message: "Message deleted successfully", data:[] });
        } catch (error) {
            return res.status(500).json({ message: "An error occurred while deleting the message", data:[] });
        }
    }



    static async markMessageAsRead(req, res) {
    try {
        if(!req.params.id) {
            return res.status(400).json({ message: "Message ID is required", data:[] });
        }

        const messageId = parseInt(req.params.id);
        //fetch it
        const message = await db.select().from(messagesTable).where(eq(messagesTable.id, messageId)).limit(1);

        if(message.length === 0) {
            return res.status(404).json({ message: "Message not found", data:[] });
        }

        await db.update(messagesTable).set({ isRead: true }).where(eq(messagesTable.id, messageId));

        return res.status(200).json({ message: "Message marked as read successfully", data:[] });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while marking the message as read", data:[] });
    }
    }
}


module.exports = MessagesController;