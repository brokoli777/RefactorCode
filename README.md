# RefactorCode

A console application to reduce bugs, improve performance and improve readability of your code.

https://github.com/user-attachments/assets/9ca694a3-da23-4ae3-b476-1c071e675a66

## Features

- Checks for any bugs and corrects them (out of bounds, performance issues, logical bugs).
- Removes commented out and unreachable code.
- Adds comments to explain existing code.
- Splits very large functions into smaller functions for better modularity.

## Usage

```bash
refactorcode ./yourfile
```

The refactored code is displayed in the console. To specify an output file, use `-o`. See [Options](#options) for more details.

## Installation

Ensure you have npm and node.js installed on your computer:
[Node.js](https://nodejs.org/en)

Install the package from [npm](https://www.npmjs.com/package/refactorcode), either for the project or globally

```bash
npm install refactorcode
```

OR

```bash
npm install -g refactorcode
```

Get an API Key from here: https://ai.google.dev/aistudio
![Screenshot 2024-09-10 at 3 06 46 PM](https://github.com/user-attachments/assets/958f2257-f16e-4254-ac59-d5342be36b43)

### Configuration Setup

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

If you want to contribute to project or make a custom version of the library, here are the instructions:

## Development Setup Instructions

### Clone the repo

```bash
git clone https://github.com/brokoli777/RefactorCode.git
```

### Install node libraries

```bash
pnpm install
```

OR

```bash
npm install
```

### Link the application

```bash
npm link
```

### Run the application

```bash
refactorcode examples/test.py
```

## Options

**-m or --model**: Allows to specify the model

Choices:

- 1.5f (gemini-1.5-flash) (**default**)
- 1.5p (gemini-1.5-pro)

```bash
refactorcode examples/test.py -m 1.5p
```

**-o or --output**- Allows to set the output file

```bash
refactorcode examples/test.py -o hello.py
```

**-t or --token-usage:** Allows get information on the tokens used

**-s or --stream** Streams the response as it is received
