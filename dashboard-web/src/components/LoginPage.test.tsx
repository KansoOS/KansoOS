import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("ouvre la session après un identifiant/mot de passe et un code TOTP valides", async () => {
    const onLoginSuccess = vi.fn();
    const user = userEvent.setup();
    render(<LoginPage onLoginSuccess={onLoginSuccess} />);

    await user.type(screen.getByLabelText("Identifiant"), "test");
    await user.type(screen.getByLabelText("Mot de passe"), "test");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    const totpInput = await screen.findByLabelText("Code de l'application d'authentification");
    await user.type(totpInput, "123456");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    await vi.waitFor(() => expect(onLoginSuccess).toHaveBeenCalledTimes(1));
  });

  it("affiche une erreur et reste sur l'écran login si l'identifiant/mot de passe est incorrect", async () => {
    const onLoginSuccess = vi.fn();
    const user = userEvent.setup();
    render(<LoginPage onLoginSuccess={onLoginSuccess} />);

    await user.type(screen.getByLabelText("Identifiant"), "wrong");
    await user.type(screen.getByLabelText("Mot de passe"), "wrong");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(await screen.findByText("Identifiant ou mot de passe incorrect.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Code de l'application d'authentification")).not.toBeInTheDocument();
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });

  it("affiche une erreur et n'ouvre pas la session si le code TOTP est invalide", async () => {
    const onLoginSuccess = vi.fn();
    const user = userEvent.setup();
    render(<LoginPage onLoginSuccess={onLoginSuccess} />);

    await user.type(screen.getByLabelText("Identifiant"), "test");
    await user.type(screen.getByLabelText("Mot de passe"), "test");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    const totpInput = await screen.findByLabelText("Code de l'application d'authentification");
    await user.type(totpInput, "000000");
    await user.click(screen.getByRole("button", { name: "Vérifier" }));

    expect(await screen.findByText("Code invalide, réessayez.")).toBeInTheDocument();
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });
});
