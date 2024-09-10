# def display(hi)

def calc(x):
    if x == 1:
        return 1
    elif x == 2:
        return 1
    elif x == 3:
        return 2
    elif x == 4:
        return 3
    elif x == 5:
        return 5
    elif x == 6:
        return 8
    elif x == 7:
        return 13
    elif x == 8:
        return 21
    elif x == 9:
        return 34
    elif x == 10:
        return 55

# print hello
print("Give me a number between 1 and 10")
num = int(input())
if num < 1 or num > 10:
    print("Invalid number")
else:
    r = calc(num)
    print(f"The result is: {r}")
