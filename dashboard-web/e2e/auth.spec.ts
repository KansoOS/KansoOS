import { test, expect } from '@playwright/test';

test.describe('authentification', () => {
    test('connexion sans MFA, puis déconnexion, dans un vrai navigateur', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Connexion' }).click();

        await page.getByLabel('Adresse e-mail').fill('nomfa@kanso.test');
        await page.getByLabel('Mot de passe').fill('nomfa1234');
        await page.getByRole('button', { name: 'Se connecter' }).click();

        await expect(page.getByText(/Connecté en tant que/)).toBeVisible();

        await page.getByRole('button', { name: 'Se déconnecter' }).click();

        await expect(page.getByLabel('Adresse e-mail')).toBeVisible();
    });

    test('connexion avec MFA demande le code TOTP', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Connexion' }).click();

        await page.getByLabel('Adresse e-mail').fill('test@kanso.test');
        await page.getByLabel('Mot de passe').fill('test1234');
        await page.getByRole('button', { name: 'Se connecter' }).click();

        await expect(page.getByLabel("Code de l'application d'authentification")).toBeVisible();

        await page.getByLabel("Code de l'application d'authentification").fill('123456');
        await page.getByRole('button', { name: 'Vérifier' }).click();

        await expect(page.getByText(/Connecté en tant que/)).toBeVisible();
    });

    test('inscription réussie affiche un message de succès', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Connexion' }).click();

        await page.getByRole('button', { name: 'Créer un compte' }).click();
        await page.getByLabel('Adresse e-mail').fill('nouvel.utilisateur@kanso.test');
        await page.getByLabel('Mot de passe', { exact: true }).fill('motdepasse123');
        await page.getByLabel('Confirmer le mot de passe').fill('motdepasse123');
        await page.getByRole('button', { name: "S'inscrire" }).click();

        await expect(page.getByText('Compte créé avec succès !')).toBeVisible();
    });
});
