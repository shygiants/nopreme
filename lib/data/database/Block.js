import mongoose, { SchemaType } from 'mongoose';
import { getUserById } from './User';
const Schema = mongoose.Schema;

const blockSchema = new mongoose.Schema({
    blocker: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    blocked: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    exp: {
        type: Date,
        default: () => Date.now() + 1000 * 60 * 60 * 24,
    },
});

export const Block = mongoose.model('Block', blockSchema);

export async function getBlockByIds(blocker, blocked) {
    return await Block.findOne({blocker, blocked}).exec();
}

export async function addBlock(blocker, blocked) {
    const block = await getBlockByIds(blocker, blocked);

    if (block !== null) {
        block.exp = Date.now() + 1000 * 60 * 60 * 24;
        const saved = await block.save();

        return saved._id;
    } else {
        const users = await Promise.all([blocker, blocked].map(getUserById));

        if (users.some(user => user === null))
            return null;

        const newBlock = await new Block({blocker, blocked}).save();

        return newBlock._id;
    }
}

export async function getBlockedUsers(blocker) {
    const blocks = await Block.find({blocker, exp: {$gte: Date.now()}}).exec();

    return blocks.map(block => block.blocked);
}