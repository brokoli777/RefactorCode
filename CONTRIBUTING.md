<!-- omit in toc -->

# Contributing to RefactorCode

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
>
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

<!-- omit in toc -->

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
  - [Commit Messages](#commit-messages)
- [Join The Project Team](#join-the-project-team)

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation]().

Before you ask a question, it is best to search for existing [Issues](https://github.com/brokoli777/RefactorCode/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/brokoli777/RefactorCode/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

<!--
You might want to create a separate issue tag for questions and include it in this description. People should then tag their issues accordingly.

Depending on how large the project is, you may want to outsource the questioning, e.g. to Stack Overflow or Gitter. You may add additional contact and information possibilities:
- IRC
- Slack
- Gitter
- Stack Overflow tag
- Blog
- FAQ
- Roadmap
- E-Mail List
- Forum
-->

## I Want To Contribute

> ### Legal Notice <!-- omit in toc -->
>
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

<!-- omit in toc -->

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/brokoli777/RefactorCodeissues?q=label%3Abug).
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
  - Stack trace (Traceback)
  - OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
  - Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
  - Possibly your input and the output
  - Can you reliably reproduce the issue? And can you also reproduce it with older versions?

<!-- omit in toc -->

#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to <bjogi1@myseneca.ca>.

<!-- You may add a PGP key to allow the messages to be sent encrypted as well. -->

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/brokoli777/RefactorCode/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the _reproduction steps_ that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

<!-- You might want to create an issue template for bugs and errors that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for RefactorCode, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation]() carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/brokoli777/RefactorCode/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

<!-- omit in toc -->

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/brokoli777/RefactorCode/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux. <!-- this should only be included if the project has a GUI -->
- **Explain why this enhancement would be useful** to most RefactorCode users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

<!-- You might want to create an issue template for enhancement suggestions that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

### Your First Code Contribution

<!-- TODO
include Setup of env, IDE and typical getting started instructions?

-->

#### Setup Environment

To get started with RefactorCode, follow these setup steps to configure your development environment.

**Clone the Repository**

First, clone the repository to your local machine:

```bash
git clone https://github.com/brokoli777/RefactorCode.git
```

**Install Dependencies**

Navigate into the project directory and install the necessary Node libraries:

```bash
pnpm install
```

OR

```bash
npm install
```

#### Configuration

You'll need an API key to use RefactorCode. You can get it for free from [Google AI Studio](https://ai.google.dev/aistudio)
Generate a key and copy the value. You will set it for the project in the next step.

#### Configuration Setup

To configure your application, there are 2 options, creating a `.env` file or a `.toml` file:

**Option 1**: Create a `.env` file in your project root directory, and add the API key like this:

```bash
API_KEY=YOURAPIKEYHERE
```

**Option 2**: Create a `.toml` file named `.refactorcode.toml` in your home directory, and add your API key and/or preferences:

1. **Create the TOML File**:  
   Open your terminal and run the following command to create a new TOML file in your home directory:

   ```bash
   touch ~/.refactorcode.toml
   ```

2. **Copy the Sample Configuration**:  
   Next, copy the sample configuration from `.refactorcode.toml.example` into your newly created `.refactorcode.toml` file:

   ```bash
   cp .refactorcode.toml.example ~/.refactorcode.toml
   ```

3. **Edit the Configuration**:  
   Open the `.refactorcode.toml` file in your preferred text editor, and add your API key value, and any other preferences (e.g. MODEL) you need.

**Link the application**

```bash
npm link
```

**Run the application**

```bash
refactorcode examples/test.py
```

## Styling

We use [Prettier](https://prettier.io/) as our code formatter to maintain consistent styling across the project. Prettier automatically enforces rules for code style, including indentation, spacing, and line wrapping, making it easy to ensure a clean, readable codebase.

**Formatting Command:**

To format the entire project, run the following command from the root directory:

```bash
npm run format
```

This command applies Prettier formatting to all relevant files, such as JavaScript, TypeScript, HTML, CSS, and more. Please ensure your code is formatted before committing changes.

### Linter

We use ESLint to maintain code quality and ensure consistent syntax across the project. ESLint helps catch syntax errors, enforce style rules, and improve code readability.

**Configuration:**

- Our ESLint configuration is set up in eslint.config.js, specifying the rules and file patterns to lint. We are currently using the recommended defaults.
- Files and directories that should be excluded from linting are defined in the `ignore` array within the ESLint configuration. This includes directories like node_modules/, dist/, build/, or other files as needed.

**Running ESLint:**

To run the linter across the entire project, use the following command:

```bash
npm run lint
```

ESLint can also fix certain issues automatically:

```bash
npm run lint:fix
```

Note: Ensure your code passes the linter before committing changes to maintain quality across the project.

### Editor/IDE Integration

**1. Install Extensions**
If you're using Visual Studio Code, install the following extensions from the Extensions Marketplace:

(ESLint)[https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode]
(Prettier - Code formatter)[https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint]

**2. Check VS Code Settings**

The settings.json in the .vscode folder specifies running prettier and eslint on save. No additional configuration is needed.


### Tests

Feel free to add any tests to ensure your feature/fix works as expected. Please run `npm run test` to check ensure the code change did not break any existing features. There is also a github workflow to run the tests when merging to main.

## Attribution

This guide is based on the **contributing-gen**. [Make your own](https://github.com/bttger/contributing-gen)!
