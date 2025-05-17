import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ["Cosmetic", "Streak", "Boost"],
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const ShopItem = mongoose.model("ShopItem", shopItemSchema);

export default ShopItem;