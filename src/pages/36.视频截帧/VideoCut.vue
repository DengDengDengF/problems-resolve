<template>
  <div class="video-cut-container">
    <h2>视频截帧 Demo</h2>

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
      正在截取第一帧...
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

    <div v-if="firstFrameImage" class="result-section">
      <h3>视频第一帧</h3>
      <div class="file-info">
        <p>原视频大小：{{ formatFileSize(videoFileSize) }}</p>
        <p>截图大小：{{ formatFileSize(imageFileSize) }}</p>
      </div>
      <el-image :src="firstFrameImage" fit="cover" style="width: 198.71px;height: 263.26px"></el-image>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onUnmounted, computed} from 'vue';
import {captureVideoFrame} from './tools';

const fileInput = ref<HTMLInputElement>();
const firstFrameImage = ref<string>('');
const loading = ref(false);
const error = ref<string>('');
const videoFileSize = ref<number>(0);
const imageFileSize = ref<number>(0);
const currentFile = ref<File | null>(null);
const isTestRunning = ref(false);
const testResults = ref<number[]>([]);

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
};

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
  const INTERVAL = 1000; // 30ms间隔

  try {
    for (let i = 0; i < TEST_COUNT; i++) {
      const startTime = performance.now();

      // 执行截帧
      const blob = await captureVideoFrame(currentFile.value);

      const endTime = performance.now();
      const duration = endTime - startTime;

      testResults.value.push(parseFloat(duration.toFixed(2)));

      // 等待30ms间隔
      if (i < TEST_COUNT - 1) {
        await new Promise(resolve => setTimeout(resolve, INTERVAL));
      }
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

  // 清理之前的 Object URL
  if (firstFrameImage.value) {
    URL.revokeObjectURL(firstFrameImage.value);
  }

  error.value = '';
  firstFrameImage.value = '';
  videoFileSize.value = file.size;
  loading.value = true;
  testResults.value = []; // 清空测试结果

  try {
    const blob = await captureVideoFrame(file);
    imageFileSize.value = blob.size;
    firstFrameImage.value = URL.createObjectURL(blob);
  } catch (err) {
    error.value = err instanceof Error ? err.message : '截取失败';
  } finally {
    loading.value = false;
  }
};

// 组件卸载时清理 Object URL
onUnmounted(() => {
  if (firstFrameImage.value) {
    URL.revokeObjectURL(firstFrameImage.value);
  }
});
</script>

<style scoped>
.video-cut-container {
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

.file-info {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.file-info p {
  margin: 5px 0;
  color: #606266;
}

.frame-image {
  width: 182.25px;
  height: 184px;
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
