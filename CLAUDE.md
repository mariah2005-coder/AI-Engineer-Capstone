# Project Guidelines

## Stack
- Language: JavaScript / TypeScript
- Tools: Claude Code

## Conventions
- Commit messages follow Conventional Commits format (feat:, fix:, docs:, chore:)
- Code should be clean and commented

## Lessons from AI-assisted development (FE-03 drill)

- Always specify exact file paths, field names, and validation rules in prompts — vague prompts skip validation entirely
- Explicitly instruct AI to write and run tests; it does not do this by default without being asked
- Request accessibility requirements (labels, aria attributes) explicitly — AI does not add these unless asked