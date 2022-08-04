/* eslint-disable @typescript-eslint/no-var-requires, no-await-in-loop, no-async-promise-executor */
const { _electron: electron } = require('playwright');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { test, expect } = require('@playwright/test');
const { Controller } = require('../../../websocket-client');

const controller = new Controller();

const patchBinaries = () => {
    if (!fs.existsSync('/trezor-suite/node_modules/electron/dist/resources/bin/')) {
        fs.mkdirSync('/trezor-suite/node_modules/electron/dist/resources/bin/');
    }
    if (!fs.existsSync('/trezor-suite/node_modules/electron/dist/resources/bin/bridge/')) {
        fs.mkdirSync('/trezor-suite/node_modules/electron/dist/resources/bin/bridge/');
    }
    fs.copyFileSync(
        path.join(__dirname, '../../../..', 'suite-data/files/bin/bridge/linux-x64/trezord'),
        path.join('/trezor-suite/node_modules/electron/dist/resources/bin/bridge/trezord'),
    );

    if (!fs.existsSync('/trezor-suite/node_modules/electron/dist/resources/bin/tor/')) {
        fs.mkdirSync('/trezor-suite/node_modules/electron/dist/resources/bin/tor/');
    }
    fs.copyFileSync(
        path.join(__dirname, '../../../..', 'suite-data/files/bin/tor/linux-x64/tor'),
        path.join('/trezor-suite/node_modules/electron/dist/resources/bin/tor/tor'),
    );
};

let electronApp;
let window;

const launchSuite = async () => {
    electronApp = await electron.launch({
        cwd: '../suite-desktop',
        args: ['./dist/app.js', '--log-level=DEBUG', '--bridge-test'],
    });
    window = await electronApp.firstWindow();
};

const turnOnTorInSettings = async () => {
    await window.click('[data-test="@suite/menu/settings"]');
    await window.click('[data-test="@settings/general/tor-switch"]');
    await window.waitForSelector('[data-test="@settings/tor/loader"]', { state: 'visible' });
    await window.waitForSelector('[data-test="@settings/tor/loader"]', {
        state: 'detached',
        timeout: 120000,
    });
    await expect(
        window.locator('[data-test="@settings/general/tor-switch"] > input'),
    ).toBeChecked();

    await window.waitForTimeout(1000);
};

test.describe('Tor loading screen', () => {
    test.beforeEach(async () => {
        await controller.connect();

        // todo: some problems with path in dev and production and tests. tldr tests are expecting
        // binaries somewhere where they are not, so I copy them to that place. Maybe I find a
        // better solution later
        patchBinaries();
    });

    test('Tor loading screen: happy path', async ({ request }) => {
        await launchSuite();
        await turnOnTorInSettings();

        electronApp.close();

        await launchSuite();

        await window.waitForSelector('[data-test="@tor-loading-screen"]', { state: 'visible' });
        await window.locator('text=Enabling Tor');
        await window.locator('text=100%');

        await window.locator('[data-test="@welcome/title"]', { timeout: 15000 });
        electronApp.close();
    });

    test('Tor loading screen: disable tor while loading', async ({ request }) => {
        await launchSuite();
        await turnOnTorInSettings();

        electronApp.close();

        await launchSuite();

        await window.waitForSelector('[data-test="@tor-loading-screen"]', { state: 'visible' });
        await window.click('[data-test="@tor-loading-screen/disable-button"]');

        // disabling loader appears and disappears
        window.locator('text=Disabling Tor');
        await window.click('[data-test="@suite/menu/settings"]');

        await expect(
            window.locator('[data-test="@settings/general/tor-switch"] > input'),
        ).not.toBeChecked();

        electronApp.close();
    });

    test('Tor loading screen: fail and disable', async ({ request }) => {
        await launchSuite();
        await turnOnTorInSettings();

        electronApp.close();

        await launchSuite();

        // induce error by simply removing binary.
        fs.rmdirSync('/trezor-suite/node_modules/electron/dist/resources/bin/tor', {
            recursive: true,
            force: true,
        });

        await window.waitForSelector('[data-test="@tor-loading-screen"]', { state: 'visible' });
        window.locator('text=Enabling TOR Failed');
        await window.click('[data-test="@tor-loading-screen/disable-button"]', {
            timeout: 90000,
        });

        await window.click('[data-test="@suite/menu/settings"]', { timeout: 90000 });

        await expect(
            window.locator('[data-test="@settings/general/tor-switch"] > input'),
        ).not.toBeChecked();

        electronApp.close();
    });

    // retry for some reason retry does not work here, tor never starts
    test.skip('Tor loading screen: fail and retry', async ({ request }) => {
        await launchSuite();
        await turnOnTorInSettings();

        electronApp.close();

        await launchSuite();

        // induce error by simply removing binary.
        fs.rmdirSync('/trezor-suite/node_modules/electron/dist/resources/bin/tor', {
            recursive: true,
            force: true,
        });

        await window.waitForSelector('[data-test="@tor-loading-screen"]', { state: 'visible' });
        // disabling loader appears and disappears
        window.locator('text=Enabling TOR Failed');

        await window.waitForSelector('[data-test="@tor-loading-screen/try-again-button"]', {
            timeout: 90000,
        });

        patchBinaries();

        await window.click('[data-test="@tor-loading-screen/try-again-button"]');

        await window.locator('text=Enabling Tor');
        await window.locator('text=100%');

        await window.click('[data-test="@suite/menu/settings"]', { timeout: 90000 });

        await expect(
            window.locator('[data-test="@settings/general/tor-switch"] > input'),
        ).not.toBeChecked();

        electronApp.close();
    });
});
