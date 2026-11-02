import { test, expect } from '@playwright/test';

async function loginAndShowSpace(page: import('@playwright/test').Page) {
    await page.goto('/');
    await page.getByRole('button', { name: 'Connexion' }).click();
    await page.getByLabel('Adresse e-mail').fill('nomfa@kanso.test');
    await page.getByLabel('Mot de passe').fill('nomfa1234');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.getByLabel("Identifiant de l'espace").fill('space-1');
    await page.getByRole('button', { name: 'Afficher' }).click();
    await page.getByText('Espace de Léo').waitFor();
}

test.describe('appareils', () => {
    test('le résumé sur la vue d\'ensemble mène au bon onglet au clic', async ({ page }) => {
        await loginAndShowSpace(page);

        await page.getByRole('button', { name: /à surveiller|actif/ }).click();

        await expect(page.getByRole('tab', { name: /Appareils/ })).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByText('Dernière synchronisation')).not.toHaveCount(0);
    });

    test('la navigation au clavier entre onglets fonctionne (flèches)', async ({ page }) => {
        await loginAndShowSpace(page);

        const overviewTab = page.getByRole('tab', { name: "Vue d'ensemble" });
        const devicesTab = page.getByRole('tab', { name: 'Appareils' });

        await overviewTab.focus();
        await page.keyboard.press('ArrowRight');
        await expect(devicesTab).toBeFocused();
        await expect(devicesTab).toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('ArrowLeft');
        await expect(overviewTab).toBeFocused();
        await expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    });

    test('ajouter un appareil affiche un QR code et un code à saisir à la main', async ({ page }) => {
        await loginAndShowSpace(page);
        await page.getByRole('tab', { name: 'Appareils' }).click();

        await page.getByRole('button', { name: 'Ajouter un appareil' }).click();

        await expect(page.getByRole('img', { name: /Code/ })).toBeVisible();
        await expect(page.locator('.pairing-code')).not.toBeEmpty();

        await page.getByRole('button', { name: 'Fermer' }).click();
        await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test('révoquer un appareil le retire de la liste', async ({ page }) => {
        page.on('dialog', (dialog) => dialog.accept());
        await loginAndShowSpace(page);
        await page.getByRole('tab', { name: 'Appareils' }).click();

        const rows = page.locator('.device-row');
        const before = await rows.count();
        await page.getByRole('button', { name: /Révoquer/ }).first().click();

        await expect(rows).toHaveCount(before - 1);
    });
});
