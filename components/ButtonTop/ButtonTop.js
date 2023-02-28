import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const ButtonTop = () => {
    const topUp = () => window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
    });
    return (
        <><Button className="button-top" content={<Icon as='i' name="arrow alternate circle up" size="large" onClick={() => topUp()} />} /></>
    );
};

export default ButtonTop;