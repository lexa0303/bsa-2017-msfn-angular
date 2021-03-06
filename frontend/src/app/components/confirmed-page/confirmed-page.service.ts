import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { IHttpReq } from '../../models/http-req';

@Injectable()
export class ConfirmedPageService {

  constructor(private httpService: HttpService) { }

  checkRegistrationToken(token, callback) {
    const request: IHttpReq = {
        url: '/api/user/activate/' + token,
        method: 'GET',
        body: ''
    };
    this.httpService.sendRequest(request).then(res => {
        callback(null, res);
    }).catch(err => {
        callback(err);
    });
  }

  checkRootEmailToken(token, callback) {
    const request: IHttpReq = {
        url: '/api/user/changemail/' + token,
        method: 'GET',
        body: '',
        successMessage: 'Your root email has changed'
    };
    this.httpService.sendRequest(request).then(res => {
        callback(null, res);
    }).catch(err => {
        callback(err);
    });
  }
}
