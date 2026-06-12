/**
 * Enspyr flyer forge — Delia riffs on the existing A4 flyer.
 *
 * The base flyer embeds a ~119KB `data:image/svg+xml` asset (logo/graphic). `protectedPatterns`
 * swaps it for a tiny {{ASSET_n}} token before the builder sees it and re-injects it byte-exact
 * after — so it costs no tokens, can't be truncated, and survives every iteration unchanged.
 */
// Bare specifier — resolves in BOTH contexts: the worker bundles it from node_modules (the
// github-pinned dep), the browser resolves it via the <script type="importmap"> in index.html.
// This is what kills the snapshot copy: one source of truth (forge-web-app@v0.5.0), no local src/.
import { defineProfile } from "forge-web-app";

export const profile = defineProfile({
  name: "enspyr-flyer",
  // Same-origin in production (worker serves the UI); localhost for the wrangler-dev smoke test.
  allowedOrigins: ["https://forge.imagineering.cc", "http://localhost:8788"],

  artifact: {
    kind: "html-document",
    spec:
      "ONE self-contained A4 flyer as a single HTML document — all CSS inline in a <style> tag, " +
      "no external JS. Print-friendly at A4 (210x297mm); renders immediately in an iframe. Preserve " +
      "every {{ASSET_n}} placeholder exactly (each is a large embedded graphic removed to save space).",
    baseArtifactUrl: "/base", // the existing Enspyr flyer, served same-origin
  },

  builderPersona:
    "You are the Builder for Enspyr's marketing flyers. You produce clean, confident, print-ready A4 " +
    "one-pagers with strong hierarchy, generous whitespace, and on-brand tone (Enspyr: 'we eat " +
    "complexity for breakfast'). You evolve the existing flyer per the riff — you never rebuild from scratch.",

  canonCriteria: [
    "honors the riff the user described",
    "keeps Enspyr's brand voice and any preserved graphics ({{ASSET_n}}) intact and well-placed",
    "has a clear headline, a single core message, and an obvious call to action",
    "is print-clean at A4: legible type, sensible margins, no overflow",
    "looks polished and modern, not template-default",
  ],

  // Protect the big inlined svg+xml graphic (URL-encoded data URI) from the loop.
  protectedPatterns: ["data:image/svg\\+xml[^\"')]+"],

  // Per-user "save to Drive": each iteration card lets the signed-in user (Delia) save that flyer
  // version straight to their OWN Google Drive (drive.file scope — no server creds). Public client
  // id from the Enspyr Google Auth Platform app (project enspyrco); locked to this origin.
  googleClientId: "588100172166-974g7okhs0ein5de5011g48qk42vthfm.apps.googleusercontent.com",
  driveFolderName: "Enspyr Flyers",

  // ACCESS GATE: cast access is gated by Google identity instead of the shared passphrase. Only
  // these verified Google accounts may cast — the worker checks the signed-in ID token's email
  // against this list. Replaces FORGE_PASSPHRASE for this instance (the phrase is no longer taken).
  allowedEmails: ["dhizkch@gmail.com", "nick.meinhold@gmail.com"],

  // Flyers are larger than landing pages — give the builder headroom and a roomier default budget.
  maxBuilderTokens: 8192,
  tokenBudget: 40000,
  maxTokenBudget: 80000,

  examples: [
    "make the headline bigger and the call-to-action impossible to miss",
    "warmer, more human tone — less corporate",
    "add a short three-point 'what we do' section",
    "tighten the layout and increase whitespace",
    "lead with the value proposition, move the details down",
  ],

  copy: {
    castButton: "Forge the flyer",
    judgmentTitle: "evaluation",
    nextFix: "next change:",
    wishPlaceholder: "e.g. make the hero bolder and add a clear call to action",
  },
});
