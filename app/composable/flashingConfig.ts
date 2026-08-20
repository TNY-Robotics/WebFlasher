export type RobotType = 'tny-360';

export const ROBOT_REPOS = {
    'tny-360': 'TNY-Robotics/TNY-360'
} as Record<RobotType, string>;

export const ROBOT_CHIP_INFOS = {
    'tny-360': {
        files: [
            { name: "bootloader.bin", offset:      0x0 }, 
            { name: "partitions.bin", offset:   0x8000 },
            { name: "boot_app0.bin", offset:    0xF000 },
            { name: "firmware.bin", offset:    0x20000 },
            { name: "filesystem.bin", offset: 0xB20000 }
        ]
    }
} as Record<RobotType, { files: { name: string; offset: number }[] }>;

export const RELEASES_API_URL = (repo: string) => `https://api.github.com/repos/${repo}/releases`;
export const RELEASE_INFO_API_URL = (repo: string, id: string) => `https://api.github.com/repos/${repo}/releases/${id}`;
export const RELEASE_ASSET_API_URL = (repo: string, id: string) => `https://api.github.com/repos/${repo}/releases/assets/${id}`;

export async function fetchFirmwareVersions(robotType: RobotType) {
    const repo = ROBOT_REPOS[robotType];
    const response = await fetch(RELEASES_API_URL(repo));
    if (!response.ok) {
        throw new Error(`Failed to fetch releases for ${robotType}`);
    }
    const releases = await response.json();
    return releases.map((release: any) => ({
        label: 'Version ' + release.name.replace(/^v/, ''), // Remove leading 'v' if present
        value: release.id.toString(), // Use release ID as value
    })).filter((release: any) => !release.value.startsWith('v0')); // Filter out pre-releases (v0.x.x)
}

export async function fetchReleaseInfos(robotType: RobotType, id: string) {
    const repo = ROBOT_REPOS[robotType];
    const response = await fetch(RELEASE_INFO_API_URL(repo, id));
    if (!response.ok) {
        throw new Error(`Failed to fetch release info for ${robotType} with ID ${id}`);
    }
    return (await response.json()) as {
        id: number;
        tag_name: string;
        name: string;
        assets: {
            name: string;
            id: number;
            size: number;
        }[]
    };
}

const config = reactive({
    robotType: null as RobotType|null,
    releaseId: null as string|null,
    device: null as any|null,
});

export function useFlashingConfig() {
    return config;
}