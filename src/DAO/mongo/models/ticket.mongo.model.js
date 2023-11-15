import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: {
        type: Number,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now 
    },
    amount: Number,
    purchaser: String
})
const ticketModel = mongoose.model("ticket", ticketSchema)

export default ticketModel