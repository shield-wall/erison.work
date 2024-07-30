---
author: Erison Silva
pubDatetime: 2023-11-28T10:00:00Z
title: How to extend final class
postSlug: how-to-extend-final-class
featured: true
draft: false
tags:
  - developer
  - partner

ogImage: https://70a4a652.erison-work.pages.dev/_astro/how-to-extend-final-class.01154356_ZozUOa.webp.jpg
description: You want to change an behaviour from a class that is final, But you do not have control over this class, in this article I can give you one alternative.
---

![a screenshot with a php code example and an error message saying that it not possible extend final class](@assets/images/how-to-extend-final-class.png)

If you are strugguling to extend a class that is `final`, and you can't remove or don't have the code control, then this article can give you an alternative.

Sometime you want to overide a class behaviour, But you don't have control over that class, like a thrid part code.

# Why is it final?

You going to see projects that all concrete classes are closed to extends and others not, why?

The short answer is **number of mantainers**.

> to make this article I compared some projects, and I asked myself why big open source projects, like symfony doesn't close their classes to extend.
> and in this thread I got some thoughts for a possible answer.

Projetcs with active mantainers can give you more flexibilty, But this flexibilty cost a code/solution more elaborated and for this be possible you need a hight level team.

in the other hand when you force the dev implement an interface,

I offen see more and more open source projects closing their classes for extention, and It is happen because, it is more complicate
to keep **BC (Backward Compatibility) Promise**

# How to solve it?

Ok, So nice, But I still need to change the behaviour of a final class, how can I solve this?

I solve this with [Decorator partener][decorator_link]!

Let's assume there is an **external lib** with a `Render` class and you want to change the `display` method implementation.

```php
namespace ExternalLib;

interface RenderInterface
{
    public function display(): string;
}

// ....
namespace ExternalLib;

use ExternalLib\RenderInterface;

final class Render implements RenderInterface
{
    public function __construct(readonly private TemplateInterface $template) {}

    public function display(string $templatePath): string
    {
        return $this->templateEngineA->render($templatePath);
    }
}

// ....
namespace ExternalLib;

use ExternalLib\RenderInterface;

final class UserController
{
    public function __construct(readonly private RenderInterface $render) {}

    public function indexAction(): Response
    {
        $this->render->display('templates/users/index.template');
    }
}
```

```php
//It is just to make a simple example, but usually it is handled by your Frameworks' Dependency injection.
$template = new Template();
$render = new \ExternalLib\Render($template); 👈 // we goint to change this line to our new render.
$controller = new \ExternalLib\UserController($render);
$controller->indextAction();
```

Now we are going to decorate `Render` to `CustomRender` class

```php
namespace App;

use ExternalLib\RenderInterface;

final class CustomRender implements RenderInterface
{
    public function __construct(
        readonly private RenderInterface $render,
        readonly private CacheInterface $cache,
    ) {}

    public function display(string $templatePath): string
    {
        if($this->cache->has($templatePath)) {
            return $this->cache->get($templatePath);
        }

        $template = $this->render->display($templatePath);

        //We are using $templatePath as cache's key.
        $this->cache->add($templatePath, $template);

        return $template;
    }
}
```

```php
// New injection
$render = new \ExternalLib\Render($template);
$cache = new CacheA();
$customRender = \App\CustomRender($render, $cache); 👈 // It is our new rander.
$controller = new \ExternalLib\UserController($yourCustomRender); 👈 //Here we are injecting our new render.
```

After you have created a new decorator you just need to inject your **CustomRender** to **\ExternalLib\UserController**,
and when `indexAction` execute `$this->render->display($templatePath)`, it will call your `CustomRender`.

> As you can see you didn't need to reimplement the whole render just the method that you want and reuse the current code from external lib.

> I am using **PHP** <3, But It works for any OOP language.

# Design problems

Sometime you will find Interfaces that forced you implement method that you don't want to implement.
e.g:

```php
namespace ExternalLib;

interface RenderInterface
{
    public function display(): string;

    public function methodA(): int;

    public function methodB(): string;

    //.. sometime more methods.
```

But even you want to change display behaviour only, you still need to implement others methods in your decorate, and it will be like this.

```php
namespace App;

use ExternalLib\RenderInterface;

class CustomRender implements RenderInterface
{
    public function __construct(readonly private RenderInterface $externalLibRender) {}

    public function display(): string
    {
        // your implementation
    }

    public function methodA(): int
    {
        return $this->externalLibRender->methodA();
    }

    public function methodB(): string
    {
        return $this->externalLibRender->methodB();
    }
}
```

If you do the example above it still work, it won't be pretty, But works :D.

But it has a design problem, because an interface shouldn't force you implement a method.

> **Interface Segregation Principle**
>
> A client should never be forced to implement an interface that it doesn’t use, or clients shouldn’t be forced to depend on methods they do not use.

I don't want to be so strict and say that an interface must have one method only, But if it is forcing you implement a lot of method,
Then make a suggestion in the lib that is doing it, and see if it could be improved.

### Suggestions?

if you have any suggestion or point that I could improve please open a discussion [here][discusson_link], I am open to hear your opnion about this.

[discusson_link]: https://github.com/shield-wall/erison-work/discussions
[decorator_link]: https://refactoring.guru/design-patterns/decorator
