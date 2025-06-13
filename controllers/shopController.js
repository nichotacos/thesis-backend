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
        const { name, description, price, category } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json({ message: "Please fill all fields!" });
        }

        const imageUrl = req.file.path;

        const newShopItem = new ShopItem({
            name,
            description,
            price,
            image: imageUrl,
            category,
        });

        await ShopItem.insertOne(newShopItem);

        res.status(201).json({
            message: "Shop item created successfully",
            data: newShopItem,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating shop items", error });
    }
}

