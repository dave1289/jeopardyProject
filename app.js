//Pulls random question from API based on value and category **MUST IMPLEMENT THIS**
let gameCats = []
let catIds = []
async function randQuestion(category) {
    const res = await axios.get(`https://jservice.io/api/clues?category=${category}`)
    const data = res.data[0]
    const q = data.question
    const a = data.answer
    const question = {q, a}
    console.log(question)
    return question;
}

//pulls starting categories for game
async function getCategories(){
    const res = await axios.get('https://jservice.io/api/categories?count=100&offset=101')
    gameCats = []
    const dupeChk = []
    const catsFinal = []
    const catsRaw = res.data;
    for (item of catsRaw) {
        let title = item.title;
        let id = item.id;
        catsFinal.push({title, id});
    }
    for (let i = 0; i < 6; i++) {
        let item = Math.floor(Math.random()*101);
        dupeChk.push(item);
        if (dupeChk.indexOf(item) !== -1) {
            Math.floor(Math.random() * 101)
        }
        newCat = catsFinal[item];
        gameCats.push(newCat);
    }
    extractCatId(gameCats)
    populateCats();
}

function populateCats(){
    for (let i = 0; i < 6; i++) {
        $(`#column${i}`).text(gameCats[i].title)
    }
}

function extractCatId(array){
    catIds = []
    for (cats of array) {
        catIds.push(cats.id);   
    }
    return catIds
}

//start handler
$('#start').on('click', function(e){
    e.preventDefault();
    getCategories();
})

//question click handler
//currently pulls a random question without cateogry (IMPLEMENT) and does nothing else.
//must implement further changes
$(".card").on('click', function(e){
    //pulls column number from clicked card for category, col # is id index of catIds
    console.log(e.target.dataset.col)
    let column = e.target.dataset.col;
    let id = catIds[column];    
    randQuestion(id)
})