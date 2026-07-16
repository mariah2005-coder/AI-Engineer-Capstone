# Workflow Comparison: Vague vs Precise Prompting

## Round 1: Vague Prompt
**Prompt used:** "Make me a settings form"

Since the repository was empty, the AI scaffolded an entire React + TypeScript
+ Vite application from scratch. It produced a visually polished profile
settings form with sections for Public Profile (avatar upload, display name,
username, bio, location, website), Account (email, timezone), and Privacy &
Notifications (visibility radio buttons, notification toggles).

On testing, Round 1 did include validation, but only on-submit: typing invalid
data and clicking "Save changes" revealed error messages afterward (e.g.
"Enter a valid email address," "Website must start with http:// or https://").
The Save button itself was never disabled, so a user could click it repeatedly
before noticing anything was wrong, and there was no real-time feedback while
typing.

## Round 2: Precise Prompt
**Prompt used:** A detailed spec listing exact fields (Name, Email, Phone),
specific validation rules for each, a requirement for inline error messages,
a Save button disabled until valid, accessible labels, and an explicit
instruction to plan first, write the code, then write and run tests.

Round 2 validated in real time as I typed, showing errors immediately (e.g.
"Name must be at least 2 characters") without needing to click Save first.
The Save button stayed genuinely disabled until every required field was
valid, so an invalid submission was not possible. The AI also wrote and ran
12 unit tests covering the validation logic, all of which passed.

## Key Differences
- **Correctness:** Both rounds validated input, but Round 1 only checked on
  submit while Round 2 validated live and blocked invalid submissions
  entirely by disabling Save.
- **Feedback timing:** Round 1 required a failed submit attempt before
  showing errors; Round 2 gave immediate feedback while typing.
- **Accessibility:** Round 1's errors appeared as plain red text with no
  clear indication of which input was tested for screen readers; Round 2
  explicitly used aria-describedby to link errors to their fields.
- **Scope:** Round 1 built a much larger form than needed because I gave no
  constraints; Round 2 built exactly the three fields specified.

## Review Effort
Round 1 initially looked incomplete because I had to click Save before any
validation appeared, which meant additional manual testing was needed just
to confirm validation existed at all. Round 2 needed almost no extra review
— the plan-then-test loop caught issues early, and real-time validation was
immediately verifiable by typing into the form.

## AI Mistake Noticed
While building Round 2, the AI's first pass at App.tsx did not correctly
import the ProfileSettingsForm component, which caused the app to fail to
render until it caught and fixed the import error itself during the
plan-test loop. This shows that even with a precise prompt, verification
steps (running the app, running tests) remain necessary.