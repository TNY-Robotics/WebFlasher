<template>
    <div class="flex flex-col w-full h-fit">
        <div class="hidden text-orange-500 text-red-500 text-fuchsia-500 text-green-500 text-blue-500 text-slate-500"></div>
        <div class="hidden bg-orange-500 bg-red-500 bg-fuchsia-500 bg-green-500 bg-blue-500 bg-slate-500"></div>
        <div class="flex space-x-2 justify-start items-center" :class="`text-${statusColor}-500`">
            <p> {{ statusText }} </p>
            <UIcon v-if="progress !== true" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
        </div>
        <div class="flex space-x-4 w-full justify-center items-center h-3">
            <div class="flex w-full rounded-full overflow-hidden bg-slate-800 h-1.5">
                <span v-if="progress === undefined" class="h-full rounded-full w-1/3 animate-slide" :class="`bg-${statusColor}-500`" />
                <span v-else-if="progress === true" class="h-full rounded-full w-full" :class="`bg-${statusColor}-500`" />
                <span v-else class="h-full rounded-full transition-all duration-500" :class="`bg-${statusColor}-500`" :style="{ width: progress + '%' }" />
            </div>
            <p v-if="progress !== undefined && progress !== true" class="p-0">{{ Math.round(progress) }}%</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { fetchReleaseInfos, RELEASE_ASSET_API_URL, ROBOT_CHIP_INFOS, ROBOT_REPOS, useFlashingConfig } from '~/composable/flashingConfig';
import { esploader } from '~/composable/loader';
import SparkMD5 from 'spark-md5';

import type {
    FlashOptions,
} from "esptool-js";

const config = useFlashingConfig();
const progress = ref<number | undefined | true>(undefined);
const statusText = ref<string>('');
const statusColor = ref<string>('slate');
function setProgress(value: number | undefined | true) { progress.value = value; }
function setStatus(text: string, color: string) { statusText.value = text; statusColor.value = color; if (color === 'red') { setProgress(true); } }

async function fetchInfos() {
    if (!config.robotType || !config.releaseId) return;
    setStatus('Fetching release infos...', 'blue');
    setProgress(undefined);
    try {
        const infos = await fetchReleaseInfos(config.robotType, config.releaseId);
        return infos;
    } catch (error) { setStatus('Failed to fetch release infos', 'red'); return; }
}

async function downloadAsset(asset: {name: string, id: number, size: number}) {
    if (!config.robotType) return;
    
    setStatus(`Downloading ${asset.name}`, 'fuchsia');
    const url = RELEASE_ASSET_API_URL(ROBOT_REPOS[config.robotType], asset.id.toString());

    try {
        const blob = await $fetch('/api/github-asset', {
            method: 'GET',
            query: { url: url },
            responseType: 'blob'
        }) as Blob;
        console.log(`Downloaded ${asset.name}`, blob);
        return blob;
    } catch (err) {
        console.error(`Failed to download ${asset.name}:`, err);
        setStatus(`Failed to download ${asset.name}`, 'red');
    }
}

onMounted(async () => {
    const infos = await fetchInfos();
    if (!infos) return;
    
    const assets = infos.assets.filter(asset => asset.name.endsWith('.bin'));
    if (assets.length === 0) { setStatus('No .bin assets found', 'red'); return; }

    const missingFile = ROBOT_CHIP_INFOS[config.robotType!].files.some(file => {
        if (!assets.find(asset => asset.name == file.name)) {
            setStatus(`Missing required file: ${file.name}`, 'red');
            console.error(`Missing required file: ${file.name}, files are:`, assets.map(a => a.name.toLowerCase().trim()));
            return true;
        }
        return false;
    });
    if (missingFile) return;

    const files = {} as any;
    for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        if (!asset) { setStatus(`Asset ${i + 1} is invalid`, 'red'); continue; }
        console.log(`Downloading ${asset.name} (${i + 1}/${assets.length}) ...`);
        setProgress((i / assets.length) * 100);
        const data = await downloadAsset(asset);
        if (!data) return;
        files[asset.name] = new Uint8Array(await data.arrayBuffer());
        console.log(`Downloaded ${asset.name} (${i + 1}/${assets.length})`);
    }

    const fileArray = ROBOT_CHIP_INFOS[config.robotType!].files.map(file => ({
        data: files[file.name] as Uint8Array,
        address: file.offset as number,
    }));

    const flashOptions = {
        fileArray: fileArray,
        flashMode: "dio", // dio mode, stable
        flashFreq: "80m", // Flash frequency, 80MHz is standard for ESP32
        flashSize: "16MB", // Flash size, 16MB here is hardcoded, FIXME
        eraseAll: false, // No need to erase all, keep user data and nvs
        compress: true,
        calculateMD5Hash(image) {
            SparkMD5.ArrayBuffer.hash(image as any);
        },
        reportProgress: (fileIndex: any, written: number, total: number) => {
            const fileName = ROBOT_CHIP_INFOS[config.robotType!].files[fileIndex]?.name;
            setStatus(`Flashing ${fileName} - ${Math.round((written / total) * 100)}%`, 'orange');
            setProgress(((fileIndex + written / total) / fileArray.length) * 100);
        }
    } as FlashOptions;

    if (esploader === null) {
        setStatus('ESPLoader is not initialized', 'red');
        return;
    }

    try {
        setStatus('Flashing firmware...', 'orange');
        await esploader.writeFlash(flashOptions);
        
        setProgress(true);
        setStatus('All done!', 'green');
        await esploader.after("hard_reset");
    } catch (error) {
        console.error('Flashing failed:', error);
        setStatus(`Flashing failed: ${error}`, 'red');
    }

});
</script>

<style scoped>
@keyframes slide {
    0% { transform: translateX(0%); }
    100% { transform: translateX(200%); }
}
.animate-slide { animation: slide 1s ease-in-out alternate-reverse infinite; }
</style>