import { test, expect } from '@playwright/test';

async function login(page: import('@playwright/test').Page) {
    await page.goto('/');
    await page.getByRole('button', { name: 'Connexion' }).click();
    await page.getByLabel('Adresse e-mail').fill('nomfa@kanso.test');
    await page.getByLabel('Mot de passe').fill('nomfa1234');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.getByText(/Connecté en tant que/)).toBeVisible();
}

test.describe('espace et mandat', () => {
    test('affiche le périmètre comme des éléments distincts, pas un statut binaire', async ({ page }) => {
        await login(page);

        await page.getByLabel("Identifiant de l'espace").fill('space-1');
        await page.getByRole('button', { name: 'Afficher' }).click();

        await expect(page.getByText('Espace de Léo')).toBeVisible();
        await expect(page.getByText('contacts.gerer')).toBeVisible();
        await expect(page.getByText('niveaux.proposer')).toBeVisible();
        await expect(page.getByText('journal.consulter')).toBeVisible();
    });

    test('affiche un message clair quand il n\'y a pas de mandat en vigueur', async ({ page }) => {
        await login(page);

        await page.getByLabel("Identifiant de l'espace").fill('space-2');
        await page.getByRole('button', { name: 'Afficher' }).click();

        await expect(page.getByText('Espace sans mandat')).toBeVisible();
        await expect(page.getByText('Aucun mandat en vigueur pour cet espace.')).toBeVisible();
    });
});
