import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

import {getKakaoUserInfo} from '../../utils';

export const MethodEnum = {
    DIRECT: 'Direct',
    POST: 'Post',
    DONTCARE: 'Dontcare',
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    openChatLink: {
        type: String,
    },
    kakao: {
        id: {
            type: String,
            index: true,
        },
        accessToken: String,
    },
    tutorialComplete: {
        type: Boolean,
        default: false,
    },
    admin: {
        type: Boolean,
        defualt: false,
    },
    regions: {
        type: [Schema.Types.ObjectId],
        ref: 'Region',
        index: true,
    },
    method: {
        type: String,
        enum: Object.values(MethodEnum),
        default: MethodEnum.DONTCARE,
        index: true,
    },
});

export const User = mongoose.model('User', userSchema);

export function getUserById(id) {
    return User.findById(id).exec();
}

export function getUserByKakaoId(kakaoId) {
    return User.findOne({'kakao.id': kakaoId}).exec();
}

export function addUser(name, accessToken) {
    return getKakaoUserInfo(accessToken).then(({id}) => {
        return getUserByKakaoId(id).then(user => {
            if (user !== null) {
                throw new Error('User already exists');
            }

            return new User({name, kakao: {
                accessToken, id,
            }}).save().then(({_id}) => _id);
        });
    });
}

export function modifyUser(id, {name, openChatLink, regions, method}) {
    const update = {name, openChatLink, regions, method};

    for (let [k, v] of Object.entries(update)) {
        if (v === undefined || v === null) {
            delete update[k];
        }
    }

    if (name !== undefined && name !== null) {
        return User.findOne({name}).exec().then(user => {
            if (user && user._id.toString() !== id) {
                return null;
            }

            return User.findByIdAndUpdate(id, update, {useFindAndModify: true}).exec().then(({_id}) => _id);
        });
    }

    return User.findByIdAndUpdate(id, update, {useFindAndModify: true}).exec().then(({_id}) => _id);
}

export function isAdmin(id) {
    return getUserById(id).then(user => {
        return user.admin
    });
}

export function nicknameExists(nickname) {
    return User.findOne({name: nickname}).exec().then(user => user !== null);
}
