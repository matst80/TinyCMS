import React from 'react';
import { componentRegistry, CMSLink } from 'react-cms-link';
import { createLink } from 'cmslink';
import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import CoCategory from '../components/cocategory';
import StoryRouter from 'storybook-react-router';
import '../scss/app.scss';
import '../Pages/Editor.css';
import { EditorAdmin, TreeNode } from '../Pages/EditorAdmin';

createLink({ url: 'ws://localhost:5000/ws' }, (data) => {

});


addDecorator(StoryRouter());

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

storiesOf('Menu', module)
  .add('Bygg menu', () => <CoCategory idTop={false} id={'1030S'} />)
  .add('initial opened', () => <CoCategory idTop={false} id={'1030S'} isOpen={true} />);

storiesOf('Editor', module)
  .add('All', () => <EditorAdmin />);

