let objArray = [
  {
    a:{
      goal: 228,
    }
  },
  {b:2}
];

let newArray = JSON.parse(JSON.stringify(objArray));

newArray[0].a.goal = 322;

console.log(objArray[0].a.goal)
console.log(newArray[0].a.goal)
