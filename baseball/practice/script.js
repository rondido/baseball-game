(function () {
  "use strict";
  const get = (target) => document.querySelector(target);

  const init = () => {
    get("form").addEventListener("submit", (event) => {
      playGame(event);
    });
    setPassword();
  };
  //옵션 정의
  const baseball = {
    //게임 횟수
    limit: 10,
    //자릿수
    digit: 4,
    //게임 시기 횟수
    trial: 0,
    end: false,
    $quesition: get(".ball_question"),
    $answer: get(".ball_answer"),
    $input: get(".ball_input"),
  };
  //구조 분해 할당
  const { limit, digit, $quesition, $answer, $input } = baseball;
  let { trial, end } = baseball;

  const setPassword = () => {
    //패스 워드 지정
    const gameLimit = Array(limit).fill(false);
    let password = "";
    while (password.length < digit) {
      const random = parseInt(Math.random() * 10, 10);

      if (gameLimit[random]) {
        continue;
      }
      password += random;
      gameLimit[random] = true;
    }
    baseball.password = password;
  };

  const onPlayed = (number, hint) => {
    //시도를 했을 때 number: 내가 입력한 숫자, hit: 현재 어떤 상황?
    return `<em>${trial}차 시도</em>: ${number}, ${hint}`;
  };
  const isCorrect = (number, answer) => {
    //번호가 같은가?
    return number === answer;
  };

  const isDuplicate = (number) => {
    //중복이 있는가?
    return [...new Set(number.split(""))].length !== digit;
  };
  const getStrikes = (number, answer) => {
    //스트라이크 카운트
    let strike = 0;
    const nums = number.split("");
    nums.map((digit, index) => {
      if (digit === answer[index]) {
        strike++;
      }
    });
    return strike;
  };
  const getBalls = (number, answer) => {
    //볼 카운트
    let ball = 0;
    const nums = number.split("");
    const gameLimit = Array(limit).fill(false);
    answer.split("").map((num) => {
      gameLimit[num] = true;
    });
    nums.map((num, index) => {
      if (answer[index] !== num && !!gameLimit[num]) {
        ball++;
      }
    });

    return ball;
  };
  const getResult = (number, answer) => {
    //시도에 따른 결과는?
    if (isCorrect[(number, answer)]) {
      end = true;
      $answer.innerHTML = baseball.password;
      return "홈런!!";
    }
    const strikes = getStrikes(number, answer);
    const balls = getBalls(number, answer);

    return "STRIKE : " + strikes + ", BALl :" + balls;
  };
  const playGame = (event) => {
    // 게임 플레이
    event.preventDefault();
    if (!!end) {
      return;
    }
    const inputNumber = $input.value;
    const { password } = baseball;

    if (inputNumber.length !== digit) {
      alert(`${digit}자리 숫자를 입력해주세요.`);
    } else if (isDuplicate(inputNumber)) {
      alert(`중복 숫자가 있습니다.`);
    } else {
      trial++;
      const result = onPlayed(inputNumber, getResult(inputNumber, password));
      $quesition.innerHTML += `<span>${result}</span>`;
      if (limit <= trial && !isCorrect(inputNumber, password)) {
        alert("쓰리 아웃");
        end = true;
        $answer.innerHTML = password;
      }
    }
    $input.value = "";
    $input.focus();
  };

  init();
})();
