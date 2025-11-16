performance.mark("start")
test = 600851475143
divCheck = false
/*
let I be 2.
check if X is divisble by I.
if so, divide X by I, repeat.
otherwise, increment I by 1.
repeat until I = 50% of X.
return X.
*/
while (divCheck == false) {
  divCheck = true
  for (let i=2; i<=(test-test%2)/2; i++) {
    if (test%i == 0) {
      test = test/i
      divCheck = false
      break
    }
  }
}
console.log(test)
performance.mark("end")
console.log(performance.measure("1", "start", "end"))
//returns 6857 in 0.8999999985098839ms
