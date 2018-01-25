import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {NavList} from '../../ControlPage/control/control.component';
import {User} from '../../globals';
import {LogService} from '../../app.service';
import * as Base64 from 'base64-js/base64js.min';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-element-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class ElementIframeComponent implements OnInit {
  @Input() host: any;
  @Input() userid: any;
  @Input() index: number;
  target: string;

  constructor(private sanitizer: DomSanitizer,
              private _http: HttpClient,
              private _logger: LogService) {
  }

  ngOnInit() {
    // /guacamole/api/tokens will redirect to http://guacamole/api/tokens
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    this._http.get('/guacamole/api/tokens?username=' + User.name + '&password=zheng&asset_id=' +
      this.host.id + '&system_user_id=' + this.userid, header
    ).map(res => res.json())
      .subscribe(
        data => {
          const title = this.host.hostname + '[' + this.host.ip + ']';
          const base = Base64.encode(title + '\0' + 'c' + '\0' + 'jumpserver');
          // /guacamole/client will redirect to http://guacamole/#/client
          this.target = document.location.origin +
            '/guacamole/client/' + base + '?token=' + data['authToken'];
        },
        error2 => {
          this._logger.error(error2);
        }
      );
  }

  trust(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  Disconnect() {
    NavList.List[this.index].connected = false;
  }
}
