# Contributing to DataDrop
A big welcome and thank you for considering contributing to this project. We want to make it as easy and transparent as possible for everyone so please take note of the following guidelines and rules.

## Quicklinks
* [Code of Conduct](#code-of-conduct)
* [Getting Started](#getting-started)
    * [Issues](#issues)
    * [Pull Requests](#pull-requests)
    * [Coding Rules](#coding-rules)
    * [Commit Rules](#commit-rules)
* [References](#references)

## Code of Conduct
We take our open source community seriously and hold ourselves and other contributors to high standards of communication. By participating and contributing to this project, you agree to uphold yo our [Code Of Conduct](https://github.com/section-IG/DataDrop/blob/master/.github/CODE_OF_CONDUCT.md).

## Getting started
We use [GitHub](https://github.com) to host code, to track Issues and feature requests, as well as accept Pull Requests (PRs). A few guidelines that cover all these topics:
- Search for existing Issues and PRs before creating your own.
- We work hard to makes sure issues are handled in a timely manner but, depending on the impact, it could take a while to investigate the root cause. A friendly ping in the comment thread to the submitter or a contributor can help draw attention if your issue is blocking.

### Issues
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/section-IG/DataDrop/issues/new/choose); it's that easy!

**Great Bug Reports** tend to have:
- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- Screenshots of what actually happens
- Hardware information (if applicable)
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Pull Requests
Pull requests are the best way to propose changes to the codebase. **We use [Github Flow](https://guides.github.com/introduction/flow/index.html)**. We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

### Coding Rules
To keep the code base neat and tidy, the following rules apply to every change:

> Coding standards
> - `prettier` is king
> - Run `npm run lint` to conform to our lint rules
> - Favor micro library over swiss army knives (rimraf, ncp vs. fs-extra)
> - Be awesome

### Commit Rules
To help everyone with understanding the commit history of DataDrop and to automatically generate a changelog when needed, the following commit rules are enforced. To make your life easier, DataDrop is commitizen-friendly and provides the npm run-script `commit`.

> Commit standards
> - [conventional-changelog](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/prompt)
> - husky commit message hook available
> - present tense
> - message format of `$type($scope): $message`

### Any contributions you make will be under the **GNU General Public License v3.0**
In short, when you submit code changes, your submissions are understood to be under the same [GPL-3.0 License](https://choosealicense.com/licenses/gpl-3.0/) that covers the project. Feel free to contact the maintainers if that's a concern.

## References
These guidelines are heavily inspired of [Auth0's Open Source Template](https://raw.githubusercontent.com/auth0/open-source-template/master/GENERAL-CONTRIBUTING.md), [Conventional Changelog's Commitlint](https://raw.githubusercontent.com/conventional-changelog/commitlint/9b4100915233a34878f35a9b3548485a33d31899/.github/CONTRIBUTING.md) and [a gist of BrianDK](https://gist.githubusercontent.com/briandk/3d2e8b3ec8daf5a27a62/raw/8bc29dd83d0f7cc2d31f8c6741e787c95abb6497/CONTRIBUTING.md).
