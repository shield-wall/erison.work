---
pubDatetime: 2024-10-28T14:00:00+02:00
title: "Get Frontend Theme Updates Using Git: Part 2"
slug: get-frontend-theme-updates-using-git-part-2
featured: true
draft: false
tags:
  - git
  - frontend
description: In this article, I’ll share an advanced method for updating your projects based on frontend themes using Git. You'll learn how to efficiently cherry-pick commits from the upstream repository and organize your local commits for a cleaner Git history. This approach not only simplifies future updates but also enhances the overall management of your codebase. Whether you're a developer looking to streamline your workflow or simply want to keep your frontend project up to date, this guide will provide you with the necessary steps and insights.
---

Welcome to the second part of my guide on updating projects based on frontend themes. In this article, I’ll share my approach to obtaining new updates from the upstream repository.

This method requires a bit more **experience** with Git, even though I’ll provide the necessary commands. It's important to **understand** what each command does, as you’ll be utilizing Git features like cherry-picking, squashing, and reordering commits.

Feel free to use an IDE of your choice, such as `LazyVim`, `VSCode`, `WebStorm` and so on.

## Table of contents

## Convert All Commits into One

The first step is to retrieve all commits from the upstream repository (`astro-paper`) and consolidate them into a single commit.

Start by pulling all commits from upstream:
```bash
git pull --rebase astro-paper v4.5.0 --allow-unrelated-histories
```
After running this command, your commit history should look something like this:

    d89fb48 (HEAD -> main, tag: v4.5.0) bump: version 4.4.0 → 4.5.0
    c164b5e build(deps): upgrade dependencies (#381)
    cbbb3eb perf: preload font and load theme script asynchronously (#380)
    1a19eb5 build(deps): bump path-to-regexp from 6.2.2 to 6.3.0 (#379)
    66c2664 build(deps): bump dset from 3.1.3 to 3.1.4 (#377)

> Note: At this point, you MUST have only upstream commits. If you have any local changes, move them to another branch before proceeding.

Now, let’s convert all commits related to astro-paper into a single commit:
```bash
git reset --soft $(git rev-list --max-parents=0 HEAD) \
&& git commit --amend --no-edit
```
After executing these commands, your commit history will now appear as follows:

    7f94f8b (HEAD -> main) Initial commit from Astro

## Organize our local commits

Organizing your local commits is an essential step in maintaining a clean and manageable Git history. I recommend using `rebase` in addition to `merge` to simplify your Git tree and make reordering easier, which will be necessary later.

Here’s how I suggest organizing your commits:

    2bedd59 (HEAD -> main) New post: Post xyz
    cd4b199 [erison.work] new files
    196e885 [erison.work] local changes
    e85f005 [AstroPaper][4.5.0] Initial commit

- **New Post Commits:** For each new post you create, make a separate commit. If you need to make updates, squash your changes into this commit. This way, you’ll always have one post per commit.
- **New Files:** Use the `[erison.work] new files` commit to keep track of any new files you add to the project.
- **Local Changes:** The `[erison.work] local changes` commit should contain all files that originate from the original repository. This approach concentrates any conflicts that may arise into this commit, making them easier to resolve.
- **Initial Commit from AstroPaper:** For the `[AstroPaper] Initial commit`, I recommend renaming this commit to reflect its purpose and keeping all new files from the upstream repository here.

### Update Your Repository from Upstream

> In this section, I will use the command line, but you can also accomplish these tasks using your favorite IDE.

### Cherry-Picking New Commits from Upstream

Now it’s time to update our blog when a new release appears in the main repository. In this case, we’ll bump to version `4.7.0`. To do this, we’ll cherry-pick the commits between versions `4.5.0` and `4.7.0`.

Run the following command:
```bash
git cherry-pick v4.5.0..v4.7.0
```
You should see several new commits on top of New post: Post xyz, similar to this:

    a16d766 (HEAD -> main) bump: version 4.6.0 → 4.7.0
    0b76073 feat: add archives page with configurable menu (#386)
    e511fee chore: format .github markdown files with Prettier (#400)
    7dbf18e bump: version 4.5.1 → 4.6.0
    6842fe4 chore: add FUNDING.yml
    e252f35 chore(template): add PR template
    1e9e274 docs: add contributing guidelines
    042e2de chore(templates): add issue templates
    9b03638 docs: add code of conduct
    2eb7700 feat: add edit post feature in blog posts (#384)
    491e59c build(deps): bump cookie and astro (#397)
    d16fbaa bump: version 4.5.0 → 4.5.1
    c3fc175 refactor: remove duplicate [page].astro (#389)
    d4fab3e fix(docs): update giscus blog post (#392)
    df91ced build(deps): bump rollup from 4.21.2 to 4.22.4 (#390)
    eee2dd9 fix: add missing posts sorting (#383)
    d174b09 build(deps): bump vite from 5.4.3 to 5.4.6 (#382)
    bf73644 New post: Post xyz
    e88f297 [erison.work] new files
    95d2f8e [erison.work] local changes
    6a03576 [AstroPaper] Initial commit


### Squash Commits into the Initial Commit

Next, we need to squash all the new commits into one and then squash that with the Initial commit. Start by running:
```bash
git rebase -i --root
```
In the interactive rebase editor, you will need to squash all commits after your post. Your rebase file should look like this:

    pick 6a03576 [AstroPaper] Initial commit
    pick 95d2f8e [erison.work] local changes
    pick e88f297 [erison.work] new files
    pick bf73644 New post: Post xyz
    pick d174b09 build(deps): bump vite from 5.4.3 to 5.4.6 (#382)
    squash eee2dd9 fix: add missing posts sorting (#383)
    squash df91ced build(deps): bump rollup from 4.21.2 to 4.22.4 (#390)
    squash d4fab3e fix(docs): update giscus blog post (#392)
    squash c3fc175 refactor: remove duplicate [page].astro (#389)
    squash d16fbaa bump: version 4.5.0 → 4.5.1
    squash 491e59c build(deps): bump cookie and astro (#397)
    squash 2eb7700 feat: add edit post feature in blog posts (#384)
    squash 9b03638 docs: add code of conduct
    squash 042e2de chore(templates): add issue templates
    squash 1e9e274 docs: add contributing guidelines
    squash e252f35 chore(template): add PR template
    squash 6842fe4 chore: add FUNDING.yml
    squash 7dbf18e bump: version 4.5.1 → 4.6.0
    squash e511fee chore: format .github markdown files with Prettier (#400)
    squash 0b76073 feat: add archives page with configurable menu (#386)
    squash a16d766 bump: version 4.6.0 → 4.7.0

After squashing, you should see:

    a5c427a (HEAD -> main) build(deps): bump vite from 5.4.3 to 5.4.6 (#382)
    bf73644 New post: Post xyz
    e88f297 [erison.work] new files
    95d2f8e [erison.work] local changes
    6a03576 [AstroPaper] Initial commit

Now, squash the commit `a5c427a` with the initial one by updating the rebase file:

    pick 6a03576 [AstroPaper] Initial commit
    squash a5c427a build(deps): bump vite from 5.4.3 to 5.4.6 (#382)
    pick 95d2f8e [erison.work] local changes
    pick e88f297 [erison.work] new files
    pick bf73644 New post: Post xyz

After finalizing the squashing, you should have:

    b49cf90 (HEAD -> main) New post: Post xyz
    27b32d6 [erison.work] new files
    b25d845 [erison.work] local changes
    7cdeca2 [AstroPaper] Initial commit

Now you are done! When you want to update your repository, just follow the steps outlined in this section.

## Conclusion

This approach requires a bit more work, but it offers the advantage of maintaining a well-organized git tree, making it easier to manage changes in the future.

If this guide helped you, or if you ran into any issues, let me know in the comments below!

