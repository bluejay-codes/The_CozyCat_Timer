const submitBtn = document.getElementById("submit-btn");
const textInput = document.getElementById("textInput");
const namelist = document.getElementById("task-list");
const taskData = []

submitBtn.addEventListener('click', getTask);

function getTask(){
    nameData.push(textInput.value);
    textInput.value="";
    console.log(taskData);
}

