<template>
    <div>
        <NuxtRouteAnnouncer />
        <NuxtPage />
    </div>
    <UModal v-model:open="compatModalOpen" title="Browser Compatibility Warning">
        <template #body>
            <div class="p-4 space-y-4">
                <div class="p-4 border-2 border-orange-500 bg-orange-500/10 rounded-lg text-center">
                    <p class="text-lg font-semibold"> You are not using a Chromium-based browser </p>
                </div>
                <p> We have detected that you are not using a Chromium-based browser. </p>
                <p>
                    Since this application relies on the <code>WebSerial</code> API and <code>esptool.js</code>,
                    which doesn't officially support non-Chromium browsers, you may encounter issues or unexpected behavior.
                </p>
                <p>
                    If you encounter any problems, we recommend switching to a Chromium-based browser such as Google Chrome, Microsoft Edge, or Opera for the best experience.
                    <i class="text-sm text-slate-600 dark:text-slate-300">(I know they suck, but it's the only way to make this work for now)</i>
                </p>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">

useSeoMeta({
    title: 'TNY Web Flasher - Firmware Flasher for TNY Robots',
    description: 'Flash any firmware on your TNY robots in a simple and easy way. No installation required, just select your robot and firmware, and flash it in seconds.',
    ogTitle: 'TNY Web Flasher - Firmware Flasher for TNY Robots',
    ogDescription: 'Flash any firmware on your TNY robots in a simple and easy way. No installation required, just select your robot and firmware, and flash it in seconds.',
    ogImage: '/WebFlasher/favicon.png',
    ogUrl: 'https://flasher.tny-robotics.com',
});

const compatModalOpen = ref(false);
function checkBrowserCompatibility() {
    const userAgent = navigator.userAgent;
    const isChromiumBased = /Chrome|Chromium|Edg|OPR|Vivaldi/i.test(userAgent);
    compatModalOpen.value = !isChromiumBased;
}

onMounted(() => {
    checkBrowserCompatibility();
});

</script>