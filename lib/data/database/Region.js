import mongoose, { SchemaType } from 'mongoose';
const Schema = mongoose.Schema;

const regionSchema = new mongoose.Schema({
    stateCode: String,
    stateName: String,
    cityCode: String,
    cityName: String,
    parentCityCode: String,
    parentCityName: String,
});

regionSchema.virtual('displayName').get((value, virtual, doc) => {
    const names = [];

    if (doc.stateName) {
        names.push(doc.stateName);
    }

    if (doc.parentCityName) {
        names.push(doc.parentCityName);
    } 

    if (doc.cityName) {
        names.push(doc.cityName);
    }

    if (names.length === 0) {
        return undefined;
    }

    return names.join(' ');
})

export const Region = mongoose.model('Region', regionSchema);

export function getRegionById(id) {
    return Region.findById(id).exec();
}

export function getStates() {
    return Region.find({cityCode: {$exists: false}}).sort({stateCode: 1}).exec();
}

export function getCities(stateCode) {
    return Region.find({
        stateCode, 
        parentCityCode: {$exists: false}, 
        cityCode: {$exists: true},
    }).sort({cityCode: 1}).exec();
}

export function getChildCities(stateCode, cityCode) {
    if (stateCode && cityCode) {
        return Region.find({stateCode, parentCityCode: cityCode}).sort({cityCode: 1}).exec();
    } else {
        return Promise.resolve([]);
    }
}

export function getRegionByCode(code) {
    let stateCode, cityCode;
    if (code.length >= 2) {
        stateCode = code.slice(0, 2);

        if (code.length === 5)
            cityCode = code.slice(2, 5);
        else
            cityCode = {$exists: false};

        const query = {stateCode, cityCode};
        
        return Region.findOne(query).exec();
    } else 
        return Promise.resolve(null);
}

export function getSearchRegions(regions) {
    return Promise.all(regions.map(getRegionById)).then(regions => {
        const states = regions.filter(region => !region.cityCode);
        const cities = regions.filter(region => region.cityCode);
        const parentCities = regions.filter(region => region.cityCode && region.cityCode.endsWith('0'));

        return Region.find({$or: [{
            stateCode: { $in: states.map(state => state.stateCode)}
        },{
            cityCode: { $in: cities.map(city => city.cityCode)}
        }, {
            parentCityCode: { $in: parentCities.map(city => city.cityCode)}
        }]}).exec().then(regions => regions.map(region => region._id));
    });
}