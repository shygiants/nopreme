import React, {
    Component
} from 'react';
import {
    render
} from 'react-dom';

import Container from './components/Container';
import SignIn from './components/SignIn';

class App extends Component {
    render() {
        return (
            <Container>
                <SignIn />
            </Container>

        );
    }
}

render(<App />, document.getElementById('root'));