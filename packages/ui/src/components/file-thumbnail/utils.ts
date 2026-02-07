import type { ExtendFile } from './types';

const FORMAT_PDF = ['pdf'];
const FORMAT_TEXT = ['txt'];
const FORMAT_PHOTOSHOP = ['psd'];
const FORMAT_WORD = ['doc', 'docx'];
const FORMAT_EXCEL = ['xls', 'xlsx'];
const FORMAT_ZIP = ['zip', 'rar', 'iso'];
const FORMAT_ILLUSTRATOR = ['ai', 'esp'];
const FORMAT_POWERPOINT = ['ppt', 'pptx'];
const FORMAT_AUDIO = ['wav', 'aif', 'mp3', 'aac'];
const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'webp'];
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm'];

export function fileTypeByUrl(fileUrl = '') {
  return (fileUrl && fileUrl.split('.').pop()) || '';
}

export function fileNameByUrl(fileUrl: string) {
  return fileUrl.split('/').pop();
}

export function fileFormat(fileUrl: string | undefined): string {
  const ext = fileTypeByUrl(fileUrl);

  if (FORMAT_TEXT.includes(ext)) return 'txt';
  if (FORMAT_ZIP.includes(ext)) return 'zip';
  if (FORMAT_AUDIO.includes(ext)) return 'audio';
  if (FORMAT_IMG.includes(ext)) return 'image';
  if (FORMAT_VIDEO.includes(ext)) return 'video';
  if (FORMAT_WORD.includes(ext)) return 'word';
  if (FORMAT_EXCEL.includes(ext)) return 'excel';
  if (FORMAT_POWERPOINT.includes(ext)) return 'powerpoint';
  if (FORMAT_PDF.includes(ext)) return 'pdf';
  if (FORMAT_PHOTOSHOP.includes(ext)) return 'photoshop';
  if (FORMAT_ILLUSTRATOR.includes(ext)) return 'illustrator';

  return ext;
}

export function fileThumb(format: string): string {
  const iconUrl = (icon: string) => `/assets/icons/files/${icon}.svg`;

  const thumbMap: Record<string, string> = {
    folder: iconUrl('ic_folder'),
    txt: iconUrl('ic_txt'),
    zip: iconUrl('ic_zip'),
    audio: iconUrl('ic_audio'),
    video: iconUrl('ic_video'),
    word: iconUrl('ic_word'),
    excel: iconUrl('ic_excel'),
    powerpoint: iconUrl('ic_power_point'),
    pdf: iconUrl('ic_pdf'),
    photoshop: iconUrl('ic_pts'),
    illustrator: iconUrl('ic_ai'),
    image: iconUrl('ic_img'),
  };

  return thumbMap[format] || iconUrl('ic_file');
}

export function fileData(file: ExtendFile | string) {
  if (typeof file === 'string') {
    return {
      key: file,
      preview: file,
      name: fileNameByUrl(file),
      type: fileTypeByUrl(file),
    };
  }

  return {
    key: file.preview,
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
  };
}

export function fData(inputValue: number): string {
  if (!inputValue) return '0 Bytes';

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(inputValue) / Math.log(k));

  return `${parseFloat((inputValue / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}
