// Song.jsx

import { useAuth } from './Authcontext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import Player from './Player';


import './Song.css';

function Song() {
  const { user } = useAuth();

  return (
    <div>
        
        <Header/>
        <Player/>
       
      </div>
  );
}

export default Song;
