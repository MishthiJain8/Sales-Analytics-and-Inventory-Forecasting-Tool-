import mongoose from 'mongoose';

const ProductDataSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        // e.g. "Jan 2024" — parsed from CSV Date column
        date: {
            type: String,
            required: true,
        },
        // Raw numeric values from CSV
        revenue: {
            type: Number,
            required: true,
            min: 0,
        },
        unitsSold: {
            type: Number,
            required: true,
            min: 0,
        },
        cost: {
            type: Number,
            required: true,
            min: 0,
        },
        // Computed server-side: ((revenue - cost) / revenue) * 100
        profitMargin: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Compound unique index: one record per product per date period
ProductDataSchema.index({ productName: 1, date: 1 }, { unique: true });

const ProductData =
    mongoose.models.ProductData ||
    mongoose.model('ProductData', ProductDataSchema);

export default ProductData;
