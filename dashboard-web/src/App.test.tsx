import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("reste connecté après un remontage du composant (simule un rafraîchissement de page)", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.type(await screen.findByLabelText("Identifiant"), "test");
    await user.type(screen.getByLabelText("Mot de passe"), "test");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    const totpInput = await screen.findByLabelText("Code de l'application d'authentification");
    await user.type(totpInput, "123456");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    await screen.findByText(/Connecté en tant que/);

    unmount();
    render(<App />);

    expect(await screen.findByText(/Connecté en tant que/)).toBeInTheDocument();
  });

  it("n'est pas connecté au premier chargement sans session existante", async () => {
    render(<App />);

    expect(await screen.findByLabelText("Identifiant")).toBeInTheDocument();
    expect(screen.queryByText(/Connecté en tant que/)).not.toBeInTheDocument();
  });

  it("change la langue de l'interface et retient le choix après un remontage", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await screen.findByLabelText("Identifiant");
    await user.selectOptions(screen.getByLabelText("Langue"), "en");

    expect(await screen.findByLabelText("Username")).toBeInTheDocument();
    expect(screen.queryByLabelText("Identifiant")).not.toBeInTheDocument();

    unmount();
    render(<App />);

    expect(await screen.findByLabelText("Username")).toBeInTheDocument();
  });
});
