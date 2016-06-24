import React from 'react';
import { detect, isMobile} from '../../utils/device'
import { Route, IndexRoute } from 'react-router';

import App from './App';
import JukeboxCreatorChooser from '../../pages/jukeboxSelectCreate/jukeboxCreaterChooser';
import Login from '../../pages/login/Login';
import JukeboxPage from '../../pages/jukebox/JukeboxContainer';
import UserPage from '../../pages/user/UserPage';
import MobileUserPage from '../../pages/mobileUser/UserPage'

detect();
const userPage = (!isMobile()) ? UserPage : MobileUserPage;


export default (
  <Route path="/" component={App}>
    <IndexRoute component={JukeboxCreatorChooser} />
    <Route path="login/:jukeboxID" component={Login} />
    <Route path="jukebox/:jukeboxID" component={JukeboxPage} />
    <Route path="userPage/:jukeboxID" component={userPage} />
  </Route>
);
