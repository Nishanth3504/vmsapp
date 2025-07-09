import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncrDecrServiceService {

  constructor() { }
  //The set method is use for encrypt the value.
  set(value){
    var key = "47p3ca5q6j2gof1z";
    var iv = "47p3ca5q6j2gof1z";
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), CryptoJS.enc.Utf8.parse(key),
    {
        keySize: 256/8,
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC
    });
    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(value){
    var key = "47p3ca5q6j2gof1z";//CryptoJS.enc.Utf8.parse(keys);
    var iv = "47p3ca5q6j2gof1z";//CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(CryptoJS.enc.Utf8.parse(value), CryptoJS.enc.Utf8.parse(key), {
        keySize: 256/8,
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  hexToBinary(hex) {
    var binary = "";
    var remainingSize = hex.length;
    for (var p = 0; p < hex.length/8; p++) {
        //In case remaining hex length (or initial) is not multiple of 8
        var blockSize = remainingSize < 8 ? remainingSize  : 8;

        binary += parseInt(hex.substr(p * 8, blockSize), 16).toString(2).padStart(blockSize*4,"0");

        remainingSize -= blockSize;
    }
    return binary;
}

}
