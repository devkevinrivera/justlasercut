import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import ExampleComponent from "./ExampleComponent";

export const ExampleComponent = {
    title: 'Title Example Component',
}

export const actions = {};

storiesOf('ExampleComponent',ExampleComponent)