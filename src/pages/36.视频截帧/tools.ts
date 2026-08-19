/**
 * 视频截帧
 * @param file 视频文件
 * @param time 截取时间点（秒），默认为0（第一帧）
 * @returns 截图的Blob对象
 */
export async function captureVideoFrame(
  file: File,
  time: number = 0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('无法创建canvas上下文'));
      return;
    }

    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(time, video.duration);
    };

    video.onseeked = () => {
      const scale = Math.min(1280 / Math.max(video.videoWidth, video.videoHeight), 1);
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(video.src);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('无法生成图片Blob'));
          }
        },
        'image/jpeg',
        0.8
      );
      /**  有损压缩：
       *   'image/jpeg',
       *    0.34
       *
       *   无损：
       *   'image/png',*/
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('视频加载失败'));
    };
  });
}
