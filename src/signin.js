import React, {
    Component
} from 'react';
import {
    render
} from 'react-dom';

import CleanContainer from './components/CleanContainer';
import SignIn from './components/SignIn';

class App extends Component {
    render() {
        return (
            <CleanContainer>
                <SignIn />
            </CleanContainer>

        );
    }
}

render(<App />, document.getElementById('root'));