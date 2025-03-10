export const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) return "Unknown"; // Prevent errors
    return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

export const getSenderFull = (loggedUser, users) => {
    if (!users || users.length < 2) return null; // Prevent errors
    return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

export const isSameSender = (messages, currentMsg, index, userId) => {
    return (
        index < messages.length - 1 &&
        messages[index + 1]?.sender?._id !== currentMsg.sender?._id &&
        messages[index]?.sender?._id !== userId
    );
};

export const isLastMessage = (messages, index, userId) => {
    return (
        index === messages.length - 1 &&
        messages[messages.length - 1]?.sender?._id !== userId &&
        messages[messages.length - 1]?.sender?._id
    );
};

export const isSameSenderMargin = (messages, currentMsg, index, userId) => {
    if (
        index < messages.length - 1 &&
        messages[index + 1]?.sender?._id === currentMsg.sender?._id &&
        messages[index]?.sender?._id !== userId
    ) {
        return 33; // Margin to differentiate messages from different senders
    } else if (
        index < messages.length - 1 &&
        messages[index + 1]?.sender?._id !== currentMsg.sender?._id &&
        messages[index]?.sender?._id !== userId
    ) {
        return 0; // Align left
    } else {
        return userId === currentMsg.sender?._id ? "auto" : 0; // Fix right alignment
    }
};

export const isSameUser = (messages, currentMsg, index) => {
    return index > 0 && messages[index - 1]?.sender?._id === currentMsg.sender?._id;
};
