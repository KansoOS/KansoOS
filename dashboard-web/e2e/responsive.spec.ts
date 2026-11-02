import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone SE'] });

test.describe('responsive (petit écran, iPhone SE 375px)', () => {
    test('aucun débordement horizontal sur les écrans de connexion et le dashboard', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('heading', { name: 'Accompagner, ensemble et en confiance' }).waitFor();

        let overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow).toBeLessThanOrEqual(1);

        await page.getByRole('button', { name: 'Connexion' }).click();
        await page.getByLabel('Adresse e-mail').fill('nomfa@kanso.test');
        await page.getByLabel('Mot de passe').fill('nomfa1234');
        await page.getByRole('button', { name: 'Se connecter' }).click();
        await page.getByLabel("Identifiant de l'espace").fill('space-1');
        await page.getByRole('button', { name: 'Afficher' }).click();
        await page.getByText('Espace de Léo').waitFor();

        overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow).toBeLessThanOrEqual(1);
    });

    test('le bouton de déconnexion garde un nom accessible même réduit à une icône', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Connexion' }).click();
        await page.getByLabel('Adresse e-mail').fill('nomfa@kanso.test');
        await page.getByLabel('Mot de passe').fill('nomfa1234');
        await page.getByRole('button', { name: 'Se connecter' }).click();

        // Le texte est visuellement masqué en dessous de 640px (voir App.css),
        // mais reste dans l'arbre d'accessibilité : le bouton doit donc
        // toujours être trouvable par son nom accessible.
        await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible();
    });
});
