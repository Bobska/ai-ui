# Git Branch Best Practices

## Branch Naming Convention

### Format
```
<type>/<ticket-id>-<short-description>
```

### Types
- **feature/** - New features
- **bugfix/** or **fix/** - Bug fixes
- **hotfix/** - Urgent production fixes
- **release/** - Release preparation
- **docs/** - Documentation changes
- **refactor/** - Code refactoring
- **test/** - Test additions/changes
- **chore/** - Maintenance tasks

### Examples
```
feature/123-user-authentication
bugfix/456-fix-memory-leak
hotfix/789-critical-security-patch
docs/update-api-documentation
refactor/improve-performance
```

## Branch Strategy: Git Flow

### Main Branches (Long-lived)

#### 1. **main** (or master)
- Production-ready code
- Always stable
- Tagged with version numbers
- Only merge from release or hotfix branches

#### 2. **develop**
- Integration branch for features
- Latest development changes
- Base for feature branches
- Should always build successfully

### Supporting Branches (Short-lived)

#### 3. **Feature Branches**
```bash
# Create from: develop
# Merge into: develop
# Naming: feature/*

git checkout develop
git checkout -b feature/add-chat-interface
# ... work on feature ...
git checkout develop
git merge --no-ff feature/add-chat-interface
git branch -d feature/add-chat-interface
```

#### 4. **Release Branches**
```bash
# Create from: develop
# Merge into: main and develop
# Naming: release/*

git checkout develop
git checkout -b release/1.2.0
# ... final testing and bug fixes ...
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0
git checkout develop
git merge --no-ff release/1.2.0
git branch -d release/1.2.0
```

#### 5. **Hotfix Branches**
```bash
# Create from: main
# Merge into: main and develop
# Naming: hotfix/*

git checkout main
git checkout -b hotfix/1.2.1
# ... fix critical bug ...
git checkout main
git merge --no-ff hotfix/1.2.1
git tag -a v1.2.1
git checkout develop
git merge --no-ff hotfix/1.2.1
git branch -d hotfix/1.2.1
```

## Simplified Strategy: GitHub Flow

For smaller projects or continuous deployment:

### Branches
1. **main** - Always deployable
2. **feature/** - Short-lived feature branches

### Workflow
```bash
# 1. Create branch from main
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. Make commits
git add .
git commit -m "feat: add new feature"

# 3. Push and create PR
git push -u origin feature/new-feature

# 4. After review, merge to main
# (Done via GitHub PR)

# 5. Delete branch
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

## Branch Best Practices

### 1. **Keep Branches Short-Lived**
- Merge within days, not weeks
- Reduces merge conflicts
- Easier to review

### 2. **One Branch = One Purpose**
- Don't mix features in one branch
- Atomic changes
- Easier to revert if needed

### 3. **Delete Merged Branches**
```bash
# Local
git branch -d branch-name

# Remote
git push origin --delete branch-name
```

### 4. **Keep Branches Up to Date**
```bash
# Rebase on develop regularly
git checkout feature/my-feature
git rebase develop

# Or merge develop into feature
git merge develop
```

### 5. **Protect Important Branches**
- Enable branch protection on main/develop
- Require pull request reviews
- Require status checks to pass
- Prevent force pushes

### 6. **Use Pull Requests**
- All changes go through PR
- Enables code review
- Runs CI/CD checks
- Documents decisions

### 7. **Write Clear Branch Names**
- Use descriptive names
- Include ticket/issue number
- Use lowercase and hyphens
- Keep under 50 characters

### 8. **Clean Up Local Branches**
```bash
# List merged branches
git branch --merged

# Delete all merged branches except main
git branch --merged | grep -v "main" | xargs git branch -d

# Prune deleted remote branches
git fetch -p
```

## Branch Workflow Examples

### Starting New Feature
```bash
# 1. Switch to develop and update
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/add-settings-page

# 3. Work on feature
git add .
git commit -m "feat(settings): add settings page UI"

# 4. Push to remote
git push -u origin feature/add-settings-page

# 5. Create Pull Request on GitHub
# 6. After approval, merge via PR
# 7. Delete branch
git checkout develop
git pull origin develop
git branch -d feature/add-settings-page
```

### Handling Conflicts
```bash
# Update your branch with latest develop
git checkout feature/my-feature
git fetch origin
git rebase origin/develop

# If conflicts occur
# 1. Fix conflicts in files
# 2. Stage resolved files
git add <resolved-files>
# 3. Continue rebase
git rebase --continue

# Force push (only if branch not shared)
git push -f origin feature/my-feature
```

## Branch Naming Anti-Patterns

❌ Bad branch names:
- `test`
- `fix`
- `temp`
- `my-branch`
- `branch1`
- `john-work`

✅ Good branch names:
- `feature/user-authentication`
- `bugfix/fix-memory-leak`
- `hotfix/security-vulnerability`
- `docs/api-documentation`

## When to Branch

### Always Branch For:
- ✅ New features
- ✅ Bug fixes
- ✅ Experiments
- ✅ Code refactoring
- ✅ Breaking changes

### Never Branch For:
- ❌ Typo fixes in docs (can commit to develop)
- ❌ Emergency hotfixes (use hotfix branch instead)

## Git Commands Reference

```bash
# Create and switch to new branch
git checkout -b branch-name

# Switch to existing branch
git checkout branch-name

# List all branches
git branch -a

# List remote branches
git branch -r

# Delete local branch
git branch -d branch-name

# Force delete local branch
git branch -D branch-name

# Delete remote branch
git push origin --delete branch-name

# Rename current branch
git branch -m new-name

# Show branch with last commit
git branch -v

# Track remote branch
git checkout --track origin/branch-name

# Untrack remote branch
git branch --unset-upstream
```

## Resources

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Trunk Based Development](https://trunkbaseddevelopment.com/)
- [Atlassian Git Branching](https://www.atlassian.com/git/tutorials/comparing-workflows)
