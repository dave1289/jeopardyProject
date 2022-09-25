const gameBoard = [
[[],[],[],[],[],[]],
[[],[],[],[],[],[]],
[[],[],[],[],[],[]],
[[],[],[],[],[],[]],
[[],[],[],[],[],[]],
]




let cats = []
let clues = [[],[],[],[],[],[]]

//gets categories at random from jservice API, making sure starting 
async function getCategories() {
    cats = []
    const res = await axios.get(`https://jservice.io/api/categories?count=6&offset=${Math.floor(Math.random() * 123 +100)}`);
    const categories = res.data
    for (item of categories) {
        let title = item.title;
        let id = item.id;
        cats.push({title, id});
    }
}

//puts category names over columns (header of div grid system (HTML gameboard))
function populateCats(){
    for (let i = 0; i < 6; i++) {
        $(`#column${i}`).text(cats[i].title)
    }
}

//puts all clues into appropriate array in clues array (each inner array corresponds to one column left to right)
async function pullClues(arr){
    clues = [[],[],[],[],[],[]]
    for (let i = 0; i< 6; i++) {
        const res = await axios.get(`https://jservice.io/api/category?id=${arr[i].id}`)
        const clueData = res.data.clues
        clues[i].push(clueData)
    }
}

//clears board for refresh button, resets divs to not contain question or answer classes
function clearBoard() {
    const divs = document.querySelectorAll('.card-body');
    for (div of divs) {
        div.textContent = ''
        div.classList.remove('answer')
        div.classList.remove('question')
    }
}

//start button: shows loader then gathers data for gameboard, finally populates and displays gameboard (hides loader)
$('#start').on('click',async function(e){
    $('.loader').css('display', 'block')
    getCategories();
    setTimeout(function(){
        pullClues(cats);
        populateCats();
        $('.loader').css('display', 'none')
    $('#game-board').css('display', 'inline-block')
    },500)
})

//refreshes page: displays loading indicator before clearing page/running clearboard (clears div text and question/answer classes)
$('#refresh').on('click', function(){
    $('.loader').css('display', 'block')
    setTimeout(function(){
        $('.loader').css('display', 'none')
    $('#game-board').css('display', 'none')
    clearBoard();
    },200)
})

$('.card').on('click', function(e){
    const focus = e.target;
   const column = e.target.dataset.col;
   const row = e.target.dataset.row;
   if (!focus.classList.contains('question')){
   try {
       focus.textContent = clues[column][0][row].question;
       focus.classList.toggle('question')
   }
   catch {
    focus.textContent = 'Question error - category too short.'
    focus.classList.add('answer')
   }
}
   else {
    focus.textContent = clues[column][0][row].answer
    focus.classList.add('answer');
   }
})