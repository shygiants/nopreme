import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

const artistSchema = new mongoose.Schema({
    name: String,
    aliases: [String],
    description: String,
    isGroup: Boolean,
    birthday: Date,
    belongsTo: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Artist' 
    }],
});

export const Artist = mongoose.model('Artist', artistSchema);

export function getArtistById(id) {
    return Artist.findById(id).exec();
}

export function getArtistByName(name) {
    return Artist.findOne({name}).exec();
}

export function getArtistsBelongsTo(artistId) {
    return Artist.find({belongsTo: artistId}).exec();
}