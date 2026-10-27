import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("reste connecté après un remontage du composant (simule un rafraîchissement de page)", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.type(await screen.findByLabelText("Adresse e-mail"), "test@kanso.test");
    await user.type(screen.getByLabelText("Mot de passe"), "test1234");
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

    expect(await screen.findByLabelText("Adresse e-mail")).toBeInTheDocument();
    expect(screen.queryByText(/Connecté en tant que/)).not.toBeInTheDocument();
  });

  it("affiche l'espace et le mandat une fois l'identifiant saisi, et retient le choix après un remontage", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.type(await screen.findByLabelText("Adresse e-mail"), "nomfa@kanso.test");
    await user.type(screen.getByLabelText("Mot de passe"), "nomfa1234");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    await user.type(await screen.findByLabelText("Identifiant de l'espace"), "space-1");
    await user.click(screen.getByRole("button", { name: "Afficher" }));

    expect(await screen.findByText("Espace de Léo")).toBeInTheDocument();
    expect(screen.getByText("contacts.gerer")).toBeInTheDocument();

    unmount();
    render(<App />);

    expect(await screen.findByText("Espace de Léo")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Changer d'espace" }));
    expect(await screen.findByLabelText("Identifiant de l'espace")).toBeInTheDocument();
  });

  it("change la langue de l'interface et retient le choix après un remontage", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await screen.findByLabelText("Adresse e-mail");
    await user.selectOptions(screen.getByLabelText("Langue"), "en");

    expect(await screen.findByLabelText("Email address")).toBeInTheDocument();
    expect(screen.queryByLabelText("Adresse e-mail")).not.toBeInTheDocument();

    unmount();
    render(<App />);

    expect(await screen.findByLabelText("Email address")).toBeInTheDocument();
  });
});
