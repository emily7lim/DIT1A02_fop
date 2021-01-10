/* DIT/FT/1A/02, Emily Lim Xiang Qin, P1936207 */
var input = require('readline-sync');
var fs = require('fs');
class MCQ {
    constructor(question, choice, answer, category) {
        this.question = question;
        this.choice = choice;
        this.answer = answer;
        this.category = category;
    }//constructor
} //class mcq

class Quiz {
    constructor() {
        this.questionPool = [];
        this.selectedcat = [];
        // populate MCQS from questions.json and push them into the array. 
        var questions = fs.readFileSync('questions.json');
        //Use the JavaScript function JSON.parse() to convert text into a JavaScript object:
        questions = JSON.parse(questions);
        shuffleArray(questions);
        for (var i = 0; i < questions.length; i++) {
            this.questionPool.push(new MCQ(questions[i].question, questions[i].choice, questions[i].answer, questions[i].category));
        }

        this.userAnswers = ['', '', '', '', ''];
        this.freePassCount = 1;
        this.timeLimitSeconds = 360; //seconds
    }//end constructor

    getTimeLeft() {
        var currentDate = new Date();
        var currentTime = parseInt(currentDate.getTime() / 1000); //time in miliseconds, 1s = 1000ms
        var timeTaken = currentTime - this.startTime;
        var timeLeft = this.timeLimitSeconds - timeTaken;
        return timeLeft;
    }

    getInstructionPg() {
        console.log("\n-= Welcome to Quiz Application =-\n");
        this.name = input.question("Please enter your name: ");
        var welcomeMessage = "\nHi " + this.name + ", you have " + this.freePassCount + " free pass for this quiz. However, free pass is only applicable before the summary page of your answers. Time limit: " + this.timeLimitSeconds + " seconds. Once you choose your category, the timer will start. When timer becomes 0, quiz will be submitted automatically.\n";
        console.log(welcomeMessage);
    } //getInstructionPg()

    getQuestion(questionNumber) {
        var fourchoice = "";
        for (var k = 0; k < 4; k++) {
            fourchoice += "\n(" + (k + 1) + ")" + this.selectedcat[questionNumber].choice[k];
        }
        return ("\nQuestion " + (questionNumber + 1) + ": " + this.selectedcat[questionNumber].question + fourchoice);
    }//getQuestion()

    getAnswer(questionNumber) {
        return (parseInt(this.selectedcat[questionNumber].answer) + 1);
    }//getAnswer()

    chooseCategory() {
        var menu = "Please choose the quiz category you would like to attempt:\n";
        menu += "(1) IT\n(2) BIOLOGY\n(3) MATH\n(4) CHEMISTRY\n>> ";
        var category = "";
        var categorySelected = false;
        while (!categorySelected) {
            category = input.question(menu);
            if (isNaN(category) == false && category != '') {
                if (parseInt(category) <= 4 && parseInt(category) >= 1) {
                    categorySelected = true;
                }
            }
            if (categorySelected == false) {
                console.log("Hi " + this.name + ",please enter a number between 1 and 4");
            }
        } //while
        if (category == '1') {
            console.log("\n[IT] category selected.");
        }
        else if (category == '2') {
            console.log("\n[BIOLOGY] category selected.");
        }
        else if (category == '3') {
            console.log("\n[MATH] category selected.");
        }
        else if (category == '4') {
            console.log("\n[CHEMISTRY] category selected.");
        }
        for (var i = 0; i < this.questionPool.length; i++) {
            if (this.questionPool[i].category == category) {
                this.selectedcat.push(this.questionPool[i]);
            }
        }
        var date = new Date();
        this.startTime = parseInt(date.getTime() / 1000); //start timer
    } //chooseCategory()

    displayQuestion() {
        var design = ("\n~Enter 1 to 4 for answer, p for previous question, n for next question, fp for free pass~\n>> ");
        var qnsno = 0;
        while (qnsno < 5) {
            var timeLeft = this.getTimeLeft();
            if (timeLeft <= 0) {
                break;
            }
            var userinput = input.question(q1.getQuestion(qnsno) + "\n-----" + timeLeft + "s left-----" + design);
            if (userinput >= 1 && userinput <= 4) {
                this.userAnswers[qnsno] = userinput;
                qnsno++;
            }
            else if (userinput == 'P' || userinput == 'p') {
                if (qnsno == 0) {
                    var userinput = input.question(q1.getQuestion(qnsno) + "\n-----" + timeLeft + "s left-----" + design);
                }
                else {
                    qnsno--;
                }
            }
            else if (userinput == 'N' || userinput == 'n') {
                qnsno++;
            }
            else if (userinput == 'FP' || userinput == 'fp') {
                if (this.freePassCount > 0) {
                    console.log("The answer for this question is (" + q1.getAnswer(qnsno) + ").")
                    this.freePassCount--;
                }
                else {
                    console.log("You have no free pass left.");
                }
            }
        } // while
    }//displayQuestion()

    checkAnswered() {
        var quizCompleted = false;
        while (!quizCompleted) {
            // check for time limit
            var timeLeft = this.getTimeLeft();
            if (timeLeft <= 0) {
                console.log("you ran out of time");
                break;
            }
            var isAnswered = 0;
            console.log("\n---Here are your answers--- (" + timeLeft + "s left)");
            for (var i = 0; i < this.userAnswers.length; i++) {
                if (this.userAnswers[i] != '') {
                    console.log("\nQuestion " + (i + 1) + ": " + this.selectedcat[i].question + "\nAnswer: " + "(" + this.userAnswers[i] + ") " + this.selectedcat[i].choice[this.userAnswers[i] - 1]);
                    isAnswered++;
                }
                else {
                    console.log("\nQuestion " + (i + 1) + ": " + this.selectedcat[i].question + "\nAnswer: Not answered");
                }
            }//for
            var userConfirmation = input.question("\nEnter 0 to submit or [1 to 5] to change your answer.\n>> ");
            timeLeft = this.getTimeLeft();
            if (timeLeft <= 0) {
                console.log("you ran out of time");
                break;
            }
            if (userConfirmation == '0') {
                quizCompleted = true;
                if (isAnswered < 5) {
                    console.log("\n!Please answer all questions before the time is up!");
                    quizCompleted = false;
                }
            }
            else if (userConfirmation != isNaN) {
                userConfirmation = parseInt(userConfirmation);
                if (userConfirmation <= 5 && userConfirmation >= 1) {
                    var userinput = input.question(q1.getQuestion(userConfirmation - 1) + "\n-----" + timeLeft + "s left-----\n>> ");
                    if (userinput >= 1 && userinput <= 4) {
                        this.userAnswers[userConfirmation - 1] = userinput;
                    }
                }
            }//else if
        }//while
    }//checkAnswered

    getResult() {
        var finalScore = 0;
        for (var i = 0; i < this.selectedcat.length; i++) {
            var correctAnswer = parseInt(this.selectedcat[i].answer) + 1;
            var userAnswer = this.userAnswers[i];
            //javascript interprets isNaN('') as 0 thus it evaluates to false
            if (isNaN(userAnswer) == false && userAnswer != '') {
                userAnswer = parseInt(userAnswer);
                if (correctAnswer == userAnswer) {
                    console.log("\nQuestion " + (i + 1) + ": " + this.selectedcat[i].question + "\nYour answer: " + "(" + userAnswer + ") " + this.selectedcat[i].choice[this.userAnswers[i] - 1] + " -- > Correct!");
                    finalScore++;
                }
                else {
                    console.log("\nQuestion " + (i + 1) + ": " + this.selectedcat[i].question + "\nYour answer: " + "(" + userAnswer + ") " + this.selectedcat[i].choice[this.userAnswers[i] - 1] + " -- > Wrong!\nThe correct answer is: " + "(" + correctAnswer + ") " + this.selectedcat[i].choice[correctAnswer - 1]);
                }
            }
            else {
                console.log("\nQuestion " + (i + 1) + ": " + this.selectedcat[i].question + "\nYour answer: <blank> \nThe correct answer is: " + "(" + correctAnswer + ") " + this.selectedcat[i].choice[correctAnswer - 1]);
            }
        }
        console.log("\n" + this.name + ", your score is: " + finalScore + "/5");
        if (finalScore >= 4) {
            console.log("Congrats!");
        }
        else if (finalScore <= 3) {
            console.log("Please try harder.");
        }
    }//getResult

    startQuiz() {
        this.getInstructionPg();
        this.chooseCategory();
        this.displayQuestion();
        this.checkAnswered();
        this.getResult();
    }
}//end class Quiz

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

var q1 = new Quiz();
q1.startQuiz();