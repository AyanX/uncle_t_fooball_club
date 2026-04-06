
const validMessage = message => {
    return message.name && message.email && 
    message.phone_number && message.subject &&
    message.location && message.message
}

const messagesToAdmin= messages => {
    return messages.map(message => ({
        id: message.id,
        name: message.name,
        email: message.email,
        phone_number: message.phone_number,
        subject: message.subject,
        location: message.location,
        isRead: message.isRead,
        message: message.message,
        created_at: message.created_at
    }))
}

const singleMessageToAdmin = message => {
    return {
        id: message.id,
        name: message.name,
        email: message.email,
        phone_number: message.phone_number,
        subject: message.subject,
        location: message.location,
        isRead: message.isRead,
        message: message.message,
        created_at: message.created_at
    }
}


module.exports = {
    validMessage,
    messagesToAdmin,
    singleMessageToAdmin
}