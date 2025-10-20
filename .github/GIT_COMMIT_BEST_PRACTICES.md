# Git Commit Best Practices

## Commit Message Format

### Structure
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, whitespace)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding or correcting tests
- **chore**: Changes to build process or auxiliary tools
- **ci**: Changes to CI configuration files and scripts

### Subject Line Rules
1. **Limit to 50 characters** (hard limit: 72)
2. **Use imperative mood** ("Add feature" not "Added feature")
3. **Capitalize first letter**
4. **No period at the end**
5. **Be concise but descriptive**

### Body (Optional but Recommended)
1. **Wrap at 72 characters**
2. **Explain WHAT and WHY, not HOW**
3. **Separate from subject with blank line**
4. **Use bullet points for multiple items**

### Footer (Optional)
- **Breaking changes**: Start with "BREAKING CHANGE:"
- **Issue references**: "Closes #123" or "Fixes #456"

## Good Commit Examples

```
feat(chat): add real-time message streaming

Implement WebSocket connection for streaming AI responses
character by character to improve user experience.

- Add streaming API endpoint handler
- Update UI to display partial messages
- Add loading indicator during stream
```

```
fix(memories): combine user_fact and user_facts types

The API returns both user_fact and user_facts as separate
types. Normalize user_facts to user_fact to prevent duplicate
entries in the UI.

Fixes #42
```

```
docs: add API endpoint documentation

Create comprehensive documentation for all REST API endpoints
including request/response examples and error codes.
```

## Commit Best Practices

### 1. **Commit Often**
- Make small, logical commits
- Each commit should represent one logical change
- Easier to review, revert, and understand

### 2. **Atomic Commits**
- Each commit should be self-contained
- Should not break the build
- Should pass all tests

### 3. **Don't Commit Half-Done Work**
- Commit when a feature/fix is complete
- Use git stash for temporary storage

### 4. **Test Before Committing**
- Run tests locally
- Ensure code compiles/runs
- Check for linting errors

### 5. **Write Meaningful Messages**
- Future you will thank you
- Helps team understand changes
- Makes code review easier

### 6. **Don't Commit Generated Files**
- Use .gitignore for build artifacts
- Exclude node_modules, dist/, etc.
- Commit source code, not compiled code

### 7. **Use Branches for Features**
- Don't commit directly to main/master
- Create feature branches
- Delete branches after merging

### 8. **Review Changes Before Committing**
- Use `git diff` to review changes
- Use `git add -p` for partial commits
- Ensure no debug code or secrets

## Bad Commit Examples (Avoid)

❌ `fix stuff`
❌ `WIP`
❌ `asdfasdf`
❌ `Fixed bug`
❌ `Update files`
❌ `Commit before leaving`

## Git Commands for Good Commits

```bash
# Stage specific files
git add <file1> <file2>

# Stage all changes
git add .

# Interactive staging (choose hunks)
git add -p

# Review what will be committed
git diff --staged

# Commit with inline message
git commit -m "feat: add user authentication"

# Commit with editor for longer message
git commit

# Amend last commit (if not pushed)
git commit --amend

# Show commit history
git log --oneline --graph
```

## Semantic Versioning Connection

Commit types relate to version bumps:
- **feat** → Minor version (1.1.0 → 1.2.0)
- **fix** → Patch version (1.1.0 → 1.1.1)
- **BREAKING CHANGE** → Major version (1.1.0 → 2.0.0)

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)
