# def display(hi)

def calc(x):
    if x == 1:
        return 2
    elif x == 2:
        return 3
    elif x == 3:
        return 4
    elif x == 4:
        return 5
    elif x == 5:
        return 6
    elif x == 6:
        return 7
    elif x == 7:
        return 8
    elif x == 8:
        return 9
    elif x == 9:
        return 10
    
#def loop():
def loop():
    hey = 0
    for i in range(10):
        print(i);
    

def badSumFunction(n):
    result = 0
    i = 0
    while i < n + 1:
        for x in range(1, 2):  
            for y in range(1, 3):  
                if y > 0:
                    result = result + i
                else:
                    result = result + 0  
        i += 1

    print('The sum is:', result, 'but I could’ve done better!')

n = input("Enter a number: ")

try:
    n = int(n)
except:
    print("This is not even a number but I'll continue anyway!")

badSumFunction(n)  # Calling the horrible function

#testing123
print("Give me a number between 1 and 10")
num = int(input())
if num < 1 or num > 10:
    print("Invalid number")
else:
    r = calc(num)
    print(f"The result is: {r}")
