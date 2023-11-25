---
author: Erison Silva
pubDatetime: 2023-11-28T10:00:00Z
title: How to setup PHP easily on your machine
postSlug: how-to-setup-php-easily-on-your-machine
featured: true
draft: false
tags:
  - php
  - developer
  - beginner
  - setup
ogImage: ""
description: The easiest way to setup whole PHP stack locally with one command only.
---

![An astronauta carring a laptop](@assets/images/how-to-setup-php-easily-on-your-machine.jpg)

My goal with this post is you have a _PHP environment_ running on your machine quickly and easy.
I saw some people struggling to have this done, and tutorials that you need to follow a bunch of steps
for the end, you could run PHP on command line only 😔.

But on sections bellow, you going to find a setup with one **copy** and **past** command, and _you have a complete php stack running_
with a small php structure for you use as study guide in case, you are new on php land.

# Requirements

Before we start, you **MUST** have two tools already installed on your computer.

1. [Git][git_install_link]
2. [Docker][docker_install_link]

> You must also be able to run docker without **sudo**,
> in case you didn't have setup non root, check this [article][docker_non_root_link].

Check if it is working properly running the commands bellow 👇

```sh
git --version
docker compose version
# You gonna see some thing an output like this.
# git version 2.39.2 (Apple Git-143)
# Docker Compose version v2.23.0-desktop.1
```

> For **Windows** users I would say that you must install [WSL][wsl_install_link] to have this working.

# Let's make this work 🚀

After you have done the requirements step, we can now run command to have this ready to play with php 🐘.

Copy and past the command bellow inside of your **project folder**.

> Note: You don't need to run line by line, just **copy the whole code block** bellow and **past on your terminal**.

```sh
git clone https://github.com/shield-wall/easy-php-setup.git \
&& cd easy-php-setup \
&& docker compose up -d --wait \
&& docker compose exec php composer install \
&& mkdir var \
&& mkdir var/cache \
&& chmod 777 var/cache \
&& sleep 10 \
&& docker compose exec -T db sh -c 'exec mysql --defaults-extra-file=.docker/mysql/config.cnf' < .docker/mysql/dump.sql
```

# Troubleshooting

In case the error bellow pop up on your terminal.

```sh
# ERROR 2002 (HY000): Can't connect to local MYSQL server through socket '/var/run/mysqld/mysqld.sock' (2)
```

No worries, it is an easy issue to solve 😉.

The reason for this is because your database is not up yet 😥, But it is fine you just need to wait few minutes or run the command
bellow and check if it is up.

```sh
docker compose ps db
# You should wait to see the status "Up", It could take 1 or 2 minutes depends of your machine.
# easy-php-setup-db-1   mysql     "docker-entrypoint.s…"   db        2 days ago   Up 30 hours   3306/tcp, 33060/tcp
```

After you see the db container **Up**, Run the command bellow.

```sh
docker compose exec -T db sh -c 'exec mysql --defaults-extra-file=.docker/mysql/config.cnf' < .docker/mysql/dump.sql
```

> In case you find out other issue that is not related here, open an [issue][repository_issue_link] on github.

# Commands

| Command                                  | Description                                                          |
| ---------------------------------------- | -------------------------------------------------------------------- |
| docker compose up -d                     | Start the containers                                                 |
| docker compose down                      | Stop containers                                                      |
| docker compose exec php composer install | Execute some **php command** that you need, or **composer command**. |

# Frameworks

This project should work, out the box, for the most _modern php frameworks_ such as [Symfony][symfony_link] and [Laravel][laravel_link].

In case you just want to use the environment, you can remove all files and keep `.docker` and `docker-compose.yml` only.

But if you find some strange behaviour, feel free to open an [issue][repository_issue_link]
or even better provide a PR to improve the [project][repository_link] 🚀.

# Study guide

As you can see I added a tiny php structure, I did this for two reasons.

1. I don't want to give you a poor example doing everything in one single file, and you think that is the way that we use in nowadays.
2. I want also give you a code, that you could use to investigate what is happening and study.

Then I would say it is not 100% perfect, But I want to add more doc and good examples into the code, then be tuned 😎.

[git_install_link]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[docker_non_root_link]: https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user
[docker_install_link]: https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository
[wsl_install_link]: https://learn.microsoft.com/en-us/windows/wsl/install
[repository_issue_link]: https://github.com/shield-wall/easy-php-setup/issues
[repository_link]: https://github.com/shield-wall/easy-php-setup
[symfony_link]: https://symfony.com/
[laravel_link]: https://laravel.com/
