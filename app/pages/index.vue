<template>
    <div class="w-dvw h-dvh flex items-center justify-center">
        <div class="flex flex-col items-center justify-center space-y-4 w-fit">
            <!-- Title -->
            <div class="show-down flex flex-col justify-center items-center pb-4">
                <div class="flex space-x-4 justify-center items-center">
                    <UIcon name="lucide:square-terminal" class="w-12 h-12 text-primary" />
                    <h1> <span class="text-primary font-black">TNY</span> Web Flasher </h1>
                </div>
                <p class="font-semibold text-lg text-slate-500 dark:text-slate-400"> Flash any firmware on your TNY robots </p>
            </div>
            <!-- Selection -->
            <div ref="selectContainer" class="selectContainer show-up delay-200 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden" style="max-width: 400px;">
                <div class="flex flex-row gap-6 min-w-max h-full p-3">
                    <div class="flex flex-col space-y-1 min-w-fit">
                        <p> Robot type </p>
                        <USelect v-model="config.robotType" :items="robotTypes" placeholder="Select robot type" @change="onRobotTypeSelected" />
                    </div>
                    <div v-if="config.robotType" class="show-right flex flex-col space-y-1 min-w-fit">
                        <p> Firmware version </p>
                        <USelect v-model="config.releaseId" :items="firmwareVersions" :loading="firmwareSelectLoading" placeholder="Select firmware version" @change="onFirmwareVersionSelected" />
                    </div>
                    <div v-if="config.releaseId" class="show-right flex flex-col space-y-1 min-w-fit">
                        <p> Device </p>
                        <UButton v-if="config.device === null" @click="askForDevice" :loading="deviceSelectLoading" variant="subtle" icon="lucide:unplug">Connect</UButton>
                        <div v-else class="relative">
                            <div class="flex items-center justify-center space-x-2 px-2 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 pointer-events-none">
                                <p class="text-slate-800 dark:text-white" style="font-size: 0.9em;"> {{ chipName ?? 'Detecting' }} </p>
                                <UIcon :name="chipName === null? 'lucide:loader-2' : 'lucide:check'" class="w-4 h-4 text-slate-500" :class="chipName === null ? 'animate-spin' : ''" />
                            </div>
                            <div class="opacity-0 hover:opacity-100 transition-opacity absolute top-0 left-0 w-full h-full bg-slate-800">
                                <UButton class="w-full h-full" variant="subtle" icon="lucide:refresh-ccw" @click="askForDevice">Change</UButton>
                            </div>
                        </div>
                    </div>
                    <div v-if="config.device && chipName" class="show-right flex justify-center items-center px-2">
                        <UPopover v-model:open="flashPopoverOpen">
                            <UButton icon="lucide:zap"> Flash </UButton>
                            <template #content>
                                <div class="p-4 space-y-4">
                                    <h3> Are you sure? </h3>
                                    <p class="text-medium"> This operation cannot be undone. </p>
                                    <USeparator />
                                    <div class="flex justify-between space-x-2">
                                        <UButton variant="link" color="neutral" @click="flashPopoverOpen = false">Cancel</UButton>
                                        <UButton variant="solid" color="primary" @click="flashPopoverOpen = false; flashFirmware()">Yes, flash my robot</UButton>
                                    </div>
                                </div>
                            </template>
                        </UPopover>
                    </div>
                </div>
            </div>
            <FlashingPanel v-if="flashing && config.device && config.releaseId && config.robotType" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';
import { fetchFirmwareVersions, useFlashingConfig } from '~/composable/flashingConfig';
import { initializeESPLoader } from '~/composable/loader';

const config = useFlashingConfig();

const robotTypes = ref<SelectItem[]>([
  { label: 'TNY-360', value: 'tny-360' },
]);

const flashPopoverOpen = ref(false);

/// SELECT STATE

const firmwareSelectLoading = ref(false);
const firmwareVersions = ref<SelectItem[]>([/* label / value */]);

async function onRobotTypeSelected() {
    updateSelectContainerWidth();
    firmwareSelectLoading.value = true;
    firmwareVersions.value = [];
    (config as any).releaseId = null;

    const data = await fetchFirmwareVersions(config.robotType!);
    firmwareVersions.value = data;
    firmwareSelectLoading.value = false;
}

const deviceSelectLoading = ref(false);

async function onFirmwareVersionSelected() {
    updateSelectContainerWidth();
    config.device = null;
}

async function askForDevice() {
    deviceSelectLoading.value = true;
    config.device = null;
    try {
        config.device = await (navigator as any).serial.requestPort();
    } catch (error) {
        console.error('Error occurred while requesting serial port:', error);
    }
    deviceSelectLoading.value = false;
    onDeviceSelected();
}

const chipName = ref<string | null>(null);
async function onDeviceSelected() {
    updateSelectContainerWidth();
    const loader = initializeESPLoader(config.device);
    try {
        chipName.value = (await loader.main()).split(' ')[0] ?? null;
        updateSelectContainerWidth();
    } catch (error) {
        console.error('Error occurred while initializing ESPLoader:', error);
        config.device = null;
        chipName.value = null;
    }
}

const flashing = ref(false);
async function flashFirmware() {
    flashing.value = true;
}

onMounted(async () => {
    // if (window.location.hostname === 'localhost') {
    //     config.robotType = 'tny-360';
    //     await onRobotTypeSelected();
    //     config.releaseId = '331660031'; // v1.0.0 id
    //     await onFirmwareVersionSelected();
    // }
    updateSelectContainerWidth();
});

/// UTILS FUNCTIONS (API FETCH, ETC.)

const selectContainer = ref<HTMLElement | null>(null);
function updateSelectContainerWidth() {
    nextTick(() => {
        if (!selectContainer.value) return;
        const child = selectContainer.value.firstElementChild as HTMLElement;
        if (!child) return;
        const width = child.getBoundingClientRect().width;
        selectContainer.value.style.maxWidth = width + 'px';
    });
}

</script>

<style scoped>
.selectContainer {
    transition: max-width 0.2s ease-in-out;
}
</style>