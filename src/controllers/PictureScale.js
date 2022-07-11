import {imageDataToBase64} from '../lib/FileUtil';
import {execute as executeXbr} from '../lib/scaler/xbr';

/**
 * きれいに拡大縮小するやつ
 * @param {File} file
 * @param {number} scalePer (100-400)
 * @param {number} pixelSize (1-4)
 * @return {Promise<{status: string, org: File, image: {base64: string, filename: string, scale: number, pixelSize: number}, message?: string}>}
 */
export const scale = async (file, scalePer, pixelSize) => {
  return {
    status: 'success',
    image : {
      base64   : imageDataToBase64(await executeXbr(file, scalePer, pixelSize)),
      filename : file.name,
      scale    : scalePer,
      pixelSize: pixelSize
    },
    org: file,
    unload: () => URL.revokeObjectURL(URL.createObjectURL(file)),
  };
};

/**
 * パラメータを範囲内に収めて返すやつ
 * @param {number} pixelSize
 * @param {number} scale
 * @returns {[number, number]}
 */
export const adjustParams = (pixel, scale) => {
  pixel = pixel >> 0;
  scale = scale >> 0;

  if (pixel < 1) pixel = 1;
  if (4 < pixel) pixel = 4;

  if (scale < 100) scale = 100;
  if (400 < scale) scale = 400;

  return [pixel, scale];
};
