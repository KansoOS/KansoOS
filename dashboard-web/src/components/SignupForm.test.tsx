import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SignupForm } from "./SignupForm";

describe("SignupForm", () => {
  it("affiche un message de succès après une inscription valide", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Identifiant"), "nouvel_utilisateur");
    await user.type(screen.getByLabelText("Mot de passe"), "motdepasse123");
    await user.type(screen.getByLabelText("Confirmer le mot de passe"), "motdepasse123");
    await user.click(screen.getByRole("button", { name: "S'inscrire" }));

    expect(await screen.findByText("Compte créé avec succès !")).toBeInTheDocument();
  });

  it("affiche une erreur si les mots de passe ne correspondent pas, sans appeler l'API", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Identifiant"), "nouvel_utilisateur");
    await user.type(screen.getByLabelText("Mot de passe"), "motdepasse123");
    await user.type(screen.getByLabelText("Confirmer le mot de passe"), "autrechose");
    await user.click(screen.getByRole("button", { name: "S'inscrire" }));

    expect(await screen.findByText("Les mots de passe ne correspondent pas.")).toBeInTheDocument();
  });

  it("affiche une erreur si l'identifiant est déjà pris", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Identifiant"), "existing_user");
    await user.type(screen.getByLabelText("Mot de passe"), "motdepasse123");
    await user.type(screen.getByLabelText("Confirmer le mot de passe"), "motdepasse123");
    await user.click(screen.getByRole("button", { name: "S'inscrire" }));

    expect(await screen.findByText("Impossible de créer le compte. Réessayez.")).toBeInTheDocument();
  });
});
