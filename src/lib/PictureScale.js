import FileUtil  from './FileUtil';
import Validator from 'nonono-validator';

export default {
  /**
   * 拡大縮小するやつ
   * @param {File} file
   * @param {number} size
   * @return {File|boolean}
   */
  async scale(file, size) {
    const params = this._toParams(file, size);

    if (!this._validate(params)) {
      return false;
    }

    const typedArray = await this.fileToTypedArray(file);
    console.log(typedArray);



    return {};
  },

  /**
   *
   * @param {File} file
   * @returns {Uint32Array|Uint16Array|Uint8Array}
   */
  async fileToTypedArray(file) {
    const arrayBuffer = await FileUtil.blobToArrayBuffer(file);

    try {
      return FileUtil.arrayBufferToUint32Array(arrayBuffer);
    } catch (e) {
      try {
        return FileUtil.arrayBufferToUint16Array(arrayBuffer);
      } catch (e) {
        try {
          return FileUtil.arrayBufferToUint8Array(arrayBuffer);
        } catch (e) {
          return [];
        }
      }
    }
  },

  /**
   * バリデーション用のパラメータに変換する
   * @param {unknown} file
   * @param {unknown} size
   * @returns {object}
   */
  _toParams (file, size) {
    return {
      file: file,
      size: size,
    };
  },

  /**
   * バリデーション
   * @param {object} params
   * @returns {boolean}
   */
  _validate(params) {
    const rules = {
      file: {
        type: 'callback', callback: this._validateFile, name: 'ファイル',
      },
      size: {
        type: 'integer', min: 100, max: 300, name: '拡大率',
      },
    };

    const v = (new Validator()).rules(params, rules);

    return v.exec();
  },

  /**
   * ファイルのバリデーション
   * @param {unknown} val
   * @return {array}
   */
  _validateFile (val) {
    const ret = [];

    if (!Validator.isObject(val) || toString.call(val) !== '[object File]') {
      return ['画像ファイルを選択してください'];
    }
    if (val.type.match(/^image/) == null) {
      return [`画像ファイルを選択してください(${val.name})`];
    }
    if (val.type.match(/^image/) !== null && !val.type.match(/^image\/(png|jpeg|gif)/)) {
      ret.push(`pngかjpegかgifを選択してください(${val.name})`);
    }
    return ret;
  }
};