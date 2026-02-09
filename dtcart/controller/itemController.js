const Item = require('../models/Item');

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        // await Item.insertMany([
        //     {
        //         id: 'coffee01',
        //         name: 'Coffee',
        //         price: 2.5,
        //         quantity: 100,
        //         img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93'
        //     },
        //     {
        //         id: 'tea01',
        //         name: 'Tea',
        //         price: 1.8,
        //         quantity: 100,
        //         img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574'
        //     }
        // ])

        res.status(200).json({
            success: true,
            items

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



exports.createItem = async (req, res) => {
    try {
        const item = await Item.create(req.body);
        res.status(201).json({
            success: true,
            item
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
