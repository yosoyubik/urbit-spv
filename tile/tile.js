import React, { Component } from 'react';
import _ from 'lodash';


export default class bitcoinTile extends Component {

  render() {
    return (
      <div className="w-100 h-100 relative bg-white bg-gray0-d ba b--black b--gray1-d">
        <a className="w-100 h-100 db pa2 no-underline" href="/~bitcoin">
          <p className="black white-d absolute f9" style={{ left: 8, top: 8 }}>Bitcoin</p>
          <img className="absolute" src="/~bitcoin/img/Tile.png"
               style={{
                 top: 33,
                 left: 33,
                 width: 60,
                 height: 60
               }}/>
        </a>
      </div>
    );
  }

}

window.bitcoinTile = bitcoinTile;
