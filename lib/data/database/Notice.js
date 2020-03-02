import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

const noticeSchema = new mongoose.Schema({
    title: String,
    img: String,
    text: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    link: {
        url: String,
        text: String,
    }, 
    invisible: {
        type: Boolean,
        default: true,
    },
    atHome: {
        type: Boolean,
        default: false,
    },
});

export const Notice = mongoose.model('Notice', noticeSchema);

export function getNoticeById(id) {
    return Notice.findById(id).exec();
}

export function getLatestHomeNotice() {
    return Notice.findOne({
        invisible: false, 
        atHome: true
    }).sort({
        createdAt: -1
    }).limit(1).exec();
}

export function getNotices(limit=5) {
    return Notice.find({
        invisible: false,
    }).sort({
        createdAt: -1,
    }).limit(limit).exec();
}
