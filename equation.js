var result;
var score = 0;
var backgroundImages = [];

/* Generate equation that is in the range of [0,9]; eqn = a + b*/
generateEquation = () => {
  /* Generate numbers a, b */
  const a = Math.floor(Math.random() * 6);
  const b = Math.floor(Math.random() * 5);
  document.getElementById("a").innerHTML = a;
  document.getElementById("b").innerHTML = b;

  /* Set up Enumns */
  const mul = 0;
  const add = 1;
  const sub = 2;
  const div = 3;

  /* generate a random number for operation */
  const op = Math.floor(Math.random() * Math.floor(4));

  if (op == mul && a * b < 10) {
    document.getElementById("operator").innerHTML = "*";
    result = a * b;
  } else if (op == div && a != 0 && b != 0 && a % b == 0 && a != 1 && b != 1) {
    document.getElementById("operator").innerHTML = "/";
    result = a / b;
  } else if (op == sub && a > b) {
    document.getElementById("operator").innerHTML = "-";
    result = a - b;
  } else {
    document.getElementById("operator").innerHTML = "+";
    result = a + b;
  }
};

checkResult = () => {
  const modelPrediction = predictImageNumber();
  //console.log(`ModelPrediction: ${modelPrediction}, Actual Answer: ${result}`);

  if (modelPrediction == result) {
    score++;
    //console.log("Correct!" + score);
    if (score <= 6) {
      backgroundImages.push(`url("images/background${score}.svg")`);
      document.body.style.backgroundImage = backgroundImages;
    } else {
      //alert("Congrats, you're a math genius. Start over for next round!");
      $(".ui.modal").show();
      //on restart button press: reset
      $(".reset").click(function () {
        score = 0;
        backgroundImages = [];
        document.body.style.backgroundImage = backgroundImages;
        //hide modal:
        $(".ui.modal").hide();
      });
    }
  } else {
    //alert("Sorry, that wasn't what we were expecting. Try again!");
    $(".mistake").show();
    /* continue with the game for next round*/
    $(".next").click(() => {
      $(".mistake").hide();
      if (score != 0) {
        score--;
      }
      //console.log("wrong" + score);
      setTimeout(() => {
        backgroundImages.pop();
        document.body.style.backgroundImage = backgroundImages;
      }, 500);
    });
  }
};
