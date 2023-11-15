export default class ChatMessageDTO {
    constructor(chatMessage) {
        this.user = chatMessage?.user ?? "";
        this.message = chatMessage?.message ?? "";
    }
}
