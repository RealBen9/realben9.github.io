performance.mark("start")
total = 0
for (let i=3; i<1000; i+=3) {
  if (i%15 != 0) {
    total += i
  }
}
for (let i=5; i<1000; i+=5) {
  total += i
}
console.log(total)
performance.mark("end")
console.log(performance.measure("1", "start", "end"))
//returns 233168 in 0.30000000447034836ms
