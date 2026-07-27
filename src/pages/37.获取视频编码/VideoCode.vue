<template>
  <div class="video-code-container">
    <h2>视频编码信息 Demo</h2>

    <div class="upload-section">
      <input
          type="file"
          accept="video/*"
          @change="handleFileChange"
          ref="fileInput"
      />
      <button @click="runPerformanceTest" :disabled="!currentFile || isTestRunning" style="margin-left: 10px">
        {{ isTestRunning ? '测试中...' : '性能测试(100次)' }}
      </button>
    </div>

    <div v-if="loading" class="loading">
      正在读取视频编码信息...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="testResults.length > 0" class="test-results">
      <h3>性能测试结果</h3>
      <div class="stats">
        <p>总耗时: {{ totalTime }}ms</p>
        <p>平均耗时: {{ avgTime }}ms</p>
        <p>最小耗时: {{ minTime }}ms</p>
        <p>最大耗时: {{ maxTime }}ms</p>
      </div>
      <div class="results-list">
        <div v-for="(result, index) in testResults" :key="index" class="result-item">
          第{{ index + 1 }}次: {{ result }}ms
        </div>
      </div>
    </div>

    <div v-if="videoInfo" class="result-section">
      <h3>视频编码信息</h3>
      <div class="info-content">
        <div class="info-item">
          <strong>文件名：</strong>{{ videoInfo.fileName }}
        </div>
        <div class="info-item">
          <strong>文件大小：</strong>{{ videoInfo.fileSize }}
        </div>
        <div class="info-item">
          <strong>实际读取：</strong>{{ videoInfo.totalRead }}
        </div>
        <div class="info-item">
          <strong>视频编码：</strong>{{ videoInfo.videoCodec }}
        </div>
        <div class="info-item">
          <strong>分辨率：</strong>{{ videoInfo.resolution }}
        </div>
        <div class="info-item">
          <strong>帧率：</strong>{{ videoInfo.frameRate }}
        </div>
        <div class="info-item">
          <strong>时长：</strong>{{ videoInfo.duration }}
        </div>
        <div class="info-item">
          <strong>比特率：</strong>{{ videoInfo.bitrate }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {getVideoCodecInfo} from './tools';

const fileInput = ref<HTMLInputElement>();
const videoInfo = ref<any>(null);
const loading = ref(false);
const error = ref<string>('');
const currentFile = ref<File | null>(null);
const isTestRunning = ref(false);
const testResults = ref<number[]>([]);

// 计算统计数据
const totalTime = computed(() => {
  if (testResults.value.length === 0) return 0;
  return testResults.value.reduce((sum, t) => sum + t, 0).toFixed(2);
});

const avgTime = computed(() => {
  if (testResults.value.length === 0) return 0;
  return (testResults.value.reduce((sum, t) => sum + t, 0) / testResults.value.length).toFixed(2);
});

const minTime = computed(() => {
  if (testResults.value.length === 0) return 0;
  return Math.min(...testResults.value).toFixed(2);
});

const maxTime = computed(() => {
  if (testResults.value.length === 0) return 0;
  return Math.max(...testResults.value).toFixed(2);
});

// 性能测试函数
const runPerformanceTest = async () => {
  if (!currentFile.value || isTestRunning.value) return;

  isTestRunning.value = true;
  testResults.value = [];
  error.value = '';

  const TEST_COUNT = 100;

  try {
    for (let i = 0; i < TEST_COUNT; i++) {
      const startTime = performance.now();
      await getVideoCodecInfo(currentFile.value);
      const endTime = performance.now();
      const duration = endTime - startTime;
      testResults.value.push(parseFloat(duration.toFixed(2)));
    }

    console.log('性能测试完成:', {
      total: totalTime.value,
      avg: avgTime.value,
      min: minTime.value,
      max: maxTime.value
    });
  } catch (err) {
    error.value = '性能测试失败: ' + (err instanceof Error ? err.message : String(err));
  } finally {
    isTestRunning.value = false;
  }
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  currentFile.value = file;
  error.value = '';
  videoInfo.value = null;
  loading.value = true;
  testResults.value = [];

  try {
    const info = await getVideoCodecInfo(file);
    videoInfo.value = info;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '读取失败';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.video-code-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
}

.upload-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

input[type="file"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #66b1ff;
}

.loading {
  color: #409eff;
  padding: 10px;
}

.error {
  color: #f56c6c;
  padding: 10px;
  background-color: #fef0f0;
  border-radius: 4px;
  margin-bottom: 20px;
}

.test-results {
  margin-top: 30px;
  margin-bottom: 30px;
}

.test-results h3 {
  margin-bottom: 15px;
  color: #303133;
}

.stats {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.stats p {
  margin: 5px 0;
  color: #606266;
  font-weight: bold;
}

.results-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
}

.result-item {
  padding: 5px;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  color: #606266;
}

.result-item:last-child {
  border-bottom: none;
}

.result-section {
  margin-top: 30px;
}

.result-section h3 {
  margin-bottom: 15px;
}

.info-content {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
}

.info-item {
  padding: 8px 0;
  border-bottom: 1px solid #e4e7ed;
  color: #606266;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item strong {
  display: inline-block;
  width: 120px;
  color: #303133;
}
</style>
