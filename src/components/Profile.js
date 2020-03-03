import React, {Component} from 'react';
import {Box, Text, Button, TextInput} from 'grommet';
import {graphql, createFragmentContainer} from 'react-relay';
import debounce from 'lodash.debounce';

import RegionSelector from './RegionSelector';
import RadioSelector from './RadioSelector';

import ModifyUserMutation from '../mutations/ModifyUserMutation';


const nameStatusText = {
    available:'사용할 수 있는 닉네임 입니다',
    unavailable:'중복되거나 사용할 수 없는 닉네임 입니다'
}

const linkStatusText = {
    available:'유효한 링크입니다',
    unavailable:'유효하지 않은 링크입니다'
}

const statusColor = {
    available:'status-ok',
    unavailable:'status-error'
}

const methods = {
    DIRECT: '직거래',
    POST: '준등기',
    DONTCARE: '상관 없음',
}

class Profile extends Component {    
    constructor(props) {
        super(props);

        const {viewer} = this.props;
        
        this.state = {
            name: viewer.name,
            openChatLink: viewer.openChatLink || '',
            regionCodes: viewer.regions.map(this.getRegionCode),
            method: methods[viewer.method],
            linkStatus: '',  
            nameStatus: '',
        };

        // 마지막 input발생 후 500ms뒤에 실행합니다
        this.debounceHandleOpenChatLinkChange = debounce(this.debounceHandleOpenChatLinkChange, 300);
        this.handleRegionChange = this.handleRegionChange.bind(this);
    }

    getRegionCode(region) {
        var regionCode = '';

        const {stateCode, cityCode} = region;
        if (stateCode)
            regionCode += stateCode;
        if (cityCode)
            regionCode += cityCode;

        return regionCode;
    }

    getMethodKey(method) {
        return Object.keys(methods).find(k => methods[k] === method);
    }

    handleNameChange({target: {value}}) {
        this.setState({
            name: value
        });
    }

    handleOpenChatLinkChange({target: {value}}){
        this.setState({
            openChatLink: value
        });

        this.debounceHandleOpenChatLinkChange(value);
    }

    debounceHandleOpenChatLinkChange(value){
        const pattern = "^https?:\/\/(open\.kakao\.com)\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)$";
        let chatLinkPattern = new RegExp(pattern);

        if (chatLinkPattern.test(value)) {
            this.setState({
                linkStatus: 'available'
            });
        } else {
            this.setState({
                linkStatus: 'unavailable'
            });
        }
    }

    handleRegionChange(idx, regionCode) {
        this.setState(({regionCodes}) => {
            regionCodes.splice(idx, 1, regionCode)

            return {
                regionCodes,
            };
        });
    }

    handleMethodChange(value) {
        this.setState({method: value});
    }

    handleSubmit() {
        const {name, openChatLink, regionCodes, method} = this.state;
        const {relay, router} = this.props;
        const methodKey = this.getMethodKey(method);

        const validRegionCodes = regionCodes.filter(regionCode => regionCode !== '');
        ModifyUserMutation.commit(relay.environment, {name, openChatLink, regionCodes: validRegionCodes, method: methodKey}).then(resp => {
            router.go(-1);
        }).catch(err => {
            this.setState({
                nameStatus: 'unavailable',
            });
        });
    }

    checkIfUnchanged() {
        const {viewer} = this.props;
        const {regionCodes} = this.state;

        const validRegionCodes = regionCodes.filter(regionCode => regionCode !== '');
        const prevRegionCodes = viewer.regions.map(this.getRegionCode);

        if (validRegionCodes.length !== prevRegionCodes.length)
            return false;

        return prevRegionCodes.every((code, idx) => regionCodes[idx] === code);
    }

    addRegion() {
        this.setState(({regionCodes}) => ({
            regionCodes: regionCodes.concat(['']),
        }));
    }

    removeRegion(idx) {
        this.setState(({regionCodes}) => {
            regionCodes.splice(idx, 1);
            return {
                regionCodes,
            };
        });
    }

    render() {
        const {viewer, address} = this.props;
        const {name, openChatLink, regionCodes, method, linkStatus, nameStatus} = this.state;

        return (
            <Box
                pad='medium'
                direction='column'
                gap='large'
                flex='grow'
            >
                <Box
                    direction='column'
                    gap='small'
                >
                    <Text size='small' color='brand'>이름</Text>
                    <TextInput
                        name='name'
                        value={name}
                        focusIndicator={false}
                        size='small'
                        onChange={this.handleNameChange.bind(this)}
                    />
                    <Text
                        size='xsmall'
                        color={statusColor[nameStatus]}
                    >
                        {nameStatusText[nameStatus]}
                    </Text>
                </Box>
                <Box
                    direction='column'
                    gap='small'
                >
                    <Text size='small' color='brand'>오픈카카오톡 링크</Text>
                    <TextInput
                        name='openChatLink'
                        value={openChatLink}
                        focusIndicator={false}
                        size='small'
                        onChange={this.handleOpenChatLinkChange.bind(this)}
                    />
                    <Text 
                        size='xsmall' 
                        color={statusColor[linkStatus]}
                    >
                        {linkStatusText[linkStatus]}
                    </Text>
                </Box>
                <Box
                    direction='column'
                    gap='small'
                >
                    <Text size='small' color='brand'>교환 방식</Text>
                    <RadioSelector
                        name='method'
                        options={['직거래', '준등기', '상관 없음']}
                        value={method}
                        onChange={this.handleMethodChange.bind(this)}
                    />
                </Box>
                

                <Box
                    direction='column'
                    gap='small'
                >
                    <Text size='small' color='brand'>선호 지역 (최대 3 곳)</Text>

                    {regionCodes.map((regionCode, idx) => (
                        <Box
                            key={'region' + idx}
                            direction='column'
                            gap='small'
                            pad='small'
                        >
                            <Text size='small' color='brand'>지역 {idx + 1}</Text>
                            <RegionSelector    
                                address={address}
                                onChange={regionCode => this.handleRegionChange.bind(this)(idx, regionCode)}
                                regionCode={regionCode}
                                exclude={regionCodes}
                            />
                            <Button 
                                label='삭제'
                                onClick={() => this.removeRegion.bind(this)(idx)} 
                            />
                        </Box>
                    ))}
                    
                    <Button 
                        label='선호 지역 추가'
                        disabled={regionCodes.some(regionCode => regionCode === '') || regionCodes.length >= 3} 
                        onClick={this.addRegion.bind(this)} 
                    />
                </Box>
                <Button disabled={
                    (linkStatus === 'unavailable' || 
                    linkStatus === '' || 
                    openChatLink === viewer.openChatLink) &&
                    name === viewer.name &&
                    this.getMethodKey(method) === viewer.method && 
                    this.checkIfUnchanged.bind(this)()
                } label='변경' onClick={this.handleSubmit.bind(this)} />
            </Box>
        );
    }
}

export default createFragmentContainer(Profile, {
    viewer: graphql`
        fragment Profile_viewer on User {
            id
            userId
            name
            openChatLink
            regions {
                id
                regionId
                stateCode
                stateName
                cityCode
                cityName
                parentCityCode
                parentCityName
            }
            method
        }
    `,
    address: graphql`
        fragment Profile_address on Address @argumentDefinitions(
            stateCode: {type: "String"}
            cityCode: {type: "String"}
        ) {
            ...RegionSelector_address @arguments(stateCode: $stateCode, cityCode: $cityCode)
        }
    `,
});