// worker.js
self.addEventListener('message', async (event) => {
    console.log('sss')
    const { imageUrl, index } = event.data
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    self.postMessage({ index, blobUrl })
})