# RefactorCode
A console application to reduce bugs, improve performance and improve readability of your code.

https://github.com/user-attachments/assets/9ca694a3-da23-4ae3-b476-1c071e675a66

## Features
- Checks for any bugs and corrects them (out of bounds, performance issues, logical bugs).
- Removes commented out and unreachable code
- Adds comments to explain existing code
- Splits very large functions into smaller functions for better modularity

## Usage

```
refactorcode ./yourfile
```
By the refactored code is displayed in the console. To specify an output file, use `-o`. See [Options](#options)

## Setup Instructions

Clone the repo:
```
git clone https://github.com/brokoli777/RefactorCode.git
```

Install node libraries
```
pnpm install
```
OR
```
npm install
```
Get an API Key from here: https://ai.google.dev/aistudio 
![Screenshot 2024-09-10 at 3 06 46 PM](https://github.com/user-attachments/assets/958f2257-f16e-4254-ac59-d5342be36b43)

Create a .env file and add the API key like this:
```
API_KEY=YOURAPIKEYHERE
```

Link the application
```
npm link
```

Run the application
```
refactorcode examples/test.py
```

## Options

**-m or --model**: Allows to specify the model

Choices: 
- 1.5f (gemini-1.5-flash) (**default**)
- 1.5p (gemini-1.5-pro)

  ```
  refactorcode examples/test.py -m 1.5p
  ```

**-o or --output**- Allows to set the output file 

**-t or --token-usage:** Allows get information on the tokens used

```
refactorcode examples/test.py -o hello.py
```









