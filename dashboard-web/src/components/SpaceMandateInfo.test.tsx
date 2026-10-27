import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SpaceMandateInfo } from "./SpaceMandateInfo";

describe("SpaceMandateInfo", () => {
  it("affiche le périmètre du mandat comme une liste d'éléments distincts, pas un statut binaire", async () => {
    render(<SpaceMandateInfo spaceId="space-1" locale="fr" />);

    expect(await screen.findByText("Espace de Léo")).toBeInTheDocument();

    // Chaque capacité du périmètre doit être visible individuellement.
    expect(await screen.findByText("contacts.gerer")).toBeInTheDocument();
    expect(screen.getByText("niveaux.proposer")).toBeInTheDocument();
    expect(screen.getByText("journal.consulter")).toBeInTheDocument();

    // Les dates de validité du mandat sont affichées, pas juste "actif", et en
    // UTC, parce que le mandat mock commence le 1er janvier 2026 à minuit UTC
    // et ça doit rester affiché tel quel, pas décalé au 31 décembre 2025 par un fuseau local.
    expect(screen.getByText(/1 janvier 2026.*1 janvier 2027/)).toBeInTheDocument();
  });

  it("affiche un message clair quand l'espace n'a aucun mandat en vigueur", async () => {
    render(<SpaceMandateInfo spaceId="space-2" locale="fr" />);

    expect(await screen.findByText("Espace sans mandat")).toBeInTheDocument();
    expect(await screen.findByText("Aucun mandat en vigueur pour cet espace.")).toBeInTheDocument();
  });

  it("affiche un message clair quand l'espace est introuvable", async () => {
    render(<SpaceMandateInfo spaceId="space-inconnu" locale="fr" />);

    expect(await screen.findByText("Espace introuvable.")).toBeInTheDocument();
  });
});
