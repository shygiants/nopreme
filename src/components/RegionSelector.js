import React, {Component} from 'react';
import {Box, Text, Button, TextInput, Select} from 'grommet';
import {graphql, createFragmentContainer, createRefetchContainer} from 'react-relay';


class RegionSelector extends Component {
    constructor(props) {
        super(props);

        const codes = this.getCodes(props.regionCode);
        this.state = this.getNames(codes);
    }

    _refetch() {
        const {relay, regionCode} = this.props;

        const {stateCode, cityCode} = this.getCodes(regionCode);

        relay.refetch(fragmentVariables => ({
            stateCode,
            cityCode: cityCode && cityCode.slice(0, 2) + '0',
        }), null, () => {
            this.setState(this.getNames({stateCode, cityCode}));
        }, {force: true});
    }

    componentDidMount() {
        this._refetch();
    }

    componentDidUpdate(prevProps) {
        const {regionCode} = this.props;

        if (regionCode !== prevProps.regionCode) {
            this._refetch();
        }
    }

    handleRegionChange({state: stateName, city: cityName, childCity: childCityName}) {
        const {address, onChange} = this.props;
        const {states, cities, childCities} = address;

        const state = states.find(state => state.stateName === stateName);
        const city = cities.find(city => city.cityName === cityName);
        const childCity = childCities.find(childCity => childCity.cityName === childCityName);

        var regionCode = '';
        if (state)
            regionCode = state.stateCode;
        if (childCity)
            regionCode += childCity.cityCode;
        else if (city)
            regionCode += city.cityCode;

        onChange(regionCode);
    }

    getCodes(regionCode) {
        let stateCode, cityCode;
        if (regionCode.length >= 2) {
            stateCode = regionCode.slice(0, 2);

            if (regionCode.length === 5)
                cityCode = regionCode.slice(2, 5);
        }
            
        return {stateCode, cityCode};
    }

    getNames({stateCode, cityCode}) {
        const {address} = this.props;
        const {states, cities, childCities} = address;

        const state = stateCode && states.find(state => state.stateCode === stateCode);
        const city = cityCode && cities.find(city => city.cityCode === cityCode.slice(0, 2) + '0');
        const childCity = cityCode && childCities.find(childCity => childCity.cityCode === cityCode);

        return {
            stateName: state && state.stateName,
            cityName: city && city.cityName,
            childCityName: childCity && childCity.cityName,
        };
    }

    render() {
        const {address, exclude} = this.props;
        const {states, cities, childCities} = address;
        const {stateName, cityName, childCityName} = this.state;

        const excludeNames = exclude.map(regionCode => {
            const codes = this.getCodes(regionCode);
            const names = this.getNames(codes);

            return {...codes, ...names};
        });

        const excludeStates = excludeNames.filter(names => names.stateCode && !names.cityCode).map(names => names.stateName);
        const excludeCities = excludeNames.filter(names => names.stateName === stateName && names.cityCode && names.cityCode.endsWith('0')).map(names => names.cityName);
        const excludeChildCities = excludeNames.filter(names => names.stateName === stateName && names.cityCode && !names.cityCode.endsWith('0')).map(names => names.cityName);

        return (
            <Box
                direction='row'
                gap='xsmall'
            >
                <Select
                    options={['전체 지역'].concat(states.map(state => state.stateName))}
                    value={stateName || '전체 지역'}
                    disabled={excludeStates}
                    onChange={({option}) => this.handleRegionChange({state: option})}
                />
                {cities.length !== 0 && (
                    <Select
                        options={['전체 지역'].concat(cities.map(city => city.cityName))}
                        value={cityName || '전체 지역'}
                        disabled={excludeCities}
                        onChange={({ option }) => this.handleRegionChange({state: stateName, city: option})}
                    />
                )}
                {childCities.length !== 0 && (
                    <Select
                        options={['전체 지역'].concat(childCities.map(childCity => childCity.cityName))}
                        value={childCityName || '전체 지역'}
                        disabled={excludeChildCities}
                        onChange={({ option }) => this.handleRegionChange({state: stateName, city: cityName, childCity: option})}
                    />
                )}
            </Box>
        )
    }
    
}

export default createRefetchContainer(RegionSelector, {
    address: graphql`
        fragment RegionSelector_address on Address @argumentDefinitions(
            stateCode: {type: "String"}
            cityCode: {type: "String"}
        ) {
            states {
                id
                regionId
                stateCode
                stateName
            }
            cities(stateCode: $stateCode) {
                id
                regionId
                stateCode
                stateName
                cityCode
                cityName
            }
            childCities(stateCode: $stateCode, cityCode: $cityCode) {
                id
                regionId
                stateCode
                stateName
                cityCode
                cityName
                parentCityCode
                parentCityName
            }
        }
    `,
}, graphql`
    query RegionSelectorRefetchQuery($stateCode: String, $cityCode: String) {
        viewer {
            ...Profile_viewer
        }
        address {
            ...Profile_address @arguments(stateCode: $stateCode, cityCode:$cityCode)
        }
    }
`);