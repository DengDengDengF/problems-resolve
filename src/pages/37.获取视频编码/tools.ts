import MediaInfoFactory from 'mediainfo.js'

let _mediaInfoPromise: Promise<any> | null = null

// 获取MediaInfo实例，全局单实例
const getMediaInfo = async () => {
  if (!_mediaInfoPromise) {
    _mediaInfoPromise = MediaInfoFactory({
      format: 'object',
      locateFile: (path: string) => {
        return `/${path}` // wasm 文件放在 public 目录，直接从根路径访问
      }
    })
  }
  return _mediaInfoPromise
}

/**
 * 获取视频编码信息
 * @param file 视频文件
 * @returns 视频编码信息对象
 */
export async function getVideoCodecInfo(file: File): Promise<any> {
  const mediaInfo = await getMediaInfo()

  // 监控 mediainfo 实际读取的数据量
  let totalRead = 0
  const start = performance.now()

  const result = await mediaInfo.analyzeData(
    () => file.size,
    async (size: number, offset: number) => {
      totalRead += size
      const blob = file.slice(offset, offset + size)
      const buffer = await blob.arrayBuffer()
      return new Uint8Array(buffer)
    }
  )

  const parseTime = performance.now() - start

  console.log(
    `[MediaInfo] ${file.name} - 文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB, 实际读取: ${(totalRead / 1024 / 1024).toFixed(2)}MB, 解析耗时: ${parseTime.toFixed(2)}ms`
  )

  // 解析结果
  const info: any = {
    fileName: file.name,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    totalRead: `${(totalRead / 1024 / 1024).toFixed(2)} MB`,
    videoCodec: '',
    resolution: '',
    frameRate: '',
    duration: '',
    bitrate: ''
  }

  const videoTrack = result.media.track.find((t: any) => t['@type'] === 'Video')
  const generalTrack = result.media.track.find((t: any) => t['@type'] === 'General')

  if (videoTrack) {
    info.videoCodec = videoTrack.Format || ''
    if (videoTrack.Width && videoTrack.Height) {
      info.resolution = `${videoTrack.Width}×${videoTrack.Height}`
    }
    if (videoTrack.FrameRate) {
      info.frameRate = `${parseFloat(videoTrack.FrameRate).toFixed(2)} fps`
    }
  }

  if (generalTrack) {
    if (generalTrack.Duration) {
      const seconds = parseFloat(generalTrack.Duration)
      const minutes = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      info.duration = `${minutes}分${secs}秒`
    }
    if (generalTrack.OverallBitRate) {
      info.bitrate = `${(parseFloat(generalTrack.OverallBitRate) / 1000000).toFixed(2)} Mbps`
    }
  }

  if (!videoTrack) {
    throw new Error('未获取到视频编码信息')
  }

  return info
}
