export type SvgImage = keyof typeof SVG_IMAGES;

export const SVG_IMAGES = {
    RECOVERY_ADVANCED: 'recovery-advanced.svg',
    RECOVERY_BASIC: 'recovery-basic.svg',
    FIRMWARE_INIT_1: 'firmware-init-1.svg',
    FIRMWARE_INIT_2: 'firmware-init-2.svg',
    FIRMWARE_SUCCESS_1: 'firmware-success-1.svg',
    FIRMWARE_SUCCESS_2: 'firmware-success-2.svg',
    ALL_DONE_1: 'all-done-1.svg',
    ALL_DONE_2: 'all-done-2.svg',
    BRIDGE_QUESTION: 'bridge-question.svg', // todo: not used
    BRIDGE_SUCCESS: 'bridge-success.svg', // todo: not used
    CREATE_NEW: 'create-new.svg',
    EXISTING_USER: 'existing-user.svg',
    MODEL_1: 'model-1.svg',
    MODEL_2: 'model-2.svg',
    NEW_USER: 'new-user.svg',
    RECOVER_FROM_SEED: 'recover-from-seed.svg',
    SEED_CARD_SHAMIR: 'seed-card-shamir.svg',
    SEED_CARD_SINGLE: 'seed-card-single.svg',
    DEVICE_INITIALIZED_1: 'device-initialized-1.svg',
    DEVICE_INITIALIZED_2: 'device-initialized-2.svg',
    PIN_ASK_1: 'pin-ask-1.svg',
    PIN_ASK_2: 'pin-ask-2.svg',
    PIN_SUCCESS_1: 'pin-success-1.svg',
    PIN_SUCCESS_2: 'pin-success-2.svg',
    USED_DEVICE: 'used-device.svg',
    WRITING_SEED: 'writing-seed.svg', // todo: not used
    '12_WORDS': '12-words.svg',
    '18_WORDS': '18-words.svg',
    '24_WORDS': '24-words.svg',
    EMPTY_WALLET: 'wallet-empty.svg',
    ANALYTICS: 'analytics.svg',
    WELCOME: 'welcome.svg',
    UNI_ERROR: 'uni-error.svg',
    UNI_SUCCESS: 'uni-success.svg',
    UNI_WARNING: 'uni-warning.svg',
    UNI_EMPTY_PAGE: 'uni-empty-page.svg',
    TUNKNOWN: 'TUnknown.svg', // todo: use in device icons
    T1: 'T1.svg',
    T2: 'T2.svg',
    T_BRIDGE_CONFIRM: 't-bridge-confirm.svg', // todo: not used
    T_BRIDGE_CHECK: 't-bridge-check.svg',
    T_DEVICE_CONFIRM: 't-device-confirm.svg',
    SPINNER: 'spinner.svg',
    SET_UP_PIN_DIALOG: 'set-up-pin-dialog.svg',
    ONE_DEVICE_CONFIRM: 'one-device-confirm.svg',
    DEVICE_ANOTHER_SESSION: 'device-another-session.svg',
    CONNECT_DEVICE: 'connect-device.svg',
    '404': '404.svg',
    HOW_TO_ENTER_BOOTLOADER_MODEL_1: 'how-to-enter-bootloader-model-1.svg',
    HOW_TO_ENTER_BOOTLOADER_MODEL_2: 'how-to-enter-bootloader-model-2.svg',
    EARLY_ACCESS: 'early-access.svg',
    EARLY_ACCESS_DISABLE: 'early-access-disable.svg',
} as const;

export type PngImage = keyof typeof PNG_IMAGES;

export const PNG_IMAGES = {
    CLOUDY: 'Cloudy.png',
    BACKUP: 'Backup.png',
    BACKUP_2x: 'Backup@2x.png',
    BACKUP_3x: 'Backup@3x.png',
    CHECK: 'Check.png',
    CHECK_2x: 'Check@2x.png',
    CHECK_3x: 'Check@3x.png',
    CLOCK: 'Clock.png',
    CLOCK_2x: 'Clock@2x.png',
    CLOCK_3x: 'Clock@3x.png',
    COINS: 'Coins.png',
    COINS_2x: 'Coins@2x.png',
    COINS_3x: 'Coins@3x.png',
    ERROR: 'Error.png',
    ERROR_2x: 'Error@2x.png',
    ERROR_3x: 'Error@3x.png',
    EXTRA_INFO: 'ExtraInfo.png',
    EXTRA_INFO_2x: 'ExtraInfo@2x.png',
    EXTRA_INFO_3x: 'ExtraInfo@3x.png',
    FIRMWARE: 'Firmware.png',
    FIRMWARE_2x: 'Firmware@2x.png',
    FIRMWARE_3x: 'Firmware@3x.png',
    FOLDER: 'Folder.png',
    FOLDER_2x: 'Folder@2x.png',
    FOLDER_3x: 'Folder@3x.png',
    KEY: 'Key.png',
    KEY_2x: 'Key@2x.png',
    KEY_3x: 'Key@3x.png',
    NO_TRANSACTION: 'NoTransaction.png',
    NO_TRANSACTION_2x: 'NoTransaction@2x.png',
    NO_TRANSACTION_3x: 'NoTransaction@3x.png',
    PIN: 'Pin.png',
    PIN_2x: 'Pin@2x.png',
    PIN_3x: 'Pin@3x.png',
    PIN_LOCKED: 'Pin_locked.png',
    PIN_LOCKED_2x: 'Pin_locked@2x.png',
    PIN_LOCKED_3x: 'Pin_locked@3x.png',
    RECOVERY: 'Recovery.png',
    RECOVERY_2x: 'Recovery@2x.png',
    RECOVERY_3x: 'Recovery@3x.png',
    UNDERSTAND: 'Understand.png',
    UNDERSTAND_2x: 'Understand@2x.png',
    UNDERSTAND_3x: 'Understand@3x.png',
    WALLET: 'Wallet.png',
    WALLET_2x: 'Wallet@2x.png',
    WALLET_3x: 'Wallet@3x.png',
    TOR_ENABLING: 'Tor_enabling.png',
} as const;
