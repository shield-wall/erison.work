---
pubDatetime: 2024-10-28T14:00:00+02:00
title: "Get Frontend Theme Updates Using Git: Part 1"
slug: get-frontend-theme-updates-using-git-part-1
featured: false
draft: false
tags:
  - beginner
  - git
  - frontend
description: When starting a project using frontend themes, you may want to incorporate new features or bug fixes. In this article, I will provide an alternative approach to effectively manage these updates.
---

Frontend **themes** and **templates** are incredibly helpful for starting a project or using as a base, letting you focus on what you need—like I’m doing with this blog! I’m using the [*Astro Paper theme*][astro-paper], which includes amazing features for a blog, so I can focus entirely on the **content** I want to share.

But as time goes on, new features and *bug fixes* are added, and keeping your **site up-to-date** with the latest **updates** from the *original theme repository* is essential. In this post, I’ll show you a straightforward method to **update your blog or website** with changes from the original repository, using **Git** for a seamless upgrade.

## Table of contents

## Setting Up for Updates

Before pulling updates from the original theme or template, let’s first set up a **backup branch** and configure the **upstream repository**. This backup keeps a safe copy of your current work, so if anything goes wrong during the update process, you can easily revert to the original version.

Start by creating a backup branch to save your original changes:
```bash
git checkout -b backup_main
```
After that, return to your primary branch (`main` is used here):
```bash
git checkout main
```
Next, add the original theme’s repository as your upstream. Since I’m using Astro Paper, I’ll run the command below:
```bash
git remote add astro-paper https://github.com/satnaing/astro-paper.git
```
> You can get the repository URL on GitHub by clicking `<> Code`, then selecting the `HTTPS` tab.

To verify the repository was added correctly, run this command.
```bash
git remote -v
```
Your output should look similar to this:

    astro-paper     https://github.com/satnaing/astro-paper.git (fetch)
    astro-paper     https://github.com/satnaing/astro-paper.git (push)
    origin  git@github.com:shield-wall/erison-work.git (fetch)
    origin  git@github.com:shield-wall/erison-work.git (push)

## Pulling Commits from Upstream repository

Let’s assume we’re on version `4.5.1`, with the following git history:

    31a8f0b (HEAD -> build/update-astro-paper) My local changes
    d56bc0c bump: version 4.5.0 → 4.5.1
    b16fba8 refactor: remove duplicate [page].astro (#389)
    c11b2a2 fix(docs): update giscus blog post (#392)
    149264a build(deps): bump rollup from 4.21.2 to 4.22.4 (#390)

To upgrade to version `4.7.0`, run the following command:
```bash
git pull --rebase astro-paper v4.7.0 --allow-unrelated-histories
```
> Note: Conflicts may occur during this process. If they do, you'll need to resolve them to complete the pull.

This will pull all commits from the upstream repository and add them below your changes (commit `779c4f8`):

    779c4f8 (HEAD -> build/update-astro-paper) My local changes
    7fdebb5 (tag: v4.7.0) bump: version 4.6.0 → 4.7.0
    7573617 feat: add archives page with configurable menu (#386)
    58a0d25 chore: format .github markdown files with Prettier (#400)
    cdf31a2 (tag: v4.6.0) bump: version 4.5.1 → 4.6.0
    e1ba9c1 chore: add FUNDING.yml

> **Note**: If you're a few versions behind, you can update incrementally, version by version, and resolve conflicts as they come up.

Now, if everything looks good, you can push the changes to your repository with the following command:
```bash
git push origin main --force
```
Since we used `git pull --rebase`, the commit hash for `My local changes` changed from `31a8f0b` to `779c4f8`. To push these changes, we need to use the `--force` option.

> Remember, we’re pulling commits from the upstream (`astro-paper`) and pushing them to our repository (`origin`).

## Tips

### Minimize Direct Changes to Upstream Files

Try to avoid making significant changes to files that originate from the upstream repository. This will reduce conflicts when you update to newer versions. Instead, consider creating new files and using imports, for example, for CSS files or custom components.

### Handling conflicts in `package-lock.json`

The `package-lock.json` file often generates conflicts. In these cases, I typically discard changes in this file, then run:

```bash
npm install
npm update
```

## Conclusion

The `git pull ...` command is a straightforward way to incorporate features and bug fixes from the original repository, but it can make your Git history a bit confusing. If you're willing to invest a little more time, I’ve written a second article explaining how I manage my updates while keeping my Git history clean.

Check it out: [Get Frontend Theme Updates Using Git: Part 2][second-article].

If this guide helped you or if you encountered any issues, please let me know in the comments below!

[astro-paper]: https://github.com/satnaing/astro-paper
[second-article]: /posts/get-frontend-theme-updates-using-git-part-2
