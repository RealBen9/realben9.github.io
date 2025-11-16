performance.mark("start")
total = 2
last1 = 2
last2 = 1
for (let i=3; i<=4000000; i=last2+last1) {
  last2 = last1
  last1 = i
  if (i%2 == 0) {
    total += i
  }
}
console.log(total)
performance.mark("end")
console.log(performance.measure("1", "start", "end"))
//returns 4613732 in 0.30000000447034836ms
