import React, { Component } from 'react';
import { Sigil } from '/components/lib/icons/sigil';
import classnames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

export class Message extends Component {
  
  renderMessage(content) {
    return (
      <p className="body-regular-400 v-top">
        {content}
      </p>
    );
  }

  renderContent() {
    const { props } = this;
    
    let content = _.get(
      props.msg,
      'sep.lin.msg',
      '<unknown message type>'
    );

    try {
      let url = new URL(content);
      let imgMatch = 
        /(jpg|img|png|gif|tiff|jpeg|JPG|IMG|PNG|TIFF|GIF|webp|WEBP|webm|WEBM)$/
        .exec(
           url.pathname
         );
      if (imgMatch) {
        return (
          <img
            src={content}
            style={{
              width:"50%",
              maxWidth: '250px'
            }}
          ></img>
        )
      } else {
        let url = this.urlTransmogrifier(content);
        
        return (
          <a className="body-regular"
            href={url}
            target="_blank">{url}</a>
        )
      }
    } catch(e) {
      return this.renderMessage(content);
    }
  }

  urlTransmogrifier(url) {
    if (typeof url !== 'string') { throw 'Only transmogrify strings!'; }
    const ship = window.ship;
    if (url.indexOf('arvo://') === 0) {
      return `http://${ship}.arvo.network` + url.split('arvo://')[1];
    }
    return url;
  }

  render() {
    const { props } = this;
    let pending = !!props.msg.pending ? ' o-80' : '';
    let timestamp = moment.unix(props.msg.wen / 1000).format('hh:mm');
    let datestamp = moment.unix(props.msg.wen / 1000).format('LL');
    
    return (
      <div className={"w-100 pl3 pr3 pt2 pb2 cf flex" + pending}
        style={{
          minHeight: 'min-content'
        }}>
        <div className="fl mr2">
          <Sigil ship={props.msg.aut} size={36} />
        </div>
        <div className="fr" style={{ flexGrow: 1, marginTop: -8 }}>
          <div className="hide-child">
            <p className="v-top label-small-mono gray dib mr3">
              ~{props.msg.aut}
            </p>
            <p className="v-top label-small-mono gray dib">{timestamp}</p>
            <p className="v-top label-small-mono ml2 gray dib child">
              {datestamp}
            </p>
          </div>
          {this.renderContent()}
        </div>
      </div>
    );
  }

}

