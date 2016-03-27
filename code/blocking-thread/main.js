// var cpuIntensive = document.getElementById('cpuIntensive');
// var pressMe = document.getElementById('pressMe');
//
// var counter = 0;
// var counter2 = 0;
//
// cpuIntensive.addEventListener("click", function(){
//   console.clear();
//
//   for (var i = 0; i < 100000; i++) {
//     counter++;
//     console.log(counter);
//   }
//
//   document.getElementById("writeMe").innerHTML = counter;
// });
//
// pressMe.addEventListener("click", function(){
//   document.getElementById("writeMe2").innerHTML = counter2;
//   counter2++;
// });
function fn(cb) {
  console.log('one');
  cb();
  console.log('three');
}

function tutti() {
  console.log('two');
}

fn(tutti);
