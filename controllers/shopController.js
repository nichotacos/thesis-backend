import ShopItem from "../models/ShopItem.js";



export async function getShop(req, res) {
    try {
        const shopItems = await ShopItem.find().lean();

        if (!shopItems) {
            return res.status(404).json({ message: "No shop items found" });
        }

        res.status(200).json({
            shopItems: shopItems,
            message: "Shop items fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching shop items", error });
    }
}

export async function createShopItem(req, res) {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Please provide an array of items." });
        }

        const invalidItems = items.filter(item =>
            !item.name || !item.description || !item.price || !item.category || !item.image
        );

        if (invalidItems.length > 0) {
            return res.status(400).json({ message: "Please fill all fields!" });
        }

        const createdItems = await ShopItem.insertMany(items);

        res.status(201).json({
            message: `${createdItems.length} shop item(s) created successfully`,
            data: createdItems
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating shop items", error });
    }
}