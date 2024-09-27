---
author: Erison Silva
pubDatetime: 2024-10-10T09:00:00+02:00
title: How to enhance final classes from open source code with decorator pattern
slug: how-to-enhance-final-classes-from-open-source-code-with-decorator-pattern
featured: true
draft: false
tags:
  - pattern
  - developer
description: Discover how the Decorator pattern can effectively enhance and modify functionalities from open source code, particularly when working with final classes. This comprehensive guide delves into practical strategies for achieving code flexibility without inheritance, offering real-world examples and best practices from popular open source projects. Learn how to leverage design patterns to improve code maintainability and reusability in your software development projects.
---

In many open source repositories, especially those with just a _few maintainers_, you’ll often find classes declared as **final**.
This approach allows maintainers to make changes without worrying too much about backward compatibility.
However, it can also make the code a bit challenging to modify. The good news is that it’s not as difficult as it seems!
Since these classes usually implement interfaces and utilize _composition_, we can tap into the advantages of the [Decorator pattern][decorator-pattern].

## Table of contents

## Utilizing an open source project

In my search for an open source project with a significant user base, I came across [EasyAdminBundle][easy-admin-bundle], which boasts over **18,000 users** and **4,000 stars** on GitHub.
For this example, I’ll be focusing on the [AdminUrlGenerator.php][admin-url-generator] file. We will implement a dispatch event that gets triggered when the [generate method][admin-url-generator-method] is called.

## Building a decorator class

Since AdminUrlGenerator.php is a final class, we cannot extend it or override the `generate` method. In this case, a suitable alternative is to use a decorator.

```php
<?php

declare(strict_types = 1);

namespace App\Decorator;

use App\Event\UrlGeneratedEvent;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGeneratorInterface;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\DependencyInjection\Attribute\AutowireDecorated;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

#[AsDecorator(decorates: AdminUrlGenerator::class)]
final class AdminUrlGeneratorDecorator implements AdminUrlGeneratorInterface
{
    public function __construct(
        #[AutowireDecorated]
        private AdminUrlGeneratorInterface $adminUrlGenerator,
        private EventDispatcherInterface $event,
    ) {
    }

    public function generateUrl(): string
    {
          $url = $this->adminUrlGenerator->generate();
          $this->event->dispatch(new UrlGeneratedEvent($url));

          return $url;
    }

    public function setRoute(string $routeName, array $routeParameters = []): self
    {
        $this->adminUrlGenerator->setRoute($routeName, $routeParameters);

        return $this;
    }

    public function get(string $paramName): mixed
    {
        return $this->adminUrlGenerator->get($paramName);
    }

    //....
}
```

## Analyzing the AdminUrlGeneratorDecorator

```php
#[AsDecorator(decorates: AdminUrlGenerator::class)]

//...

#[AutowireDecorated]
```

Since EasyAdminBundle is built on the _Symfony Framework_, it provides a way to [decorate classes][symfony-docorator] using Symfony's built-in features. In the `decorates` parameter, you specify the class you want to decorate, which allows Symfony to inject `AdminUrlGeneratorDecorator` in place of the original `AdminUrlGenerator`.

By adding the `#[AutowireDecorated]` attribute above the `$adminUrlGenerator` property, Symfony automatically injects the original AdminUrlGenerator class into that parameter. This allows the decorator to use the functionality of the original class and extend it as needed.

```php
<?php

final class AdminUrlGeneratorDecorator implements AdminContextProvider
```

Here, we are creating the `AdminUrlGeneratorDecorator` class and implementing the same interface as `AdminUrlGenerator`, which is the `AdminContextProvider` interface. This is crucial because, by doing so, Symfony will inject our `AdminUrlGeneratorDecorator` class everywhere the `AdminContextProvider` interface is used. This allows us to modify or extend the behavior of `AdminUrlGenerator` without changing its core functionality, ensuring compatibility across the entire system.

```php
<?php

    public function __construct(
      #[AutowireDecorated]
      private AdminUrlGenerator $adminUrlGenerator,
      private EventDispatcherInterface $event,
    ) {
    }
```

- `AdminUrlGenerator` is the original class whose behavior we want to modify.
- `EventDispatcherInterface` is a Symfony event dispatcher that we'll use inside the method we plan to override. This will allow us to trigger custom events and extend the behavior without modifying the original class directly.

```php
<?php
    public function generateUrl(): string
    {
          $url = $this->adminUrlGenerator->generate();
          $this->event->dispatch(new UrlGeneratedEvent($url));

          return $url;
    }
```

This is the method we want to modify.

In the first line, we call the original method to generate the URL.

The second line dispatches our custom event, passing the generated URL as an argument

Finally, we return the URL generated by the original method, ensuring that the decorator retains the original behavior while adding our enhancements.

```php
<?php
    public function setRoute(string $routeName, array $routeParameters = []): self
    {
        $this->adminUrlGenerator->setRoute($routeName, $routeParameters);

        return $this;
    }

    public function get(string $paramName): mixed
    {
        return $this->adminUrlGenerator->get($paramName);
    }

    //....
```

You might be wondering, "Why do I need to implement these methods if I only want to change the `generate` method?"

The reason is that the `AdminContextProvider` interface requires us to implement all its defined methods. In this case, we must implement these methods and call the original implementations, as demonstrated with the `setRoute` and `get` methods.

> For simplicity, I haven't included all methods in this example, but it's important to note that you must implement all of them.

## Complete Implementation

```php
//src/Decorator/AdminUrlGeneratorDecorator.php
<?php

declare(strict_types = 1);

namespace App\Decorator;

use App\Event\UrlGeneratedEvent;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGeneratorInterface;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;
use Symfony\Component\DependencyInjection\Attribute\AutowireDecorated;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

#[AsDecorator(decorates: AdminUrlGenerator::class)]
class AdminUrlGeneratorDecorator implements AdminUrlGeneratorInterface
{
// ...
```

```php
//src/Event/UrlGeneratedEvent.php
<?php

declare(strict_types=1);

namespace App\Event;

class UrlGeneratedEvent
{
    public function __construct(private string $url)
    {
    }

    public function getUrl(): string
    {
        return $this->url;
    }
}
```

```php
//src/Listener/UrlGeneratedListener.php
<?php

declare(strict_types=1);

namespace App\Listener;

use App\Event\UrlGeneratedEvent;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener]
class UrlGeneratedListener
{
    public function __construct(private LoggerInterface $logger)
    {
    }

    public function __invoke(UrlGeneratedEvent $event)
    {
        $this->logger->info(
            'New url generated.',
            [
                'url' => $event->getUrl(),
                'eventClass' => get_class($event),
                'listenerClass' => get_class($this),
            ]
        );
    }
}
```

The `AdminContextProvider` interface is utilized in several classes, including [MenuFactory.php][easy-admin-menu-factory], which is called when loading an admin page that contains a menu.

When you navigate to the `/admin` page, you will notice an info log created by our listener, indicating that our decorator and event system are functioning as intended.

You can check the screenshot below.
![Image with symfony profile page on log section](@assets/images/decorator-post-symfony-profile-page-on-log-section.png)

## Conclusion

In conclusion, the **Decorator Pattern** provides a powerful way to extend and modify the functionality of existing classes without altering their core implementation. By leveraging the `AdminContextProvider` interface, we were able to create a flexible and reusable solution that enhances our application’s capabilities.

I hope this post has provided valuable insights into using decorators in open-source projects. If you have any questions or thoughts, feel free to leave a comment below.

Happy coding!

[decorator-pattern]: https://refactoring.guru/design-patterns/decorator
[easy-admin-bundle]: https://github.com/EasyCorp/EasyAdminBundle
[easy-admin-menu-factory]: https://github.com/EasyCorp/EasyAdminBundle/blob/v4.12.0/src/Factory/MenuFactory.php#L28
[admin-url-generator]: https://github.com/EasyCorp/EasyAdminBundle/blob/v4.12.0/src/Router/AdminUrlGenerator.php
[admin-url-generator-method]: https://github.com/EasyCorp/EasyAdminBundle/blob/v4.12.0/src/Router/AdminUrlGenerator.php#L261
[admin-context-provider-interface]: https://github.com/EasyCorp/EasyAdminBundle/blob/v4.12.0/src/Router/AdminUrlGeneratorInterface.php#L10
[symfony-docorator]: https://symfony.com/doc/current/service_container/service_decoration.html
