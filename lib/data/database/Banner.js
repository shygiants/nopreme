import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

const bannerSchema = new mongoose.Schema({
    texts: {
        type: [String],
    },
    link: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    from: {
        type: Date,
    },
    to: {
        type: Date,
    },
});

export const Banner = mongoose.model('Banner', bannerSchema);

export async function getBannerById(id) {
    return await Banner.findById(id).exec();
}

export async function getCurrentBanner() {
    const curr = Date.now();
    
    return await Banner.findOne({
        from: {
            $lte: curr,
        },
        to: {
            $gte: curr,
        }
    }).exec();
}