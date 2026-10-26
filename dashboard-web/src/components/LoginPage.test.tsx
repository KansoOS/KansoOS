import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("ouvre la session après un email/mot de passe et un code TOTP valides (compte avec MFA)", async () => {
    const onLoginSuccess = vi.fn();
    const user = userEvent.setup();
    render(<LoginPage onLoginSuccess={onLoginSuccess} />);

    await user.type(screen.getByLabelText("Adresse e-mail"), "test@kanso.test");
    await user.type(screen.getByLabelText("Mot de passe"), "test1234");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    const totpInput = await screen.findByLabelText("Code de l'application d'authentification");
    await user.type(totpInput, "123456");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    await vi.waitFor(() => expect(onLoginSuccess).toHaveBeenCalledTimes(1));
  });

  it("ouvre la session directement, sans étape TOTP, pour un compte sans MFA", async () => {
    const onLoginSuccess = vi.fn();
    const user = userEvent.setup();
    render(<LoginPage onLoginSuccess={onLoginSuccess} />);

    await user.type(screen.getByLabelText("Adresse e-mail"), "nomfa@kanso.test");
    await user.type(screen.getByLabelText("Mot de passe"), "nomfa1234");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    await vi.waitFor(() => expect(onLoginSuccess).toHaveBeenCalledTimes(1));
    expect(screen.queryByLabelText("Code de l'application d'authentification")).not.toBeInTheDocument();
  });

  it("affiche une erreur et reste sur l'écran login si l'email/mot de passe est incorrect", async () => {
    const onLoginSuccess = vi.fn();
    const user = userEvent.setup();
    render(<LoginPage onLoginSuccess={onLoginSuccess} />);

    await user.type(screen.getByLabelText("Adresse e-mail"), "wrong@kanso.test");
    await user.type(screen.getByLabelText("Mot de passe"), "wrongpass");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(await screen.findByText("Adresse e-mail ou mot de passe incorrect.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Code de l'application d'authentification")).not.toBeInTheDocument();
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });

  it("affiche une erreur et n'ouvre pas la session si le code TOTP est invalide", async () => {
    const onLoginSuccess = vi.fn();
    const user = userEvent.setup();
    render(<LoginPage onLoginSuccess={onLoginSuccess} />);

    await user.type(screen.getByLabelText("Adresse e-mail"), "test@kanso.test");
    await user.type(screen.getByLabelText("Mot de passe"), "test1234");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    const totpInput = await screen.findByLabelText("Code de l'application d'authentification");
    await user.type(totpInput, "000000");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    expect(await screen.findByText("Code invalide, réessayez.")).toBeInTheDocument();
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });
});
