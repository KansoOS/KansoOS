import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Scan automatisé WCAG (règles wcag2a/wcag2aa/wcag21aa d'axe-core), sur les
// écrans réellement accessibles sans backend : accueil, connexion, inscription,
// et le dashboard une fois connecté avec un espace affiché.
test.describe('accessibilité (axe-core)', () => {
    test("page d'accueil (avant connexion)", async ({ page }) => {
        await page.goto('/');
        await page.getByRole('heading', { name: 'Accompagner, ensemble et en confiance' }).waitFor();

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(results.violations).toEqual([]);
    });

    test("écran de connexion", async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Connexion' }).click();
        await page.getByLabel('Adresse e-mail').waitFor();

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(results.violations).toEqual([]);
    });

    test("écran d'inscription", async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Connexion' }).click();
        await page.getByRole('button', { name: 'Créer un compte' }).click();
        await page.getByLabel('Adresse e-mail').waitFor();

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(results.violations).toEqual([]);
    });

    test('dashboard avec espace et mandat affichés', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Connexion' }).click();
        await page.getByLabel('Adresse e-mail').fill('nomfa@kanso.test');
        await page.getByLabel('Mot de passe').fill('nomfa1234');
        await page.getByRole('button', { name: 'Se connecter' }).click();
        await page.getByLabel("Identifiant de l'espace").fill('space-1');
        await page.getByRole('button', { name: 'Afficher' }).click();
        await page.getByText('Espace de Léo').waitFor();

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(results.violations).toEqual([]);
    });

    test('onglet appareils', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Connexion' }).click();
        await page.getByLabel('Adresse e-mail').fill('nomfa@kanso.test');
        await page.getByLabel('Mot de passe').fill('nomfa1234');
        await page.getByRole('button', { name: 'Se connecter' }).click();
        await page.getByLabel("Identifiant de l'espace").fill('space-1');
        await page.getByRole('button', { name: 'Afficher' }).click();
        await page.getByRole('tab', { name: 'Appareils' }).click();
        await page.getByText('Dernière synchronisation').first().waitFor();

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(results.violations).toEqual([]);
    });

    test("fenêtre d'appairage ouverte", async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Connexion' }).click();
        await page.getByLabel('Adresse e-mail').fill('nomfa@kanso.test');
        await page.getByLabel('Mot de passe').fill('nomfa1234');
        await page.getByRole('button', { name: 'Se connecter' }).click();
        await page.getByLabel("Identifiant de l'espace").fill('space-1');
        await page.getByRole('button', { name: 'Afficher' }).click();
        await page.getByRole('tab', { name: 'Appareils' }).click();
        await page.getByRole('button', { name: 'Ajouter un appareil' }).click();
        await page.locator('.pairing-code').waitFor();

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(results.violations).toEqual([]);
    });
});
